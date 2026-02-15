using CrownCommerce.Scheduling.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Scheduling.Infrastructure.Data;

public sealed class SchedulingDbContext(DbContextOptions<SchedulingDbContext> options) : DbContext(options)
{
    public DbSet<Employee> Employees => Set<Employee>();
    public DbSet<Meeting> Meetings => Set<Meeting>();
    public DbSet<MeetingAttendee> MeetingAttendees => Set<MeetingAttendee>();
    public DbSet<ScheduleConversation> Conversations => Set<ScheduleConversation>();
    public DbSet<ConversationMessage> ConversationMessages => Set<ConversationMessage>();
    public DbSet<ConversationParticipant> ConversationParticipants => Set<ConversationParticipant>();
    public DbSet<ChannelReadReceipt> ChannelReadReceipts => Set<ChannelReadReceipt>();
    public DbSet<MessageReaction> MessageReactions => Set<MessageReaction>();
    public DbSet<FileAttachment> FileAttachments => Set<FileAttachment>();
    public DbSet<MentionNotification> MentionNotifications => Set<MentionNotification>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Employee>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Email).HasMaxLength(300).IsRequired();
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.FirstName).HasMaxLength(200).IsRequired();
            e.Property(x => x.LastName).HasMaxLength(200).IsRequired();
            e.Property(x => x.Phone).HasMaxLength(50);
            e.Property(x => x.JobTitle).HasMaxLength(200).IsRequired();
            e.Property(x => x.Department).HasMaxLength(200);
            e.Property(x => x.TimeZone).HasMaxLength(100).IsRequired();
            e.Property(x => x.Presence).HasConversion<string>().HasMaxLength(20);
            e.HasIndex(x => x.UserId).IsUnique();
        });

        modelBuilder.Entity<Meeting>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Title).HasMaxLength(500).IsRequired();
            e.Property(x => x.Description).HasMaxLength(2000);
            e.Property(x => x.Location).HasMaxLength(500);
            e.HasIndex(x => x.StartTimeUtc);
            e.HasIndex(x => x.OrganizerId);
        });

        modelBuilder.Entity<MeetingAttendee>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.MeetingId, x.EmployeeId }).IsUnique();
            e.HasOne(x => x.Meeting).WithMany(m => m.Attendees).HasForeignKey(x => x.MeetingId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Employee).WithMany(emp => emp.MeetingAttendees).HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ScheduleConversation>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Subject).HasMaxLength(500).IsRequired();
            e.Property(x => x.ChannelType).HasConversion<string>().HasMaxLength(20);
            e.Property(x => x.Icon).HasMaxLength(100);
            e.HasIndex(x => x.MeetingId);
            e.HasIndex(x => x.CreatedByEmployeeId);
        });

        modelBuilder.Entity<ConversationMessage>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Content).HasMaxLength(4000).IsRequired();
            e.HasOne(x => x.Conversation).WithMany(c => c.Messages).HasForeignKey(x => x.ConversationId).OnDelete(DeleteBehavior.Cascade);
            e.HasIndex(x => x.ConversationId);
        });

        modelBuilder.Entity<ConversationParticipant>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.ConversationId, x.EmployeeId }).IsUnique();
            e.HasOne(x => x.Conversation).WithMany(c => c.Participants).HasForeignKey(x => x.ConversationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Employee).WithMany().HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<ChannelReadReceipt>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => new { x.ConversationId, x.EmployeeId }).IsUnique();
            e.HasOne(x => x.Conversation).WithMany(c => c.ReadReceipts).HasForeignKey(x => x.ConversationId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Employee).WithMany().HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<MessageReaction>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.Emoji).HasMaxLength(10).IsRequired();
            e.HasIndex(x => new { x.MessageId, x.EmployeeId, x.Emoji }).IsUnique();
            e.HasOne(x => x.Message).WithMany(m => m.Reactions).HasForeignKey(x => x.MessageId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Employee).WithMany().HasForeignKey(x => x.EmployeeId).OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<FileAttachment>(e =>
        {
            e.HasKey(x => x.Id);
            e.Property(x => x.FileName).HasMaxLength(500).IsRequired();
            e.Property(x => x.StoragePath).HasMaxLength(1000).IsRequired();
            e.Property(x => x.ContentType).HasMaxLength(200).IsRequired();
            e.HasIndex(x => x.MessageId);
            e.HasIndex(x => x.UploadedByEmployeeId);
            e.HasOne(x => x.UploadedBy).WithMany().HasForeignKey(x => x.UploadedByEmployeeId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.Message).WithMany(m => m.Attachments).HasForeignKey(x => x.MessageId).OnDelete(DeleteBehavior.SetNull);
        });

        modelBuilder.Entity<MentionNotification>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.MentionedEmployeeId);
            e.HasIndex(x => x.MessageId);
            e.HasOne(x => x.Message).WithMany().HasForeignKey(x => x.MessageId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.MentionedEmployee).WithMany().HasForeignKey(x => x.MentionedEmployeeId).OnDelete(DeleteBehavior.Cascade);
            e.HasOne(x => x.SenderEmployee).WithMany().HasForeignKey(x => x.SenderEmployeeId).OnDelete(DeleteBehavior.NoAction);
        });
    }
}
