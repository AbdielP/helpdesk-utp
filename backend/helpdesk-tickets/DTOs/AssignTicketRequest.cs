namespace helpdesk_tickets.DTOs;

public record AssignTicketRequest(
    Guid AssigneeUserId,
    Guid ActorUserId
);
