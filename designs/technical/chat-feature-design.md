# Chat Feature - Technical Design

## 1. Overview

This document describes the technical design for adding an AI-powered chat assistant to the Origin Hair Collective marketing site. The chat feature allows visitors to ask questions about products, hair care, orders, and general inquiries and receive instant responses from an AI agent backed by an LLM. Conversations are persisted for analytics and review by admins through a read-only conversation history view in the admin dashboard.

### 1.1 Goals

- Allow site visitors (anonymous or authenticated) to chat with an AI assistant from the marketing site
- Generate contextual AI responses using an LLM with knowledge of Origin Hair Collective products, origins, and services
- Stream AI responses in real time using WebSocket connections (SignalR)
- Persist all conversations and messages for admin review, analytics, and model improvement
- Provide admins with a read-only conversation history view in the admin dashboard
- Integrate with the existing event-driven architecture for notifications and analytics
- Follow the established microservice patterns (clean architecture, database-per-service, MassTransit events)

### 1.2 Non-Goals

- Live human-to-human chat (future phase — human handoff may be added later)
- File/image attachments in chat (future phase)
- Group conversations or multi-party chat
- Video or voice calls
- Fine-tuning or training custom models

---

## 2. Architecture

### 2.1 New Microservice: Chat Service

A new `Chat` microservice will be added following the same layered structure as existing services:

```
src/Services/Chat/
  OriginHairCollective.Chat.Core/
    Entities/
      Conversation.cs
      ChatMessage.cs
    Enums/
      ConversationStatus.cs
      MessageSender.cs
    Interfaces/
      IConversationRepository.cs
      IChatMessageRepository.cs
  OriginHairCollective.Chat.Infrastructure/
    Data/
      ChatDbContext.cs
    Repositories/
      ConversationRepository.cs
      ChatMessageRepository.cs
  OriginHairCollective.Chat.Application/
    Dtos/
      ConversationDto.cs
      ChatMessageDto.cs
      CreateConversationDto.cs
      SendMessageDto.cs
      ConversationSummaryDto.cs
    Mapping/
      ChatMappingExtensions.cs
    Services/
      IChatService.cs
      ChatService.cs
    Ai/
      IChatAiService.cs
      ChatAiService.cs
      SystemPromptBuilder.cs
    Consumers/
      ProductCatalogChangedConsumer.cs
  OriginHairCollective.Chat.Api/
    Controllers/
      ConversationsController.cs
    Hubs/
      ChatHub.cs
    Program.cs
```

### 2.2 System Context

```
                   +-----------------+
                   |  Angular SPA    |
                   |  (Visitor)      |
                   +--------+--------+
                            |
                   HTTP + WebSocket (SignalR)
                            |
                   +--------v--------+
                   |  API Gateway    |
                   |  (YARP)         |
                   +--------+--------+
                            |
              +-------------+-------------+
              |                           |
     HTTP REST (YARP)          WebSocket passthrough
              |                           |
     +--------v--------+     +-----------v-----------+
     |  Chat Service   |     |  Chat Service         |
     |  REST API       |     |  SignalR Hub           |
     |  /conversations |     |  /hubs/chat            |
     +--------+--------+     +-----------+-----------+
              |                           |
              +-------+-------+-----------+
                      |       |
             +--------v--+ +--v-----------+
             | ChatDb    | | LLM Provider |
             | (SQLite)  | | (Anthropic/  |
             | chat.db   | |  OpenAI)     |
             +-----------+ +--------------+
                      |
             +--------v--------+
             |  RabbitMQ       |
             |  (MassTransit)  |
             +-----------------+
```

### 2.3 Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| API Gateway (YARP) | New route `/api/chat/{**catch-all}` + WebSocket route `/hubs/chat/{**catch-all}` | Route REST and WebSocket traffic to Chat Service |
| Aspire AppHost | New project reference `chat-api` | Service orchestration and discovery |
| Identity Service | JWT validation on admin REST endpoints | Authenticate admins for conversation history access |
| LLM Provider | HTTP API (Anthropic Claude or OpenAI) | Generate AI responses to visitor messages |
| Catalog Service | Consumes product/origin data events or queries REST API | Provide product knowledge context to the AI |
| Notification Service | Consumes `ChatConversationStartedEvent` | Log/notify when conversations are started (analytics) |
| Shared Contracts | New events: `ChatConversationStartedEvent`, `ChatMessageSentEvent` | Cross-service event communication |

---

## 3. Domain Model

### 3.1 Entities

#### Conversation

```csharp
public sealed class Conversation
{
    public Guid Id { get; set; }
    public string SessionId { get; set; } = string.Empty;   // Browser session / anonymous visitor ID
    public string? VisitorName { get; set; }                 // Optional, collected if visitor provides it
    public string? VisitorEmail { get; set; }                // Optional, collected if visitor provides it
    public ConversationStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastMessageAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public int MessageCount { get; set; }
    public ICollection<ChatMessage> Messages { get; set; } = [];
}
```

#### ChatMessage

```csharp
public sealed class ChatMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    public MessageSender SenderType { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public int? TokensUsed { get; set; }                    // Track LLM token usage for AI responses
    public Conversation Conversation { get; set; } = null!;
}
```

### 3.2 Enums

```csharp
public enum ConversationStatus
{
    Active,
    Closed,
    Escalated       // Reserved for future human handoff
}

public enum MessageSender
{
    Visitor,
    Assistant
}
```

### 3.3 Database Schema (SQLite - chat.db)

```sql
CREATE TABLE Conversations (
    Id              TEXT PRIMARY KEY,
    SessionId       TEXT NOT NULL,
    VisitorName     TEXT NULL,
    VisitorEmail    TEXT NULL,
    Status          INTEGER NOT NULL DEFAULT 0,
    CreatedAt       TEXT NOT NULL,
    LastMessageAt   TEXT NULL,
    ClosedAt        TEXT NULL,
    MessageCount    INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IX_Conversations_SessionId ON Conversations(SessionId);
CREATE INDEX IX_Conversations_Status ON Conversations(Status);
CREATE INDEX IX_Conversations_CreatedAt ON Conversations(CreatedAt);

CREATE TABLE ChatMessages (
    Id              TEXT PRIMARY KEY,
    ConversationId  TEXT NOT NULL,
    SenderType      INTEGER NOT NULL,
    Content         TEXT NOT NULL,
    SentAt          TEXT NOT NULL,
    TokensUsed      INTEGER NULL,
    FOREIGN KEY (ConversationId) REFERENCES Conversations(Id)
);

CREATE INDEX IX_ChatMessages_ConversationId ON ChatMessages(ConversationId);
```

---

## 4. API Design

### 4.1 REST Endpoints

Visitor-facing endpoints are unauthenticated (session-based). Admin endpoints require JWT authentication.

#### Visitor Endpoints (Unauthenticated)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/conversations` | None (session ID) | Start a new conversation |
| `GET` | `/conversations/{id}` | None (session ID validated) | Get conversation with messages |
| `POST` | `/conversations/{id}/messages` | None (session ID validated) | Send a message and receive AI response (REST fallback if WebSocket unavailable) |

#### Admin Endpoints (JWT Required)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/conversations` | Admin | List all conversations (filterable by status, date range) |
| `GET` | `/conversations/{id}` | Admin | Get conversation with full message history |
| `GET` | `/conversations/stats` | Admin | Get aggregate stats (total conversations, avg messages, common topics) |

### 4.2 DTOs

```csharp
// Request DTOs
public sealed record CreateConversationDto(string SessionId, string InitialMessage, string? VisitorName);
public sealed record SendMessageDto(string Content);

// Response DTOs
public sealed record ConversationDto(
    Guid Id,
    string? VisitorName,
    ConversationStatus Status,
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    int MessageCount,
    ChatMessageDto? LastMessage);

public sealed record ConversationSummaryDto(
    Guid Id,
    string? VisitorName,
    ConversationStatus Status,
    DateTime CreatedAt,
    DateTime? LastMessageAt,
    int MessageCount);

public sealed record ChatMessageDto(
    Guid Id,
    MessageSender SenderType,
    string Content,
    DateTime SentAt);

public sealed record ChatStatsDto(
    int TotalConversations,
    int ActiveConversations,
    double AvgMessagesPerConversation,
    int ConversationsToday);
```

### 4.3 Gateway Configuration

Add to `src/Gateway/OriginHairCollective.ApiGateway/appsettings.json`:

```json
{
  "ReverseProxy": {
    "Routes": {
      "chat-route": {
        "ClusterId": "chat-cluster",
        "Match": {
          "Path": "/api/chat/{**catch-all}"
        },
        "Transforms": [
          { "PathRemovePrefix": "/api/chat" }
        ]
      },
      "chat-hub-route": {
        "ClusterId": "chat-cluster",
        "Match": {
          "Path": "/hubs/chat/{**catch-all}"
        }
      }
    },
    "Clusters": {
      "chat-cluster": {
        "Destinations": {
          "chat-api": {
            "Address": "http://chat-api"
          }
        }
      }
    }
  }
}
```

The WebSocket route (`/hubs/chat`) does not strip a prefix because SignalR negotiation requires the full path. YARP supports WebSocket proxying natively.

---

## 5. Real-Time Communication (SignalR)

### 5.1 Hub Design

The ChatHub is unauthenticated for visitor connections. Visitors are identified by a session ID passed during connection negotiation.

```csharp
public sealed class ChatHub : Hub
{
    // Visitor starts or resumes a conversation
    public async Task StartConversation(string sessionId, string? visitorName, string initialMessage);

    // Visitor sends a message; server responds with streamed AI response
    public async Task SendMessage(Guid conversationId, string sessionId, string content);

    // Visitor reconnects and resumes an existing conversation
    public async Task ResumeConversation(Guid conversationId, string sessionId);
}
```

### 5.2 Server-to-Client Events

| Event | Payload | Recipients | Trigger |
|-------|---------|------------|---------|
| `ConversationStarted` | `{ conversationId }` | Caller | New conversation created |
| `ReceiveMessageChunk` | `{ conversationId, chunk, isComplete }` | Caller (conversation group) | AI response is being streamed token-by-token |
| `ReceiveMessage` | `ChatMessageDto` | Caller (conversation group) | Complete AI response (sent after streaming completes) |
| `Error` | `{ conversationId, message }` | Caller | LLM error or rate limit exceeded |

### 5.3 SignalR Groups

- **Conversation group** (`conversation-{id}`): The visitor's connection joins this group for the duration of the conversation. Used to route streamed AI responses back to the correct client.

### 5.4 Connection Lifecycle

```
Visitor opens chat widget
  -> Client connects to /hubs/chat (unauthenticated)
  -> Client generates or retrieves sessionId from localStorage
  -> Connection established

Visitor sends first message
  -> Client calls StartConversation(sessionId, visitorName, initialMessage)
  -> Server creates Conversation entity, persists visitor message
  -> Server sends visitor message to LLM with product context
  -> Server streams AI response back via ReceiveMessageChunk events
  -> Server persists complete AI response as ChatMessage
  -> Server sends ReceiveMessage with final complete message

Visitor sends follow-up messages
  -> Client calls SendMessage(conversationId, sessionId, content)
  -> Server validates sessionId matches conversation
  -> Server loads conversation history, sends to LLM with context
  -> Server streams AI response back (same pattern)

Visitor returns later (same browser)
  -> Client retrieves sessionId + conversationId from localStorage
  -> Client calls ResumeConversation(conversationId, sessionId)
  -> Server loads and returns conversation history
  -> Visitor can continue chatting

Disconnect
  -> Automatic group cleanup by SignalR
  -> Conversation remains Active for future reconnection
  -> Conversations auto-close after configurable inactivity period (e.g. 24 hours)
```

### 5.5 AI Response Streaming

AI responses are streamed token-by-token to the client for a responsive chat experience:

1. Visitor message is persisted immediately
2. Conversation history (last N messages) is assembled as LLM context
3. LLM API is called with streaming enabled
4. Each token chunk is sent to the client via `ReceiveMessageChunk`
5. When streaming completes, the full response is persisted and `ReceiveMessage` is sent

---

## 6. Event Integration

### 6.1 New Shared Contract Events

Add to `src/Shared/OriginHairCollective.Shared.Contracts/`:

```csharp
public sealed record ChatConversationStartedEvent(
    Guid ConversationId,
    string? VisitorName,
    string FirstMessage,
    DateTime OccurredAt);

public sealed record ChatMessageSentEvent(
    Guid MessageId,
    Guid ConversationId,
    MessageSender SenderType,
    DateTime OccurredAt);
```

### 6.2 Events Published by Chat Service

| Event | Trigger | Consumers |
|-------|---------|-----------|
| `ChatConversationStartedEvent` | Visitor starts a new conversation | Notification Service (logs for analytics) |
| `ChatMessageSentEvent` | A message is sent (visitor or AI) | Notification Service (analytics, usage tracking) |

### 6.3 Events Consumed by Chat Service

| Event | Publisher | Action |
|-------|-----------|--------|
| `ProductCatalogChangedEvent` | Catalog Service | Refresh cached product data used in LLM context (ensures AI has up-to-date product info) |

### 6.4 Notification Service Consumer

A new consumer in the Notification Service handles chat events:

```csharp
public sealed class ChatConversationStartedNotificationConsumer
    : IConsumer<ChatConversationStartedEvent>
{
    public async Task Consume(ConsumeContext<ChatConversationStartedEvent> context)
    {
        // Log conversation for analytics
        // Future: Alert admin if escalation is needed
    }
}
```

---

## 7. Frontend Design

### 7.1 Marketing Site (`origin-hair-collective`)

#### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatWidgetComponent` | Floating widget (global) | Persistent chat launcher button on all pages |
| `ChatWindowComponent` | Overlay / slide-in panel | Full chat window with message thread and input |
| `MessageThreadComponent` | Inside ChatWindow | Displays conversation messages (visitor on right, AI on left) |
| `ChatInputComponent` | Inside ChatWindow | Text input with send button |
| `TypingIndicatorComponent` | Inside MessageThread | Animated indicator shown while AI is generating a response |

#### UX Flow

1. Visitor (no login required) sees a floating chat icon in the bottom-right corner of any page
2. Clicking the icon opens the chat window with a welcome message from the AI assistant
3. Visitor types a question and sends it
4. A typing indicator appears while the AI generates a response
5. The AI response streams in token-by-token for a natural conversational feel
6. Visitor can continue asking follow-up questions (conversation context is maintained)
7. Chat window can be minimized back to the floating icon
8. If the visitor navigates to other pages, the chat state persists (conversation stored in localStorage)
9. If the visitor returns later (same browser), the previous conversation can be resumed

#### Angular Service

```typescript
@Injectable({ providedIn: 'root' })
export class ChatService {
  private hubConnection: signalR.HubConnection;
  private sessionId: string;  // Generated once, stored in localStorage

  // Observable streams for components
  readonly messageChunks$ = new Subject<{ conversationId: string; chunk: string; isComplete: boolean }>();
  readonly messages$ = new Subject<ChatMessage>();
  readonly isConnected$ = new BehaviorSubject<boolean>(false);
  readonly isAiResponding$ = new BehaviorSubject<boolean>(false);

  connect(): void { /* establish SignalR connection (no auth token needed) */ }
  disconnect(): void { /* close connection */ }
  startConversation(message: string, visitorName?: string): void { /* invoke hub method */ }
  sendMessage(conversationId: string, content: string): void { /* invoke hub method */ }
  resumeConversation(conversationId: string): void { /* invoke hub method */ }

  // REST fallback
  getConversation(id: string): Observable<Conversation> { /* GET /api/chat/conversations/{id} */ }
}
```

### 7.2 Admin Dashboard (`origin-hair-collective-admin`)

The admin dashboard provides a **read-only** view of all chat conversations for review and analytics. Admins cannot reply to conversations.

#### Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ChatHistoryPage` | New route `/chat-history` | Full-page conversation history view |
| `ConversationListPanel` | Left panel | Filterable/searchable list of all conversations |
| `ConversationDetailPanel` | Right panel | Read-only view of selected conversation messages |
| `ConversationFilters` | Above list | Filter by status, date range, search by visitor name |
| `ChatStatsCard` | Top of page | Summary metrics (total conversations, avg messages, etc.) |

#### UX Flow

1. Admin navigates to Chat History section in the dashboard sidebar
2. Summary stats displayed at the top (total conversations, active today, avg messages)
3. Left panel shows all conversations sorted by most recent activity
4. Admin can filter by status (Active/Closed) and date range
5. Admin clicks a conversation to view the full message thread (read-only)
6. Admin can see what questions visitors are asking and how the AI is responding

### 7.3 Shared Component Library (`components`)

New reusable components for the shared library:

| Component | Purpose |
|-----------|---------|
| `MessageBubbleComponent` | Renders a single chat message (left/right alignment by sender type) |
| `ChatInputComponent` | Text input with send button (supports Enter to send) |
| `TypingIndicatorComponent` | Animated dots shown while AI is generating a response |

---

## 8. Aspire Orchestration

### 8.1 AppHost Registration

Add to `src/Aspire/OriginHairCollective.AppHost/Program.cs`:

```csharp
var chatApi = builder.AddProject<Projects.OriginHairCollective_Chat_Api>("chat-api")
    .WithReference(messaging);

var apiGateway = builder.AddProject<Projects.OriginHairCollective_ApiGateway>("api-gateway")
    .WithReference(catalogApi)
    .WithReference(inquiryApi)
    .WithReference(orderApi)
    .WithReference(paymentApi)
    .WithReference(contentApi)
    .WithReference(notificationApi)
    .WithReference(identityApi)
    .WithReference(chatApi);  // Add chat-api reference
```

### 8.2 Service Configuration (Program.cs)

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Database
builder.Services.AddDbContext<ChatDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ChatDb")));

// Repositories
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IChatMessageRepository, ChatMessageRepository>();

// Services
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IChatAiService, ChatAiService>();

// LLM Configuration
builder.Services.AddHttpClient("LlmProvider", client =>
{
    client.BaseAddress = new Uri(builder.Configuration["Ai:BaseUrl"]!);
    client.DefaultRequestHeaders.Add("x-api-key", builder.Configuration["Ai:ApiKey"]!);
    client.Timeout = TimeSpan.FromSeconds(60);
});

// MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ProductCatalogChangedConsumer>();
    x.UsingRabbitMq((context, cfg) =>
    {
        cfg.Host(builder.Configuration.GetConnectionString("messaging"));
        cfg.ConfigureEndpoints(context);
    });
});

// SignalR
builder.Services.AddSignalR();

// Auth (for admin endpoints only — chat hub is unauthenticated for visitors)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "OriginHairCollective.Identity",
            ValidateAudience = true,
            ValidAudience = "OriginHairCollective",
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapDefaultEndpoints();
app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");  // Unauthenticated — visitor access

// Ensure database is created
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ChatDbContext>();
    db.Database.EnsureCreated();
}

app.Run();
```

---

## 9. Data Access Patterns

### 9.1 Repository Interfaces

```csharp
public interface IConversationRepository
{
    Task<Conversation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<Conversation?> GetByIdWithMessagesAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetBySessionIdAsync(string sessionId, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetByStatusAsync(ConversationStatus status, CancellationToken ct = default);
    Task<IReadOnlyList<Conversation>> GetAllAsync(int skip = 0, int take = 50, CancellationToken ct = default);
    Task AddAsync(Conversation conversation, CancellationToken ct = default);
    Task UpdateAsync(Conversation conversation, CancellationToken ct = default);
    Task<int> GetCountAsync(CancellationToken ct = default);
    Task<int> GetCountByStatusAsync(ConversationStatus status, CancellationToken ct = default);
}

public interface IChatMessageRepository
{
    Task<IReadOnlyList<ChatMessage>> GetByConversationIdAsync(
        Guid conversationId, int skip = 0, int take = 50, CancellationToken ct = default);
    Task AddAsync(ChatMessage message, CancellationToken ct = default);
}
```

### 9.2 Message Pagination

Messages are loaded in chronological order for the conversation view:

- Default page size: 50 messages
- Client requests older messages by passing a `skip` parameter
- Admin conversation list is paginated (default 20 conversations per page)

---

## 10. Security Considerations

### 10.1 Authorization Rules

| Action | Visitor | Admin |
|--------|---------|-------|
| Start conversation | Yes (via session ID) | No |
| View conversation | Own session's conversations only | All conversations (JWT required) |
| Send message | In own session's conversations only | No (read-only) |
| View conversation history | No (only current conversation) | All conversations (JWT required) |
| View chat stats | No | Yes (JWT required) |

### 10.2 Session-Based Visitor Identity

- Visitors are not authenticated — they are identified by a session ID (UUID generated client-side, stored in localStorage)
- The session ID is passed with every hub invocation and REST request
- Server validates that the session ID matches the conversation being accessed
- Session IDs are opaque and non-guessable (UUID v4)

### 10.3 Admin Endpoint Authentication

- Admin REST endpoints (`GET /conversations`, `GET /conversations/stats`) require JWT authentication
- JWT validation uses the same Identity Service configuration as other admin endpoints

### 10.4 Input Validation

- Message content: Required, max 2000 characters, trimmed, HTML-sanitized
- Visitor name: Optional, max 100 characters
- Rate limiting: Max 20 messages per minute per session ID (prevents abuse)
- Rate limiting: Max 10 new conversations per hour per session ID

### 10.5 LLM Safety

- System prompt instructs the AI to only discuss Origin Hair Collective products and related topics
- AI responses are not user-generated content but should still be rendered safely (no raw HTML)
- LLM API key stored in configuration/secrets (not exposed to clients)

### 10.6 Data Privacy

- Messages are stored in the Chat Service database only
- No message content is included in MassTransit events (only metadata)
- Visitor-provided names/emails are optional and stored only if given
- No PII is sent to the LLM beyond the conversation content itself

---

## 11. AI Integration

### 11.1 LLM Service Design

```csharp
public interface IChatAiService
{
    IAsyncEnumerable<string> GenerateResponseAsync(
        IReadOnlyList<ChatMessage> conversationHistory,
        string visitorMessage,
        CancellationToken ct = default);
}
```

### 11.2 System Prompt & Context

The AI assistant receives a system prompt that includes:

- Role definition: Friendly, knowledgeable assistant for Origin Hair Collective
- Product catalog context: Current products, origins, textures, types, pricing (loaded from cached catalog data)
- Business context: Company information, shipping policies, contact details
- Behavioral guidelines: Stay on-topic, be helpful, recommend products when relevant, suggest contacting support for order-specific issues
- Conversation boundaries: Politely redirect off-topic questions back to hair products and services

```csharp
public class SystemPromptBuilder
{
    // Builds the system prompt with current product catalog context
    public string Build(IReadOnlyList<ProductInfo> products, IReadOnlyList<OriginInfo> origins);
}
```

### 11.3 Context Window Management

- Include the last 20 messages of conversation history in each LLM call
- System prompt + product context is prepended to every request
- If conversation exceeds context limits, older messages are summarized or truncated

### 11.4 LLM Provider Configuration

```json
{
  "Ai": {
    "Provider": "Anthropic",
    "BaseUrl": "https://api.anthropic.com",
    "ApiKey": "configured-via-secrets",
    "Model": "claude-sonnet-4-5-20250929",
    "MaxTokens": 1024,
    "Temperature": 0.7
  }
}
```

The `IChatAiService` implementation abstracts the provider, making it straightforward to swap between Anthropic, OpenAI, or other providers.

---

## 12. Scalability Considerations

### 12.1 Current Phase (SQLite + Single Instance)

For the initial implementation with SQLite:

- SignalR uses in-memory groups (single server instance)
- SQLite handles the expected volume (low concurrent chat sessions for a hair product business)
- This matches the approach of all other services in the system
- LLM API calls are the primary latency bottleneck; streaming mitigates perceived wait time

### 12.2 Future Scaling Path

If the application needs to scale beyond a single instance:

- **Database**: Migrate from SQLite to PostgreSQL (same EF Core provider swap as other services)
- **SignalR Backplane**: Add Redis backplane for multi-instance SignalR (`AddStackExchangeRedis()`)
- **Message archival**: Move old closed conversations to cold storage after a configurable retention period
- **LLM caching**: Cache common question/answer pairs to reduce API costs
- **Human handoff**: Add escalation flow where the AI can flag a conversation for human review, and an admin can take over the conversation in real time

---

## 13. Implementation Phases

### Phase 1: Core Chat Service

- Create Chat microservice with clean architecture layers
- Implement domain entities, database context, repositories
- Build REST API endpoints (visitor + admin)
- Register in Aspire AppHost and API Gateway
- Add shared contract events

### Phase 2: AI Integration

- Implement `IChatAiService` with LLM provider (Anthropic Claude)
- Build `SystemPromptBuilder` with product catalog context
- Implement streaming response support (`IAsyncEnumerable<string>`)
- Add product catalog caching and refresh via MassTransit consumer
- Configure LLM API credentials via Aspire secrets

### Phase 3: Real-Time Messaging (SignalR)

- Add SignalR hub (unauthenticated for visitors)
- Implement `StartConversation`, `SendMessage`, `ResumeConversation` hub methods
- Wire up AI response streaming via `ReceiveMessageChunk` events
- Configure YARP WebSocket proxying

### Phase 4: Visitor Frontend (Marketing Site)

- Build `ChatService` (Angular service with SignalR client)
- Create floating chat widget component (bottom-right corner)
- Implement chat window with message thread and streaming AI responses
- Add typing indicator during AI response generation
- Persist session ID and conversation ID in localStorage for resume

### Phase 5: Admin Frontend (Read-Only History)

- Build chat history page with two-panel layout
- Implement conversation list with filtering (status, date range)
- Build read-only conversation detail panel
- Add chat stats card (total conversations, active today, avg messages)
- Add sidebar nav item for Chat History

### Phase 6: Event Integration and Analytics

- Publish `ChatConversationStartedEvent` and `ChatMessageSentEvent`
- Add consumer in Notification Service for analytics logging
- Consume `ProductCatalogChangedEvent` to refresh AI product context

---

## 14. Dependencies

### Backend NuGet Packages

| Package | Purpose |
|---------|---------|
| `Microsoft.AspNetCore.SignalR` | Real-time WebSocket communication (included in ASP.NET Core) |
| `Microsoft.AspNetCore.Authentication.JwtBearer` | JWT auth for admin REST endpoints |
| `Microsoft.EntityFrameworkCore.Sqlite` | SQLite database provider |
| `MassTransit.RabbitMQ` | Event bus integration |
| `Aspire.Hosting.AppHost` | Service orchestration |

### Frontend npm Packages

| Package | Purpose |
|---------|---------|
| `@microsoft/signalr` | SignalR JavaScript client for Angular |

---

## 15. Testing Strategy

### Backend

- **Unit tests**: ChatService business logic (message validation, session ID verification, rate limiting)
- **Unit tests**: SystemPromptBuilder (verify product context is correctly assembled)
- **Unit tests**: ChatAiService with mocked HTTP client (verify LLM request format, streaming parse logic)
- **Integration tests**: Repository tests against in-memory SQLite, Hub integration tests with test server
- **Consumer tests**: Verify MassTransit consumers handle events correctly using the MassTransit test harness

### Frontend

- **Component tests** (Vitest): Chat widget rendering, message thread display, streaming text rendering
- **E2E tests** (Playwright): Full chat flow — open widget, send message, verify AI response appears, minimize/reopen widget, resume conversation

---

## 16. Observability

The Chat Service inherits the standard observability stack from Aspire ServiceDefaults:

- **Distributed tracing**: OpenTelemetry traces for REST endpoints, SignalR hub method invocations, and LLM API calls
- **Metrics**: Connection count, messages sent per minute, AI response latency, token usage
- **Health checks**: `/health` and `/alive` endpoints (standard pattern)
- **Logging**: Structured logging for connection events, message sends, AI responses, and errors

Custom metrics to track:

| Metric | Type | Description |
|--------|------|-------------|
| `chat.connections.active` | Gauge | Number of active SignalR connections |
| `chat.messages.sent` | Counter | Total messages sent (tagged by sender type: visitor/assistant) |
| `chat.conversations.created` | Counter | New conversations created |
| `chat.ai.response_latency` | Histogram | Time from visitor message to first AI response chunk |
| `chat.ai.tokens_used` | Counter | Total LLM tokens consumed (tagged by input/output) |
| `chat.ai.errors` | Counter | LLM API errors (tagged by error type) |
