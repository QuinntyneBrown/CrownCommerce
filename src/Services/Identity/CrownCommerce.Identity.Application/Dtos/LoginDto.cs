namespace CrownCommerce.Identity.Application.Dtos;

public sealed record LoginDto(
    string Email,
    string Password);
