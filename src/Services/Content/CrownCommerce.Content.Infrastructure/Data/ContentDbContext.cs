using CrownCommerce.Content.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Content.Infrastructure.Data;

public sealed class ContentDbContext(DbContextOptions<ContentDbContext> options) : DbContext(options)
{
    public DbSet<ContentPage> Pages => Set<ContentPage>();
    public DbSet<FaqItem> Faqs => Set<FaqItem>();
    public DbSet<Testimonial> Testimonials => Set<Testimonial>();
    public DbSet<GalleryImage> GalleryImages => Set<GalleryImage>();
    public DbSet<WholesaleTier> WholesaleTiers => Set<WholesaleTier>();
    public DbSet<ShippingZone> ShippingZones => Set<ShippingZone>();
    public DbSet<HairCareSection> HairCareSections => Set<HairCareSection>();
    public DbSet<AmbassadorBenefit> AmbassadorBenefits => Set<AmbassadorBenefit>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ContentPage>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Slug).HasMaxLength(200).IsRequired();
            e.Property(p => p.Title).HasMaxLength(300).IsRequired();
            e.Property(p => p.Body).IsRequired();
            e.HasIndex(p => p.Slug).IsUnique();
        });

        modelBuilder.Entity<FaqItem>(e =>
        {
            e.HasKey(f => f.Id);
            e.Property(f => f.Question).HasMaxLength(500).IsRequired();
            e.Property(f => f.Answer).HasMaxLength(2000).IsRequired();
            e.Property(f => f.Category).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Testimonial>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.CustomerName).HasMaxLength(200).IsRequired();
            e.Property(t => t.CustomerLocation).HasMaxLength(200);
            e.Property(t => t.Content).HasMaxLength(2000).IsRequired();
            e.Property(t => t.ImageUrl).HasMaxLength(500);
        });

        modelBuilder.Entity<GalleryImage>(e =>
        {
            e.HasKey(g => g.Id);
            e.Property(g => g.Title).HasMaxLength(200).IsRequired();
            e.Property(g => g.Description).HasMaxLength(500);
            e.Property(g => g.ImageUrl).HasMaxLength(500).IsRequired();
            e.Property(g => g.Category).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<WholesaleTier>(e =>
        {
            e.HasKey(t => t.Id);
            e.Property(t => t.Name).HasMaxLength(100).IsRequired();
            e.Property(t => t.Description).HasMaxLength(500).IsRequired();
            e.Property(t => t.DiscountPercentage).HasColumnType("decimal(5,2)");
        });

        modelBuilder.Entity<ShippingZone>(e =>
        {
            e.HasKey(z => z.Id);
            e.Property(z => z.Name).HasMaxLength(100).IsRequired();
            e.Property(z => z.Region).HasMaxLength(200).IsRequired();
            e.Property(z => z.StandardDeliveryDays).HasMaxLength(50).IsRequired();
            e.Property(z => z.ExpressDeliveryDays).HasMaxLength(50).IsRequired();
            e.Property(z => z.StandardRate).HasColumnType("decimal(10,2)");
            e.Property(z => z.ExpressRate).HasColumnType("decimal(10,2)");
            e.Property(z => z.FreeShippingThreshold).HasColumnType("decimal(10,2)");
        });

        modelBuilder.Entity<HairCareSection>(e =>
        {
            e.HasKey(s => s.Id);
            e.Property(s => s.Title).HasMaxLength(200).IsRequired();
            e.Property(s => s.Description).HasMaxLength(1000).IsRequired();
            e.Property(s => s.IconName).HasMaxLength(100).IsRequired();
            e.Property(s => s.TipsJson).HasMaxLength(2000);
        });

        modelBuilder.Entity<AmbassadorBenefit>(e =>
        {
            e.HasKey(b => b.Id);
            e.Property(b => b.Title).HasMaxLength(200).IsRequired();
            e.Property(b => b.Description).HasMaxLength(500).IsRequired();
            e.Property(b => b.IconName).HasMaxLength(100).IsRequired();
        });
    }
}
