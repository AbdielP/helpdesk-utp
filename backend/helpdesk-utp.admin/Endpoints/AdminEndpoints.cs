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
            if (request.ActorUserId == Guid.Empty)
            {
                return Results.BadRequest("actorUserId is required");
            }

            var success = await ticketService.UpdateTicketStatusAsync(id, request.Status, request.ActorUserId);
            return success ? Results.NoContent() : Results.NotFound();
        });

        app.MapPatch("/ticket/{id:guid}/assign", async (Guid id, [FromBody] AssignRequest request, ITicketService ticketService) =>
        {
            if (request.AssigneeUserId == Guid.Empty || request.ActorUserId == Guid.Empty)
            {
                return Results.BadRequest("assigneeUserId and actorUserId are required");
            }

            var success = await ticketService.AssignTicketAsync(id, request.AssigneeUserId, request.ActorUserId);
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

public record StatusUpdateRequest(string Status, Guid ActorUserId);
public record AssignRequest(Guid AssigneeUserId, Guid ActorUserId);
