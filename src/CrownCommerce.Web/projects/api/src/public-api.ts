/*
 * Public API Surface of api
 */

// Configuration & provider
export { provideApi, API_CONFIG, type ApiConfig } from './lib/api.config';
export { authInterceptor } from './lib/auth.interceptor';
export { errorInterceptor } from './lib/error.interceptor';
export { authGuard } from './lib/guards/auth.guard';

// Models — Common
export type { PagedResult } from './lib/models/common.models';

// Models — Catalog
export type {
  ProductCategory,
  HairProduct,
  HairOrigin,
  ProductImage,
  ProductFilterParams,
  ProductDetail,
  BreadcrumbItem,
  ProductReview,
  CreateProductReviewRequest,
  BundleDealItem,
  BundleDeal,
  CreateProductRequest,
  UpdateProductRequest,
  CreateOriginRequest,
  UpdateOriginRequest,
} from './lib/models/catalog.models';

// Models — CRM
export type {
  ContactStatus,
  CustomerTier,
  CrmBrand,
  LeadSource,
  LeadStatus,
  Customer,
  Lead,
  CreateCustomerRequest,
  CreateLeadRequest,
} from './lib/models/crm.models';

// Models — Identity
export type { LoginRequest, RegisterRequest, AuthResponse, UserProfile, UpdateProfileRequest, AdminUser, ChangePasswordRequest, UpdateUserRoleRequest } from './lib/models/identity.models';

// Models — Order
export type { CartItem, AddToCartRequest, CreateOrderRequest, OrderItem, Order, UpdateOrderStatusRequest, OrderFilterParams } from './lib/models/order.models';

// Models — Payment
export type { CreatePaymentRequest, Payment, ConfirmPaymentRequest, CreateRefundRequest, Refund } from './lib/models/payment.models';

// Models — Content
export type {
  Testimonial,
  CreateTestimonialRequest,
  UpdateTestimonialRequest,
  GalleryImage,
  FaqItem,
  ContentPage,
  BrandStory,
  BrandFounder,
  BrandMission,
  BrandValue,
  BrandTimelineEvent,
  HairCareGuide,
  HairCareSection,
  HairCareTip,
  ShippingPolicy,
  ShippingZone,
  PolicyStep,
  ReturnsPolicy,
  ReturnCondition,
  WholesaleTier,
  CreateGalleryImageRequest,
  UpdateGalleryImageRequest,
  CreateFaqRequest,
  UpdateFaqRequest,
  CreatePageRequest,
  UpdatePageRequest,
} from './lib/models/content.models';

// Models — Inquiry
export type {
  CreateInquiryRequest,
  Inquiry,
  CreateWholesaleInquiryRequest,
  WholesaleInquiry,
  ContactSubject,
  CreateContactRequest,
  ContactInquiry,
} from './lib/models/inquiry.models';

// Models — Notification
export type { NotificationLog } from './lib/models/notification.models';

// Models — Chat
export type { ChatMessage, CreateConversationRequest, SendMessageRequest, Conversation, ConversationSummary, ChatStats } from './lib/models/chat.models';

// Models — Newsletter
export type {
  SubscribeRequest,
  SubscribeResponse,
  Subscriber,
  SubscriberStats,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  Campaign,
  CampaignDetail,
  CampaignRecipient,
} from './lib/models/newsletter.models';

// Models — Scheduling
export type {
  Employee,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  Meeting,
  MeetingAttendee,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  CalendarEvent,
  ScheduleConversation,
  ConversationSummary as ScheduleConversationSummary,
  ConversationMessage as ScheduleConversationMessage,
  ConversationParticipant,
  CreateConversationRequest as CreateScheduleConversationRequest,
  SendMessageRequest as ScheduleSendMessageRequest,
  Channel,
  ChannelMessage,
  SendChannelMessageRequest,
  UpdateChannelMessageRequest,
  CreateChannelRequest,
  MarkAsReadRequest,
  ActivityFeedItem,
  UpdatePresenceRequest,
  AddReactionRequest,
  ReactionSummary,
  FileAttachment,
  CallRoom,
  CallToken,
  JoinCallRequest,
} from './lib/models/scheduling.models';

// Models — Ambassador
export type {
  AmbassadorPerk,
  AmbassadorStep,
  AmbassadorProgram,
  CreateAmbassadorApplicationRequest,
  AmbassadorApplicationStatus,
  AmbassadorApplication,
} from './lib/models/ambassador.models';

// Services
export { AuthService } from './lib/services/auth.service';
export { CatalogService } from './lib/services/catalog.service';
export { OrderService } from './lib/services/order.service';
export { PaymentService } from './lib/services/payment.service';
export { ContentService } from './lib/services/content.service';
export { InquiryService } from './lib/services/inquiry.service';
export { NotificationService } from './lib/services/notification.service';
export { ChatService } from './lib/services/chat.service';
export { NewsletterService } from './lib/services/newsletter.service';
export { SchedulingService } from './lib/services/scheduling.service';
export { TeamHubService, type HubMessage, type HubPresenceUpdate, type HubTypingUpdate } from './lib/services/team-hub.service';
export { AmbassadorService } from './lib/services/ambassador.service';
export { CrmService } from './lib/services/crm.service';
