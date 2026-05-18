using System.Net.Http.Json;
using helpdesk_tickets.DTOs;

namespace helpdesk_tickets.Services;

public class NotificationEventPublisher(
    IHttpClientFactory httpClientFactory,
    IConfiguration configuration,
    ILogger<NotificationEventPublisher> logger)
{
    private readonly string? notificationsApiUrl = configuration["Notifications:ApiUrl"];

    public async Task PublishTicketEventAsync(
        string type,
        Guid ticketId,
        Guid? actorUserId = null,
        string? previousStatus = null,
        string? newStatus = null)
    {
        if (string.IsNullOrWhiteSpace(notificationsApiUrl))
        {
            return;
        }

        try
        {
            var client = httpClientFactory.CreateClient();
            client.BaseAddress = new Uri(notificationsApiUrl);

            var request = new NotificationTicketEventRequest(
                type,
                ticketId,
                actorUserId,
                previousStatus,
                newStatus);

            var response = await client.PostAsJsonAsync("/notifications/events/ticket", request);
            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning(
                    "Notification event {EventType} for ticket {TicketId} failed with status {StatusCode}.",
                    type,
                    ticketId,
                    response.StatusCode);
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(
                ex,
                "Notification event {EventType} for ticket {TicketId} could not be published.",
                type,
                ticketId);
        }
    }
}
