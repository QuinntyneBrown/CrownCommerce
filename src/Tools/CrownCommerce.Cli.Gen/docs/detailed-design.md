# CrownCommerce.Cli.Gen -- Detailed Design

## Purpose

CrownCommerce.Cli.Gen is a .NET 9 CLI tool that scaffolds code for CrownCommerce microservices and Angular applications. It generates boilerplate files for entities, MassTransit consumers, full microservice projects, and Angular page components, following established project conventions.

## Architecture

```
Commands (System.CommandLine)
    |
    v
IGeneratorService  -->  GeneratorService
                            |
                            v
                        IFileSystem  -->  FileSystemService (System.IO)
```

- **Commands layer** (`GenCommand.cs`): Defines CLI commands, arguments, and routes them to the generator service. This layer is kept as-is and should not contain business logic.
- **Service layer** (`GeneratorService.cs`): Orchestrates file generation. Uses `IFileSystem` to create directories and write files. Contains all template logic.
- **File system abstraction** (`IFileSystem` / `FileSystemService`): Abstracts file I/O operations so the generator service can be tested without touching the real file system.

## Commands

### `entity <service> <entity-name>`

Generates a C# entity class, API controller, and DbContext update file for a given microservice.

**Files created:**
- `src/Services/{Service}/CrownCommerce.{Service}.Core/Entities/{EntityName}.cs`
- `src/Services/{Service}/CrownCommerce.{Service}.Api/Controllers/{EntityName}Controller.cs`
- `src/Services/{Service}/CrownCommerce.{Service}.Infrastructure/Data/{Service}DbContext.{EntityName}.cs`

### `consumer <service> <event-name>`

Generates a MassTransit `IConsumer<T>` implementation for a given event in a microservice.

**Files created:**
- `src/Services/{Service}/CrownCommerce.{Service}.Application/Consumers/{EventName}Consumer.cs`

### `service <service-name>`

Scaffolds a full microservice with the four-layer architecture (Core, Infrastructure, Application, Api).

**Directories and files created:**
- `src/Services/{Service}/CrownCommerce.{Service}.Core/Entities/` (directory)
- `src/Services/{Service}/CrownCommerce.{Service}.Infrastructure/Data/{Service}DbContext.cs`
- `src/Services/{Service}/CrownCommerce.{Service}.Application/Consumers/` (directory)
- `src/Services/{Service}/CrownCommerce.{Service}.Api/Program.cs`

### `page <app> <page-name>`

Generates an Angular standalone component for a given application.

**Files created:**
- `src/CrownCommerce.Web/projects/{app}/src/app/pages/{kebab-page}/{kebab-page}.component.ts`
- `src/CrownCommerce.Web/projects/{app}/src/app/pages/{kebab-page}/{kebab-page}.component.html`
- `src/CrownCommerce.Web/projects/{app}/src/app/pages/{kebab-page}/{kebab-page}.component.scss`

## IFileSystem Abstraction

```csharp
public interface IFileSystem
{
    Task WriteFileAsync(string path, string content);
    Task CreateDirectoryAsync(string path);
    bool FileExists(string path);
    bool DirectoryExists(string path);
}
```

`FileSystemService` implements this interface using `System.IO.File` and `System.IO.Directory`. The abstraction exists solely to enable unit testing without real file I/O.

## Templates

### Entity Template

A simple C# class with `Id`, `Name`, and `CreatedAt` properties in the `CrownCommerce.{Service}.Core.Entities` namespace.

### Controller Template

An ASP.NET Core `ControllerBase` with `[ApiController]` and `[Route("api/[controller]")]` attributes, containing a placeholder GET endpoint.

### Consumer Template

A MassTransit `IConsumer<{EventName}>` implementation with a `Consume` method that logs the received event.

### Service Scaffold Template

- **Program.cs**: Minimal API host with Swagger, MassTransit, and EF Core configuration stubs.
- **DbContext**: An EF Core `DbContext` in the Infrastructure layer.

### Angular Page Template

- **.ts**: Standalone Angular component using signals, with `feat-` selector prefix.
- **.html**: Basic HTML template with a heading.
- **.scss**: Empty SCSS file with a `:host` block.

## Project Path Conventions

All paths are relative to the repository root:

| Layer          | Path Pattern                                                              |
|----------------|---------------------------------------------------------------------------|
| Core entities  | `src/Services/{Service}/CrownCommerce.{Service}.Core/Entities/`           |
| Infrastructure | `src/Services/{Service}/CrownCommerce.{Service}.Infrastructure/Data/`     |
| Application    | `src/Services/{Service}/CrownCommerce.{Service}.Application/Consumers/`   |
| API            | `src/Services/{Service}/CrownCommerce.{Service}.Api/`                     |
| Angular pages  | `src/CrownCommerce.Web/projects/{app}/src/app/pages/{kebab-name}/`        |

Service names are PascalCased when used in namespace and directory names. Angular page names are converted from PascalCase to kebab-case for file and directory names.

## Testing Strategy

Tests use **NSubstitute** to mock `IFileSystem` and verify that the `GeneratorService` creates the correct files with the correct content at the correct paths. No real files are written during testing.

### Test Categories

1. **Command tests** (`GenCommandTests`): Verify that CLI commands parse arguments correctly and invoke the corresponding `IGeneratorService` method with the right parameters. Uses a mocked `IGeneratorService`.

2. **Generator service tests** (`GeneratorServiceTests`): Verify that `GeneratorService` calls `IFileSystem.CreateDirectoryAsync` and `IFileSystem.WriteFileAsync` with the expected paths and content. Uses a mocked `IFileSystem` and a `NullLogger`.

### Verification Patterns

- Path correctness: `_fileSystem.Received().WriteFileAsync(Arg.Is<string>(p => p.Contains("expected/path")), Arg.Any<string>())`
- Content correctness: `_fileSystem.Received().WriteFileAsync(Arg.Any<string>(), Arg.Is<string>(c => c.Contains("expected content")))`
- Directory creation: `_fileSystem.Received().CreateDirectoryAsync(Arg.Is<string>(p => p.Contains("expected/dir")))`
