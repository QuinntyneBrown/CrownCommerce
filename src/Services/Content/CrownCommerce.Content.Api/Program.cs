using CrownCommerce.Content.Application.Services;
using CrownCommerce.Content.Core.Interfaces;
using CrownCommerce.Content.Infrastructure.Data;
using CrownCommerce.Content.Infrastructure.Repositories;
using CrownCommerce.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<ContentDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("ContentDb")
        ?? "Data Source=content.db"));

builder.Services.AddScoped<IContentPageRepository, ContentPageRepository>();
builder.Services.AddScoped<IFaqRepository, FaqRepository>();
builder.Services.AddScoped<ITestimonialRepository, TestimonialRepository>();
builder.Services.AddScoped<IGalleryRepository, GalleryRepository>();
builder.Services.AddScoped<IContentService, ContentService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ContentDbContext>();
    await ContentDbSeeder.SeedAsync(context);
}

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
