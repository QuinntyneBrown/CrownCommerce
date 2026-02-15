using System.CommandLine;
using CrownCommerce.Cli.Env.Commands;
using CrownCommerce.Cli.Env.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<IEnvironmentService, EnvironmentService>();

using var host = builder.Build();

var rootCommand = EnvCommand.Create(host.Services);

return await rootCommand.InvokeAsync(args);
