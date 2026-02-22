namespace CrownCommerce.Cli.Db.Commands;

public record DatabaseInfo(string ServiceName, string DatabaseName, string Provider, string ConnectionString);
