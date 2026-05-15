using helpdesk_users.Data;
using helpdesk_users.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_users.Controllers;

[ApiController]
[Route("users")]
public class UsersController(UserDbContext dbContext) : ControllerBase
{
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

        var tokenPayload = $"{user.Id}:{user.Email}:{DateTime.UtcNow:O}";
        var token = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(tokenPayload));

        return Ok(new LoginResponse(
            token,
            new UserResponse(user.Id, user.Email, user.Role, user.CreatedAt)
        ));
    }
}
