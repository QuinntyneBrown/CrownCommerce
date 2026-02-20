namespace CrownCommerce.Content.Core.Entities;

public sealed class AmbassadorBenefit
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string IconName { get; set; }
    public int SortOrder { get; set; }
}
