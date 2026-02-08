var builder = DistributedApplication.CreateBuilder(args);

var messaging = builder.AddRabbitMQ("messaging")
    .WithManagementPlugin();

var catalogApi = builder.AddProject<Projects.HaceHairVault_Catalog_Api>("catalog-api")
    .WithReference(messaging);

var inquiryApi = builder.AddProject<Projects.HaceHairVault_Inquiry_Api>("inquiry-api")
    .WithReference(messaging);

var apiGateway = builder.AddProject<Projects.HaceHairVault_ApiGateway>("api-gateway")
    .WithReference(catalogApi)
    .WithReference(inquiryApi);

builder.AddNpmApp("angular", "../../Web/hace-hair-vault-web", "start")
    .WithReference(apiGateway)
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
