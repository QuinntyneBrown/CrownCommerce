using Microsoft.Extensions.Logging;

namespace CrownCommerce.Cli.Gen.Services;

public class GeneratorService : IGeneratorService
{
    private readonly ILogger<GeneratorService> _logger;
    private readonly IFileSystem _fileSystem;

    public GeneratorService(ILogger<GeneratorService> logger, IFileSystem fileSystem)
    {
        _logger = logger;
        _fileSystem = fileSystem;
    }

    public async Task GenerateEntityAsync(string service, string entityName)
    {
        var pascalService = ToPascalCase(service);

        _logger.LogInformation("Generating entity '{Entity}' for service '{Service}'...", entityName, service);

        var basePath = $"src/Services/{pascalService}";

        // Create directory structure
        var entityDir = $"{basePath}/CrownCommerce.{pascalService}.Core/Entities";
        var controllerDir = $"{basePath}/CrownCommerce.{pascalService}.Api/Controllers";
        var dataDir = $"{basePath}/CrownCommerce.{pascalService}.Infrastructure/Data";

        await _fileSystem.CreateDirectoryAsync(entityDir);
        await _fileSystem.CreateDirectoryAsync(controllerDir);
        await _fileSystem.CreateDirectoryAsync(dataDir);

        // Entity class
        var entityContent = $$"""
            namespace CrownCommerce.{{pascalService}}.Core.Entities;

            public class {{entityName}}
            {
                public Guid Id { get; set; }
                public string Name { get; set; } = string.Empty;
                public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
            }
            """;
        await _fileSystem.WriteFileAsync($"{entityDir}/{entityName}.cs", entityContent);

        // Controller class
        var controllerContent = $$"""
            using Microsoft.AspNetCore.Mvc;

            namespace CrownCommerce.{{pascalService}}.Api.Controllers;

            [ApiController]
            [Route("api/[controller]")]
            public class {{entityName}}Controller : ControllerBase
            {
                [HttpGet]
                public IActionResult GetAll()
                {
                    return Ok(Array.Empty<object>());
                }

                [HttpGet("{id:guid}")]
                public IActionResult GetById(Guid id)
                {
                    return NotFound();
                }
            }
            """;
        await _fileSystem.WriteFileAsync($"{controllerDir}/{entityName}Controller.cs", controllerContent);

        // DbContext partial for entity
        var dbContextContent = $$"""
            using CrownCommerce.{{pascalService}}.Core.Entities;
            using Microsoft.EntityFrameworkCore;

            namespace CrownCommerce.{{pascalService}}.Infrastructure.Data;

            public partial class {{pascalService}}DbContext
            {
                public DbSet<{{entityName}}> {{entityName}}s { get; set; } = null!;
            }
            """;
        await _fileSystem.WriteFileAsync($"{dataDir}/{pascalService}DbContext.{entityName}.cs", dbContextContent);

        _logger.LogInformation("Entity scaffolding complete.");
    }

    public async Task GenerateConsumerAsync(string service, string eventName)
    {
        var pascalService = ToPascalCase(service);

        _logger.LogInformation("Generating consumer for event '{Event}' in service '{Service}'...", eventName, service);

        var consumerDir = $"src/Services/{pascalService}/CrownCommerce.{pascalService}.Application/Consumers";
        await _fileSystem.CreateDirectoryAsync(consumerDir);

        var consumerContent = $$"""
            using MassTransit;
            using Microsoft.Extensions.Logging;

            namespace CrownCommerce.{{pascalService}}.Application.Consumers;

            public record {{eventName}}(Guid Id, DateTime Timestamp);

            public class {{eventName}}Consumer : IConsumer<{{eventName}}>
            {
                private readonly ILogger<{{eventName}}Consumer> _logger;

                public {{eventName}}Consumer(ILogger<{{eventName}}Consumer> logger)
                {
                    _logger = logger;
                }

                public Task Consume(ConsumeContext<{{eventName}}> context)
                {
                    _logger.LogInformation("Received {Event} with Id {Id}", nameof({{eventName}}), context.Message.Id);
                    return Task.CompletedTask;
                }
            }
            """;
        await _fileSystem.WriteFileAsync($"{consumerDir}/{eventName}Consumer.cs", consumerContent);

        _logger.LogInformation("Consumer scaffolding complete.");
    }

    public async Task GenerateServiceAsync(string serviceName)
    {
        var pascalService = ToPascalCase(serviceName);

        _logger.LogInformation("Generating full service scaffold for '{Service}'...", serviceName);

        var basePath = $"src/Services/{pascalService}";

        // Create all four project directories
        var coreEntitiesDir = $"{basePath}/CrownCommerce.{pascalService}.Core/Entities";
        var infraDataDir = $"{basePath}/CrownCommerce.{pascalService}.Infrastructure/Data";
        var appConsumersDir = $"{basePath}/CrownCommerce.{pascalService}.Application/Consumers";
        var apiDir = $"{basePath}/CrownCommerce.{pascalService}.Api";

        await _fileSystem.CreateDirectoryAsync(coreEntitiesDir);
        await _fileSystem.CreateDirectoryAsync(infraDataDir);
        await _fileSystem.CreateDirectoryAsync(appConsumersDir);
        await _fileSystem.CreateDirectoryAsync(apiDir);

        // Program.cs
        var programContent = $$"""
            using CrownCommerce.{{pascalService}}.Infrastructure.Data;
            using Microsoft.EntityFrameworkCore;

            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddDbContext<{{pascalService}}DbContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();
            app.MapControllers();

            app.Run();
            """;
        await _fileSystem.WriteFileAsync($"{apiDir}/Program.cs", programContent);

        // DbContext
        var dbContextContent = $$"""
            using Microsoft.EntityFrameworkCore;

            namespace CrownCommerce.{{pascalService}}.Infrastructure.Data;

            public partial class {{pascalService}}DbContext : DbContext
            {
                public {{pascalService}}DbContext(DbContextOptions<{{pascalService}}DbContext> options)
                    : base(options)
                {
                }

                protected override void OnModelCreating(ModelBuilder modelBuilder)
                {
                    base.OnModelCreating(modelBuilder);
                }
            }
            """;
        await _fileSystem.WriteFileAsync($"{infraDataDir}/{pascalService}DbContext.cs", dbContextContent);

        _logger.LogInformation("Service scaffolding complete.");
    }

    public async Task GeneratePageAsync(string app, string pageName)
    {
        var kebabPage = ToKebabCase(pageName);

        _logger.LogInformation("Generating Angular page '{Page}' for app '{App}'...", pageName, app);

        var pageDir = $"src/CrownCommerce.Web/projects/{app}/src/app/pages/{kebabPage}";
        await _fileSystem.CreateDirectoryAsync(pageDir);

        // TypeScript component
        var tsContent = $$"""
            import { Component } from '@angular/core';
            import { CommonModule } from '@angular/common';

            @Component({
              selector: 'feat-{{kebabPage}}',
              standalone: true,
              imports: [CommonModule],
              templateUrl: './{{kebabPage}}.component.html',
              styleUrl: './{{kebabPage}}.component.scss',
            })
            export class {{pageName}}Component {
            }
            """;
        await _fileSystem.WriteFileAsync($"{pageDir}/{kebabPage}.component.ts", tsContent);

        // HTML template
        var htmlContent = $$"""
            <div class="{{kebabPage}}-page">
              <h1>{{pageName}}</h1>
            </div>
            """;
        await _fileSystem.WriteFileAsync($"{pageDir}/{kebabPage}.component.html", htmlContent);

        // SCSS styles
        var scssContent = """
            :host {
              display: block;
            }
            """;
        await _fileSystem.WriteFileAsync($"{pageDir}/{kebabPage}.component.scss", scssContent);

        _logger.LogInformation("Page scaffolding complete.");
    }

    private static string ToPascalCase(string input)
    {
        return char.ToUpper(input[0]) + input[1..];
    }

    internal static string ToKebabCase(string input)
    {
        return string.Concat(input.Select((c, i) =>
            i > 0 && char.IsUpper(c) ? $"-{char.ToLower(c)}" : $"{char.ToLower(c)}"));
    }
}
