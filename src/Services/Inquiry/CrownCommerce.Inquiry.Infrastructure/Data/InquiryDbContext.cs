using CrownCommerce.Inquiry.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Inquiry.Infrastructure.Data;

public sealed class InquiryDbContext(DbContextOptions<InquiryDbContext> options) : DbContext(options)
{
    public DbSet<Core.Entities.Inquiry> Inquiries => Set<Core.Entities.Inquiry>();
    public DbSet<WholesaleInquiry> WholesaleInquiries => Set<WholesaleInquiry>();
    public DbSet<ContactInquiry> ContactInquiries => Set<ContactInquiry>();
    public DbSet<AmbassadorApplication> AmbassadorApplications => Set<AmbassadorApplication>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Core.Entities.Inquiry>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.Name).HasMaxLength(200).IsRequired();
            e.Property(i => i.Email).HasMaxLength(300).IsRequired();
            e.Property(i => i.Phone).HasMaxLength(50);
            e.Property(i => i.Message).HasMaxLength(2000).IsRequired();
        });

        modelBuilder.Entity<WholesaleInquiry>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.CompanyName).HasMaxLength(200).IsRequired();
            e.Property(i => i.ContactName).HasMaxLength(200).IsRequired();
            e.Property(i => i.Email).HasMaxLength(300).IsRequired();
            e.Property(i => i.Phone).HasMaxLength(50);
            e.Property(i => i.BusinessType).HasMaxLength(100).IsRequired();
            e.Property(i => i.Message).HasMaxLength(2000).IsRequired();
            e.Property(i => i.Status).HasConversion<string>().HasMaxLength(50);
        });

        modelBuilder.Entity<ContactInquiry>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.FirstName).HasMaxLength(100).IsRequired();
            e.Property(i => i.LastName).HasMaxLength(100).IsRequired();
            e.Property(i => i.Email).HasMaxLength(300).IsRequired();
            e.Property(i => i.Phone).HasMaxLength(50);
            e.Property(i => i.Subject).HasConversion<string>().HasMaxLength(50);
            e.Property(i => i.Message).HasMaxLength(2000).IsRequired();
        });

        modelBuilder.Entity<AmbassadorApplication>(e =>
        {
            e.HasKey(a => a.Id);
            e.Property(a => a.FullName).HasMaxLength(200).IsRequired();
            e.Property(a => a.Email).HasMaxLength(300).IsRequired();
            e.Property(a => a.Phone).HasMaxLength(50);
            e.Property(a => a.InstagramHandle).HasMaxLength(100).IsRequired();
            e.Property(a => a.TikTokHandle).HasMaxLength(100);
            e.Property(a => a.YouTubeChannel).HasMaxLength(200);
            e.Property(a => a.WhyJoin).HasMaxLength(2000).IsRequired();
            e.Property(a => a.Status).HasConversion<string>().HasMaxLength(50);
        });
    }
}
