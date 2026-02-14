namespace CrownCommerce.Scheduling.Application.DTOs;

public sealed record EmployeeDto(
    Guid Id,
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string JobTitle,
    string? Department,
    string TimeZone,
    string Status,
    DateTime CreatedAt);

public sealed record CreateEmployeeDto(
    Guid UserId,
    string Email,
    string FirstName,
    string LastName,
    string? Phone,
    string JobTitle,
    string? Department,
    string TimeZone);

public sealed record UpdateEmployeeDto(
    string? Phone,
    string? JobTitle,
    string? Department,
    string? TimeZone,
    string? Status);
