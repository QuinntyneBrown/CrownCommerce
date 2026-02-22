# CrownCommerce.Cli.Deploy - Detailed Design

## Purpose

Azure deployment orchestrator for CrownCommerce backend services (Azure Container Apps) and frontend applications (Azure Static Web Apps). The CLI wraps `az` CLI commands behind a typed, testable interface so that deployments can be scripted, validated with dry-run, and verified through automated tests.

## Architecture

```
Program.cs (host + DI)
    |
    v
Commands layer          (DeployCommand.cs - System.CommandLine definitions)
    |
    v
Service layer           (IDeploymentService / DeploymentService)
    |
    v
Process runner          (IProcessRunner / ProcessRunner - shell execution)
    |
    v
Azure CLI               (az containerapp | az staticwebapp)
```

### Commands Layer

`DeployCommand.cs` defines four sub-commands on the root command:

| Command    | Arguments / Options                   | Description                             |
|------------|---------------------------------------|-----------------------------------------|
| `service`  | `<name>` `--env`                      | Deploy a single backend Container App   |
| `frontend` | `<name>` `--env`                      | Deploy a single Static Web App          |
| `status`   | `--env`                               | Query and display deployment status     |
| `all`      | `--env` `--dry-run`                   | Deploy every service and frontend       |

### Service Layer

`IDeploymentService` exposes four async methods that map 1:1 to the commands above. `DeploymentService` implements the business logic: input validation, orchestrating `az` commands via `IProcessRunner`, logging, and dry-run support.

### Process Runner Abstraction

`IProcessRunner` is the sole boundary between the deployment logic and the operating system. It runs an external process and returns a `ProcessResult` containing the exit code, stdout, and stderr. In production, `ProcessRunner` delegates to `System.Diagnostics.Process`. In tests, the interface is substituted with NSubstitute.

## Data Models

### ProcessResult

```csharp
public record ProcessResult(int ExitCode, string Output, string Error);
```

Returned by `IProcessRunner.RunAsync`. An `ExitCode` of 0 indicates success.

### DeploymentStatus

```csharp
public record DeploymentStatus(
    string Component,   // e.g. "catalog", "origin-hair-collective"
    string Type,        // "service" or "frontend"
    string Status,      // "running", "deployed", "error", etc.
    string Version,     // container tag or build id
    string Environment  // "staging", "production"
);
```

Returned by `GetStatusAsync` to represent each deployed component.

### Deployment Targets

Backend services (Azure Container Apps):

- catalog, chat, content, crm, identity, inquiry, newsletter, notification, order, payment, scheduling

Frontend applications (Azure Static Web Apps):

- origin-hair-collective, mane-haus, crown-commerce-admin

## Error Handling and Rollback Strategy

1. **Validation errors** - Unknown service or frontend names are rejected immediately with a logged error and a `false` return value. No `az` commands are executed.
2. **Process failures** - If `IProcessRunner.RunAsync` returns a non-zero exit code, the method logs the stderr output and returns `false`.
3. **DeployAllAsync failures** - Each component is deployed sequentially. If any single deployment fails, the failure is logged and the aggregate result is `false`, but remaining components still attempt deployment (fail-forward). This avoids leaving the system in a partially-updated state where only some services were skipped.
4. **Dry-run mode** - When `--dry-run` is passed, `DeployAllAsync` logs what it would do but does not invoke `IProcessRunner`. This allows operators to preview changes before committing.
5. **Rollback** - The CLI does not implement automatic rollback. Rollback is handled at the infrastructure level (Azure Container Apps revision management, Static Web App deployment slots). The operator can redeploy a previous version using the same CLI.

## Testing Strategy

All tests mock `IProcessRunner` via NSubstitute so that no real processes or Azure resources are needed.

### DeployCommandTests

Verify that System.CommandLine correctly parses arguments and routes to `IDeploymentService`:

- Each command (`service`, `frontend`, `status`, `all`) returns exit code 0 on success
- Arguments and options are forwarded correctly to the service methods
- The `--dry-run` flag is properly parsed and passed through

### DeploymentServiceTests

Verify the business logic in `DeploymentService`:

- Valid service/frontend names trigger `az` CLI calls via `IProcessRunner`
- Invalid names return `false` without invoking the process runner
- Dry-run mode skips process execution entirely
- Non-zero exit codes from the process runner cause the method to return `false`
- `GetStatusAsync` invokes the process runner to query Azure resource status
- `DeployAllAsync` invokes the process runner for every service and frontend
