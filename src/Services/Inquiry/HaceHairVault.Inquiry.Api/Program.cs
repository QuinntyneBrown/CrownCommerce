using HaceHairVault.Inquiry.Application.Consumers;
using HaceHairVault.Inquiry.Application.Services;
using HaceHairVault.Inquiry.Core.Interfaces;
using HaceHairVault.Inquiry.Infrastructure.Data;
using HaceHairVault.Inquiry.Infrastructure.Repositories;
using HaceHairVault.ServiceDefaults;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<InquiryDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("InquiryDb")
        ?? "Data Source=inquiry.db"));

builder.Services.AddScoped<IInquiryRepository, InquiryRepository>();
builder.Services.AddScoped<IInquiryService, InquiryService>();

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<ProductInterestConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        var connectionString = builder.Configuration.GetConnectionString("messaging");
        if (!string.IsNullOrEmpty(connectionString))
        {
            cfg.Host(connectionString);
        }

        cfg.ConfigureEndpoints(context);
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<InquiryDbContext>();
    await context.Database.EnsureCreatedAsync();
}

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
