namespace CrownCommerce.Identity.Application.Dtos;

public sealed record UpdateProfileDto(
    string FirstName,
    string LastName,
    string? Phone);
