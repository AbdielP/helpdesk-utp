using helpdesk_users.Data;
using helpdesk_users.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace helpdesk_users.Controllers;

[ApiController]
[Route("users")]
public class UsersController(
    UserDbContext dbContext,
    IConfiguration configuration,
    IWebHostEnvironment environment) : ControllerBase
{
    [Authorize(Roles = "admin")]
    [HttpGet]
    public async Task<ActionResult<List<UserResponse>>> GetUsers([FromQuery] string? role)
    {
        var normalizedRole = role?.Trim().ToLower();

        if (normalizedRole != "support")
        {
            return BadRequest("Only role=support is supported here.");
        }

        var users = await dbContext.Users
            .AsNoTracking()
            .Where(user => user.Role.ToLower() == normalizedRole)
            .OrderBy(user => user.Email)
            .Select(user => new UserResponse(
                user.Id,
                user.Email,
                user.Role,
                user.CreatedAt
            ))
            .ToListAsync();

        return Ok(users);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
        {
            return BadRequest("Email and password are required.");
        }

        var email = request.Email.Trim().ToLower();
        var user = await dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(user => user.Email.ToLower() == email);

        if (user is null || user.Password != request.Password)
        {
            return Unauthorized();
        }

        var token = CreateJwtToken(user.Id, user.Email, user.Role);
        Response.Cookies.Append("access_token", token, CreateAccessTokenCookieOptions());

        return Ok(new LoginResponse(
            new UserResponse(user.Id, user.Email, user.Role, user.CreatedAt)
        ));
    }

    [AllowAnonymous]
    [HttpPost("logout")]
    public IActionResult Logout()
    {
        Response.Cookies.Delete("access_token", CreateAccessTokenCookieOptions());
        return NoContent();
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserResponse>> GetCurrentUser()
    {
        var userId = GetCurrentUserId();
        if (userId is null)
        {
            return Unauthorized();
        }

        var user = await dbContext.Users
            .AsNoTracking()
            .Where(existing => existing.Id == userId)
            .Select(existing => new UserResponse(
                existing.Id,
                existing.Email,
                existing.Role,
                existing.CreatedAt
            ))
            .FirstOrDefaultAsync();

        return user is null ? Unauthorized() : Ok(user);
    }

    private string CreateJwtToken(Guid userId, string email, string role)
    {
        var key = configuration["Jwt:Key"];
        var issuer = configuration["Jwt:Issuer"];
        var audience = configuration["Jwt:Audience"];

        if (string.IsNullOrWhiteSpace(key))
        {
            throw new InvalidOperationException("Jwt:Key is not configured.");
        }

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer,
            audience,
            claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private Guid? GetCurrentUserId()
    {
        var rawUserId = User.FindFirstValue(ClaimTypes.NameIdentifier) ??
                        User.FindFirstValue(JwtRegisteredClaimNames.Sub);

        return Guid.TryParse(rawUserId, out var userId) ? userId : null;
    }

    private CookieOptions CreateAccessTokenCookieOptions() =>
        new()
        {
            HttpOnly = true,
            Secure = !environment.IsDevelopment(),
            SameSite = environment.IsDevelopment() ? SameSiteMode.Lax : SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddHours(8),
            Path = "/"
        };
}
