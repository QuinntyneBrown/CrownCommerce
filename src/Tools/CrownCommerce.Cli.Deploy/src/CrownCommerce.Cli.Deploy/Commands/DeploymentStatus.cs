namespace CrownCommerce.Cli.Deploy.Commands;

public record DeploymentStatus(string Component, string Type, string Status, string Version, string Environment);
