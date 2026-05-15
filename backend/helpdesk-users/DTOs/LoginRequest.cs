namespace helpdesk_users.DTOs;

public record LoginRequest(
    string Email,
    string Password
);
