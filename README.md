# Origin Hair Collective

E-commerce platform for premium hair products, built with a microservices architecture.

## Tech Stack

- **.NET 9** / **C# 13** — Backend services
- **Angular 21** — Frontend SPA
- **.NET Aspire 9** — Orchestration, service discovery, telemetry
- **YARP 2.2** — API gateway / reverse proxy
- **MassTransit 8.3** + **RabbitMQ** — Async messaging
- **EF Core 9** + **SQLite** — Data access
- **OpenTelemetry** — Distributed tracing and metrics

## Project Structure

```
src/
  Aspire/
    OriginHairCollective.AppHost          # Aspire orchestrator
    OriginHairCollective.ServiceDefaults  # Shared service configuration
  Gateway/
    OriginHairCollective.ApiGateway       # YARP reverse proxy
  Services/
    Catalog/
      OriginHairCollective.Catalog.Core           # Domain entities & interfaces
      OriginHairCollective.Catalog.Infrastructure  # EF Core, repositories
      OriginHairCollective.Catalog.Application     # DTOs, services, mapping
      OriginHairCollective.Catalog.Api             # REST API
    Inquiry/
      OriginHairCollective.Inquiry.Core            # Domain entities & interfaces
      OriginHairCollective.Inquiry.Infrastructure   # EF Core, repositories
      OriginHairCollective.Inquiry.Application      # DTOs, services, consumers
      OriginHairCollective.Inquiry.Api              # REST API
  Shared/
    OriginHairCollective.Shared.Contracts  # Cross-service message contracts
  Web/
    origin-hair-collective-web             # Angular frontend
```

## Prerequisites

- [.NET 9 SDK](https://dotnet.microsoft.com/download/dotnet/9.0)
- [Node.js 22+](https://nodejs.org/)
- [Aspire workload](https://learn.microsoft.com/en-us/dotnet/aspire/) (optional, for AppHost)

## Getting Started

```bash
# Install Aspire workload (requires admin/elevated terminal on Windows)
dotnet workload install aspire

# Build the solution
dotnet build OriginHairCollective.sln

# Build the Angular app
cd src/Web/origin-hair-collective-web
npm install
npx ng build
```

> **Note:** The AppHost project requires the Aspire workload. The other 11 C# projects compile without it.
