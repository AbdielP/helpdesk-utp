namespace helpdesk_users.DTOs;

/// <summary>
/// Datos publicos del usuario que el frontend necesita para permisos y UI.
/// </summary>
public record UserResponse(
    Guid Id,
    string Email,
    string Role,
    DateTime CreatedAt
);
