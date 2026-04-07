import { pgSchema, uuid, varchar, text, timestamp, date, time } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const schedulingSchema = pgSchema("scheduling");

export const employees = schedulingSchema.table("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 100 }),
  department: varchar("department", { length: 100 }),
  timezone: varchar("timezone", { length: 100 }).default("UTC"),
  presence: varchar("presence", { length: 50 }).default("offline"),
  avatarUrl: varchar("avatar_url", { length: 500 }),
});

export const channels = schedulingSchema.table("channels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull().default("public"),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const channelMessages = schedulingSchema.table("channel_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  channelId: uuid("channel_id").references(() => channels.id).notNull(),
  senderId: uuid("sender_id").references(() => employees.id).notNull(),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON array
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const meetings = schedulingSchema.table("meetings", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: date("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  location: varchar("location", { length: 255 }),
  organizerId: uuid("organizer_id").references(() => employees.id),
});

export const meetingAttendees = schedulingSchema.table("meeting_attendees", {
  id: uuid("id").primaryKey().defaultRandom(),
  meetingId: uuid("meeting_id").references(() => meetings.id).notNull(),
  employeeId: uuid("employee_id").references(() => employees.id).notNull(),
  rsvpStatus: varchar("rsvp_status", { length: 50 }).default("pending"),
});

export const files = schedulingSchema.table("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  filename: varchar("filename", { length: 255 }).notNull(),
  url: varchar("url", { length: 500 }).notNull(),
  contentType: varchar("content_type", { length: 100 }),
  uploadedBy: uuid("uploaded_by").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const channelsRelations = relations(channels, ({ many }) => ({
  messages: many(channelMessages),
}));

export const channelMessagesRelations = relations(channelMessages, ({ one }) => ({
  channel: one(channels, { fields: [channelMessages.channelId], references: [channels.id] }),
  sender: one(employees, { fields: [channelMessages.senderId], references: [employees.id] }),
}));

export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  organizer: one(employees, { fields: [meetings.organizerId], references: [employees.id] }),
  attendees: many(meetingAttendees),
}));

export const meetingAttendeesRelations = relations(meetingAttendees, ({ one }) => ({
  meeting: one(meetings, { fields: [meetingAttendees.meetingId], references: [meetings.id] }),
  employee: one(employees, { fields: [meetingAttendees.employeeId], references: [employees.id] }),
}));
