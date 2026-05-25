using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Helpdesk.IntegrationTests;

public class NotificationsTests : IClassFixture<NotificationsApiFactory>
{
    private readonly NotificationsApiFactory factory;

    public NotificationsTests(NotificationsApiFactory factory)
    {
        this.factory = factory;
        this.factory.ResetDatabase();
    }

    [Fact]
    public async Task GetUserNotifications_WithoutLogin_ReturnsUnauthorized()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserOneId}");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetUserNotifications_AsOwner_ReturnsNotifications()
    {
        var client = CreateUserOneClient();

        var response = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserOneId}");
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var notificationIds = body.EnumerateArray()
            .Select(notification => notification.GetProperty("id").GetGuid())
            .ToList();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(NotificationsApiFactory.NotificationOneId, notificationIds);
    }

    [Fact]
    public async Task GetUserNotifications_ForAnotherUser_ReturnsForbidden()
    {
        var client = CreateUserOneClient();

        var response = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserTwoId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetUserNotifications_AsAdmin_ReturnsNotifications()
    {
        var client = CreateAdminClient();

        var response = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserOneId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetUnreadCount_AsOwner_ReturnsUnreadCount()
    {
        var client = CreateUserOneClient();

        var response = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserOneId}/unread-count");
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(1, body.GetProperty("count").GetInt32());
    }

    [Fact]
    public async Task CreateNotification_WithValidRequest_ReturnsCreated()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/notifications", new
        {
            user_id = NotificationsApiFactory.UserOneId,
            ticket_id = NotificationsApiFactory.TicketOneId,
            type = "custom",
            message = "Nueva notificacion de prueba."
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal(NotificationsApiFactory.UserOneId, body.GetProperty("user_id").GetGuid());
        Assert.Equal("custom", body.GetProperty("type").GetString());
        Assert.False(body.GetProperty("is_read").GetBoolean());
    }

    [Fact]
    public async Task CreateFromTicketEvent_WhenTicketCreated_CreatesUserAndAdminNotifications()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/notifications/events/ticket", new
        {
            type = "ticket.created",
            ticket_id = NotificationsApiFactory.TicketOneId,
            actor_user_id = NotificationsApiFactory.UserOneId,
            previous_status = (string?)null,
            new_status = (string?)null
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        var userIds = body.EnumerateArray()
            .Select(notification => notification.GetProperty("user_id").GetGuid())
            .ToList();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(NotificationsApiFactory.UserOneId, userIds);
        Assert.Contains(NotificationsApiFactory.AdminOneId, userIds);
    }

    [Fact]
    public async Task CreateFromTicketEvent_WhenTicketAssigned_CreatesUserNotification()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/notifications/events/ticket", new
        {
            type = "ticket.assigned",
            ticket_id = NotificationsApiFactory.TicketOneId,
            actor_user_id = NotificationsApiFactory.AdminOneId,
            previous_status = (string?)null,
            new_status = (string?)null
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(body.EnumerateArray(), notification =>
            notification.GetProperty("type").GetString() == "ticket.assigned" &&
            notification.GetProperty("user_id").GetGuid() == NotificationsApiFactory.UserOneId);
    }

    [Fact]
    public async Task CreateFromTicketEvent_WhenTicketClosed_CreatesClosedNotification()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/notifications/events/ticket", new
        {
            type = "ticket.closed",
            ticket_id = NotificationsApiFactory.TicketOneId,
            actor_user_id = NotificationsApiFactory.AdminOneId,
            previous_status = "En progreso",
            new_status = "Cerrado"
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(body.EnumerateArray(), notification =>
            notification.GetProperty("type").GetString() == "ticket.closed" &&
            notification.GetProperty("message").GetString() == "Tu ticket fue cerrado.");
    }

    [Fact]
    public async Task CreateFromTicketEvent_WhenStatusChanged_CreatesStatusChangedNotification()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/notifications/events/ticket", new
        {
            type = "ticket.status_changed",
            ticket_id = NotificationsApiFactory.TicketOneId,
            actor_user_id = NotificationsApiFactory.AdminOneId,
            previous_status = "Abierto",
            new_status = "En progreso"
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(body.EnumerateArray(), notification =>
            notification.GetProperty("type").GetString() == "ticket.status_changed" &&
            notification.GetProperty("message").GetString() == "Tu ticket cambio de Abierto a En progreso.");
    }

    [Fact]
    public async Task MarkAsRead_AsOwner_ReturnsNoContent()
    {
        var client = CreateUserOneClient();

        var response = await client.PatchAsync(
            $"/notifications/{NotificationsApiFactory.NotificationOneId}/read",
            null);
        var listResponse = await client.GetAsync($"/notifications/user/{NotificationsApiFactory.UserOneId}");
        var notifications = await listResponse.Content.ReadFromJsonAsync<JsonElement>();
        var notification = notifications.EnumerateArray()
            .First(item => item.GetProperty("id").GetGuid() == NotificationsApiFactory.NotificationOneId);

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.True(notification.GetProperty("is_read").GetBoolean());
    }

    [Fact]
    public async Task MarkAsRead_ForAnotherUser_ReturnsForbidden()
    {
        var client = factory.CreateAuthenticatedClient(
            NotificationsApiFactory.UserTwoId,
            "user2@mail.com",
            "user");

        var response = await client.PatchAsync(
            $"/notifications/{NotificationsApiFactory.NotificationOneId}/read",
            null);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private HttpClient CreateUserOneClient() =>
        factory.CreateAuthenticatedClient(NotificationsApiFactory.UserOneId, "user1@mail.com", "user");

    private HttpClient CreateAdminClient() =>
        factory.CreateAuthenticatedClient(NotificationsApiFactory.AdminOneId, "admin1@mail.com", "admin");
}
