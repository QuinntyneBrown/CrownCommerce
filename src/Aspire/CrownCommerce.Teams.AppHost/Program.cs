var builder = DistributedApplication.CreateBuilder(args);

var messaging = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin();

var sql = builder.AddAzureSqlServer("sql")
    .RunAsContainer();

var identityDb = sql.AddDatabase("IdentityDb");
var schedulingDb = sql.AddDatabase("SchedulingDb");

var identityApi = builder.AddProject<Projects.CrownCommerce_Identity_Api>("identity-api")
    .WithReference(identityDb)
    .WaitFor(sql);

var schedulingApi = builder.AddProject<Projects.CrownCommerce_Scheduling_Api>("scheduling-api")
    .WithReference(messaging)
    .WaitFor(messaging)
    .WithReference(schedulingDb)
    .WaitFor(sql);

var apiGateway = builder.AddProject<Projects.CrownCommerce_ApiGateway>("api-gateway")
    .WithReference(identityApi)
    .WithReference(schedulingApi);

if (builder.ExecutionContext.IsPublishMode)
{
    builder.AddDockerfile("teams", "../../CrownCommerce.Web", "Dockerfile.teams")
        .WithReference(apiGateway)
        .WithEnvironment("API_GATEWAY_URL", apiGateway.GetEndpoint("http"))
        .WithHttpEndpoint(targetPort: 80)
        .WithExternalHttpEndpoints();
}
else
{
    builder.AddNpmApp("teams", "../../CrownCommerce.Web", "start:teams")
        .WithReference(apiGateway)
        .WithHttpEndpoint(env: "PORT")
        .WithExternalHttpEndpoints();
}

builder.Build().Run();
