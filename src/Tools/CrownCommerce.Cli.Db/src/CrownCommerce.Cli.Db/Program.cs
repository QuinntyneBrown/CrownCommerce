using System.CommandLine;
using CrownCommerce.Cli.Db.Commands;
using CrownCommerce.Cli.Db.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddSingleton<IConnectionStringProvider, ConnectionStringProvider>();
builder.Services.AddSingleton<IDatabaseService, DatabaseService>();

using var host = builder.Build();

var rootCommand = DbCommand.Create(host.Services);

return await rootCommand.InvokeAsync(args);
