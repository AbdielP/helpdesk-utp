namespace helpdesk_utp.auth.Models;

public record LoginRequest(string Email, string Password);
public record LoginResponse(string Token, AuthenticatedUser User);
public record AuthenticatedUser(Guid Id, string Email, string Role);
