using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace CrownCommerce.Identity.Application.Services;

public sealed class JwtTokenService(IConfiguration configuration) : ITokenService
{
    public string GenerateToken(Guid userId, string email, string role)
    {
        var key = configuration["Jwt:Key"] ?? "CrownCommerce-Dev-Secret-Key-Min-32-Chars!";
        var issuer = configuration["Jwt:Issuer"] ?? "CrownCommerce.Identity";
        var audience = configuration["Jwt:Audience"] ?? "CrownCommerce";

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
