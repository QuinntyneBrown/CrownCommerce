namespace CrownCommerce.Content.Application.Dtos;

public sealed record HairCareSectionDto(
    Guid Id,
    string Title,
    string Description,
    string IconName,
    IReadOnlyList<string> Tips);
