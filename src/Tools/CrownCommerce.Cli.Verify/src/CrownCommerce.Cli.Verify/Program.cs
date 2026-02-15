using System.CommandLine;
using CrownCommerce.Cli.Verify.Commands;
using CrownCommerce.Cli.Verify.Services;
using CrownCommerce.Newsletter.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddDbContext<NewsletterDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("NewsletterDb")));

builder.Services.AddScoped<ISubscriberQueryService, SubscriberQueryService>();

using var host = builder.Build();

var rootCommand = VerifyCommand.Create(host.Services);

return await rootCommand.InvokeAsync(args);
