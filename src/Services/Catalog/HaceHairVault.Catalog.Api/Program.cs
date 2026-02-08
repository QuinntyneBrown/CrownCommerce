using HaceHairVault.Catalog.Application.Services;
using HaceHairVault.Catalog.Core.Interfaces;
using HaceHairVault.Catalog.Infrastructure.Data;
using HaceHairVault.Catalog.Infrastructure.Repositories;
using HaceHairVault.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<CatalogDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("CatalogDb")
        ?? "Data Source=catalog.db"));

builder.Services.AddScoped<ICatalogRepository, CatalogRepository>();
builder.Services.AddScoped<IHairOriginRepository, HairOriginRepository>();
builder.Services.AddScoped<ICatalogService, CatalogService>();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<CatalogDbContext>();
    await CatalogDbSeeder.SeedAsync(context);
}

app.MapDefaultEndpoints();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

app.Run();
