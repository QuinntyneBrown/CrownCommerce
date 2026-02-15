using System.CommandLine;
using CrownCommerce.Cli.Seed.Commands;
using CrownCommerce.Cli.Seed.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<ISeedService, SeedService>();

using var host = builder.Build();

var rootCommand = SeedCommand.Create(host.Services);

return await rootCommand.InvokeAsync(args);
