using CrownCommerce.Catalog.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace CrownCommerce.Catalog.Infrastructure.Data;

public sealed class CatalogDbContext(DbContextOptions<CatalogDbContext> options) : DbContext(options)
{
    public DbSet<HairProduct> Products => Set<HairProduct>();
    public DbSet<HairOrigin> Origins => Set<HairOrigin>();
    public DbSet<ProductImage> ProductImages => Set<ProductImage>();
    public DbSet<ProductReview> ProductReviews => Set<ProductReview>();
    public DbSet<BundleDeal> BundleDeals => Set<BundleDeal>();
    public DbSet<BundleDealItem> BundleDealItems => Set<BundleDealItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<HairProduct>(e =>
        {
            e.HasKey(p => p.Id);
            e.Property(p => p.Name).HasMaxLength(200).IsRequired();
            e.Property(p => p.Description).HasMaxLength(1000);
            e.Property(p => p.ImageUrl).HasMaxLength(500);
            e.Property(p => p.Price).HasColumnType("decimal(10,2)");
            e.Property(p => p.Rating).HasColumnType("decimal(5,2)");
            e.Property(p => p.Texture).HasConversion<string>().HasMaxLength(50);
            e.Property(p => p.Type).HasConversion<string>().HasMaxLength(50);
            e.Property(p => p.AvailableLengthsJson).HasMaxLength(500);
            e.Property(p => p.FeaturesJson).HasMaxLength(2000);
            e.HasOne(p => p.Origin)
                .WithMany(o => o.Products)
                .HasForeignKey(p => p.OriginId);
            e.HasMany(p => p.Images)
                .WithOne(i => i.Product)
                .HasForeignKey(i => i.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
            e.HasMany(p => p.Reviews)
                .WithOne(r => r.Product)
                .HasForeignKey(r => r.ProductId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<HairOrigin>(e =>
        {
            e.HasKey(o => o.Id);
            e.Property(o => o.Country).HasMaxLength(100).IsRequired();
            e.Property(o => o.Region).HasMaxLength(200).IsRequired();
            e.Property(o => o.Description).HasMaxLength(1000);
        });

        modelBuilder.Entity<ProductImage>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.Url).HasMaxLength(500).IsRequired();
            e.Property(i => i.AltText).HasMaxLength(300).IsRequired();
        });

        modelBuilder.Entity<ProductReview>(e =>
        {
            e.HasKey(r => r.Id);
            e.Property(r => r.CustomerName).HasMaxLength(100).IsRequired();
            e.Property(r => r.Content).HasMaxLength(2000).IsRequired();
        });

        modelBuilder.Entity<BundleDeal>(e =>
        {
            e.HasKey(d => d.Id);
            e.Property(d => d.Name).HasMaxLength(200).IsRequired();
            e.Property(d => d.Description).HasMaxLength(1000);
            e.Property(d => d.OriginalPrice).HasColumnType("decimal(10,2)");
            e.Property(d => d.DealPrice).HasColumnType("decimal(10,2)");
            e.Property(d => d.SavingsAmount).HasColumnType("decimal(10,2)");
            e.Property(d => d.SavingsLabel).HasMaxLength(100);
            e.Property(d => d.ImageUrl).HasMaxLength(500);
            e.HasMany(d => d.Items)
                .WithOne(i => i.BundleDeal)
                .HasForeignKey(i => i.BundleDealId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<BundleDealItem>(e =>
        {
            e.HasKey(i => i.Id);
            e.Property(i => i.ProductName).HasMaxLength(200).IsRequired();
        });
    }
}
