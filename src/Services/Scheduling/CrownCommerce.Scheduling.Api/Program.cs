using CrownCommerce.Scheduling.Application.Consumers;
using CrownCommerce.Scheduling.Application.Services;
using CrownCommerce.Scheduling.Core.Interfaces;
using CrownCommerce.Scheduling.Infrastructure.Data;
using CrownCommerce.Scheduling.Infrastructure.Repositories;
using CrownCommerce.ServiceDefaults;
using MassTransit;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Database
builder.Services.AddDbContext<SchedulingDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("SchedulingDb")
        ?? "Data Source=scheduling.db"));

// Repositories
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IMeetingRepository, MeetingRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();

// Services
builder.Services.AddScoped<ISchedulingService, SchedulingService>();

// MassTransit
builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<MeetingBookedNotificationConsumer>();
    x.AddConsumer<MeetingCancelledNotificationConsumer>();

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

// Ensure DB created and seeded
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<SchedulingDbContext>();
    await SchedulingDbSeeder.SeedAsync(context);
}

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
