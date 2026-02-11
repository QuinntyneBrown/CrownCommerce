using OriginHairCollective.Chat.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace OriginHairCollective.Chat.Infrastructure.Data;

public sealed class ChatDbContext(DbContextOptions<ChatDbContext> options) : DbContext(options)
{
    public DbSet<Conversation> Conversations => Set<Conversation>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Conversation>(e =>
        {
            e.HasKey(c => c.Id);
            e.Property(c => c.SessionId).HasMaxLength(100).IsRequired();
            e.Property(c => c.VisitorName).HasMaxLength(100);
            e.Property(c => c.VisitorEmail).HasMaxLength(300);
            e.Property(c => c.Status).HasConversion<string>().HasMaxLength(50);
            e.HasMany(c => c.Messages)
                .WithOne(m => m.Conversation)
                .HasForeignKey(m => m.ConversationId);
            e.HasIndex(c => c.SessionId);
            e.HasIndex(c => c.Status);
            e.HasIndex(c => c.CreatedAt);
        });

        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Content).IsRequired();
            e.Property(m => m.SenderType).HasConversion<string>().HasMaxLength(50);
            e.HasIndex(m => m.ConversationId);
        });
    }
}
