using helpdesk_utp.admin.Services;
using Microsoft.AspNetCore.Mvc;

namespace helpdesk_utp.admin.Endpoints;

public static class AdminEndpoints
{
    public static void MapAdminEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/tickets", async (ITicketService ticketService) => 
            Results.Ok(await ticketService.GetAllTicketsAsync()));

        app.MapGet("/ticket/{id:guid}", async (Guid id, ITicketService ticketService) =>
        {
            var ticket = await ticketService.GetTicketByIdAsync(id);
            return ticket != null ? Results.Ok(ticket) : Results.NotFound();
        });

        app.MapPatch("/ticket/{id:guid}/status", async (Guid id, [FromBody] StatusUpdateRequest request, ITicketService ticketService) =>
        {
            var success = await ticketService.UpdateTicketStatusAsync(id, request.Status);
            return success ? Results.NoContent() : Results.NotFound();
        });

        app.MapPatch("/ticket/{id:guid}/assign", async (Guid id, [FromBody] AssignRequest request, ITicketService ticketService) =>
        {
            var success = await ticketService.AssignTicketAsync(id, request.UserId);
            return success ? Results.NoContent() : Results.NotFound();
        });

        app.MapGet("/users", async ([FromQuery] string role, IUserService userService) =>
        {
            if (string.IsNullOrEmpty(role)) return Results.BadRequest("Role is required");
            var users = await userService.GetUsersByRoleAsync(role);
            return Results.Ok(users);
        });
    }
}

public record StatusUpdateRequest(string Status);
public record AssignRequest(Guid UserId);
