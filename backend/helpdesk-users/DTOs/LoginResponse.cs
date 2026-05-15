namespace helpdesk_users.DTOs;

public record LoginResponse(
    string Token,
    UserResponse User
);
