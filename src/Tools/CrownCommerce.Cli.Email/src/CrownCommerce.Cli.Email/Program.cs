using System.CommandLine;
using CrownCommerce.Cli.Email.Commands;
using CrownCommerce.Cli.Email.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = Host.CreateApplicationBuilder(args);
builder.Services.AddSingleton<ISmtpClient, SmtpClientWrapper>();
builder.Services.AddSingleton<ITemplateStore, TemplateStore>();
builder.Services.AddSingleton<IEmailService, EmailService>();
using var host = builder.Build();

var rootCommand = EmailCommand.Create(host.Services);
return await rootCommand.InvokeAsync(args);
