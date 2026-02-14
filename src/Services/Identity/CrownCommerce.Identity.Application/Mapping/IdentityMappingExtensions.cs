using CrownCommerce.Identity.Application.Dtos;
using CrownCommerce.Identity.Core.Entities;

namespace CrownCommerce.Identity.Application.Mapping;

public static class IdentityMappingExtensions
{
    public static UserProfileDto ToDto(this AppUser user) =>
        new(
            user.Id,
            user.Email,
            user.FirstName,
            user.LastName,
            user.Phone,
            user.Role.ToString(),
            user.CreatedAt);
}
