using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace Helpdesk.IntegrationTests;

public class TicketsTests : IClassFixture<TicketsApiFactory>
{
    private readonly TicketsApiFactory factory;

    public TicketsTests(TicketsApiFactory factory)
    {
        this.factory = factory;
        this.factory.ResetDatabase();
    }

    [Fact]
    public async Task GetTickets_WithoutLogin_ReturnsUnauthorized()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/tickets");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task CreateTicket_AsRegularUser_ReturnsCreated()
    {
        var client = CreateUserClient();

        var response = await client.PostAsJsonAsync("/tickets", new
        {
            title = "Cannot access platform",
            description = "The student portal does not load.",
            category = "Software",
            priority = "high"
        });
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.Equal("Cannot access platform", body.GetProperty("title").GetString());
        Assert.Equal("high", body.GetProperty("priority").GetString());
        Assert.Equal(TicketsApiFactory.UserOneId, body.GetProperty("created_by").GetGuid());
    }

    [Fact]
    public async Task CreateTicket_WithoutTitle_ReturnsBadRequest()
    {
        var client = CreateUserClient();

        var response = await client.PostAsJsonAsync("/tickets", new
        {
            title = "",
            description = "The student portal does not load.",
            category = "Software",
            priority = "high"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task CreateTicket_WithInvalidPriority_ReturnsBadRequest()
    {
        var client = CreateUserClient();

        var response = await client.PostAsJsonAsync("/tickets", new
        {
            title = "Cannot access platform",
            description = "The student portal does not load.",
            category = "Software",
            priority = "urgent"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task GetTickets_AsRegularUser_ReturnsOnlyOwnTickets()
    {
        var client = CreateUserClient();

        var response = await client.GetAsync("/tickets");
        var tickets = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.All(tickets.EnumerateArray(), ticket =>
            Assert.Equal(TicketsApiFactory.UserOneId, ticket.GetProperty("created_by").GetGuid()));
    }

    [Fact]
    public async Task GetTickets_AsAdmin_ReturnsAllTickets()
    {
        var client = CreateAdminClient();

        var response = await client.GetAsync("/tickets");
        var tickets = await response.Content.ReadFromJsonAsync<JsonElement>();
        var ticketIds = tickets.EnumerateArray()
            .Select(ticket => ticket.GetProperty("id").GetGuid())
            .ToList();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(TicketsApiFactory.UserOneTicketId, ticketIds);
        Assert.Contains(TicketsApiFactory.UserTwoTicketId, ticketIds);
    }

    [Fact]
    public async Task AssignTicket_AsAdmin_AssignsTicketToSupport()
    {
        var client = CreateAdminClient();

        var response = await client.PatchAsJsonAsync($"/tickets/{TicketsApiFactory.UserOneTicketId}/assign", new
        {
            assigneeUserId = TicketsApiFactory.SupportOneId
        });
        var detailResponse = await client.GetAsync($"/tickets/{TicketsApiFactory.UserOneTicketId}");
        var ticket = await detailResponse.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal(HttpStatusCode.OK, detailResponse.StatusCode);
        Assert.Equal(TicketsApiFactory.SupportOneId, ticket.GetProperty("assigned_to").GetGuid());
    }

    [Fact]
    public async Task AssignTicket_AsRegularUser_ReturnsForbidden()
    {
        var client = CreateUserClient();

        var response = await client.PatchAsJsonAsync($"/tickets/{TicketsApiFactory.UserOneTicketId}/assign", new
        {
            assigneeUserId = TicketsApiFactory.SupportOneId
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetTicketById_AsSupportForUnassignedTicket_ReturnsNotFound()
    {
        var client = CreateSupportClient();

        var response = await client.GetAsync($"/tickets/{TicketsApiFactory.UserOneTicketId}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UpdateTicketStatus_AsAssignedSupport_ReturnsNoContentAndChangesStatus()
    {
        var client = CreateSupportClient();

        var response = await client.PatchAsJsonAsync($"/tickets/{TicketsApiFactory.UserTwoTicketId}/status", new
        {
            status = "En progreso"
        });
        var detailResponse = await client.GetAsync($"/tickets/{TicketsApiFactory.UserTwoTicketId}");
        var ticket = await detailResponse.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Equal(HttpStatusCode.OK, detailResponse.StatusCode);
        Assert.Equal("En progreso", ticket.GetProperty("status").GetString());
    }

    private HttpClient CreateUserClient() =>
        factory.CreateAuthenticatedClient(TicketsApiFactory.UserOneId, "user1@mail.com", "user");

    private HttpClient CreateSupportClient() =>
        factory.CreateAuthenticatedClient(TicketsApiFactory.SupportOneId, "support1@mail.com", "support");

    private HttpClient CreateAdminClient() =>
        factory.CreateAuthenticatedClient(TicketsApiFactory.AdminOneId, "admin1@mail.com", "admin");
}
