using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;

namespace Helpdesk.IntegrationTests;

public class UsersLoginTests(UsersApiFactory factory) : IClassFixture<UsersApiFactory>
{
    [Fact]
    public async Task Login_WithInvalidCredentials_ReturnsUnauthorized()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/users/login", new
        {
            email = "user1@mail.com",
            password = "wrong-password"
        });

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task Login_WithValidCredentials_ReturnsOkAndSetsAccessTokenCookie()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/users/login", new
        {
            email = "user1@mail.com",
            password = "1234"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Contains(response.Headers.GetValues("Set-Cookie"), cookie =>
            cookie.StartsWith("access_token=", StringComparison.OrdinalIgnoreCase));
    }

    [Fact]
    public async Task GetCurrentUser_WithoutLogin_ReturnsUnauthorized()
    {
        var client = factory.CreateClient();

        var response = await client.GetAsync("/users/me");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task GetCurrentUser_WithLogin_ReturnsLoggedUser()
    {
        var client = factory.CreateClient();
        await LoginAsync(client, "user1@mail.com", "1234");

        var response = await client.GetAsync("/users/me");
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("user1@mail.com", body.GetProperty("email").GetString());
        Assert.Equal("user", body.GetProperty("role").GetString());
    }

    [Fact]
    public async Task GetSupportUsers_AsRegularUser_ReturnsForbidden()
    {
        var client = factory.CreateClient();
        await LoginAsync(client, "user1@mail.com", "1234");

        var response = await client.GetAsync("/users?role=support");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetSupportUsers_AsAdmin_ReturnsSupportUsers()
    {
        var client = factory.CreateClient();
        await LoginAsync(client, "admin1@mail.com", "1234");

        var response = await client.GetAsync("/users?role=support");
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Single(body.EnumerateArray());
        Assert.Equal("support1@mail.com", body[0].GetProperty("email").GetString());
        Assert.Equal("support", body[0].GetProperty("role").GetString());
    }

    private static async Task LoginAsync(HttpClient client, string email, string password)
    {
        var response = await client.PostAsJsonAsync("/users/login", new
        {
            email,
            password
        });

        response.EnsureSuccessStatusCode();
        var cookie = response.Headers.GetValues("Set-Cookie")
            .First(value => value.StartsWith("access_token=", StringComparison.OrdinalIgnoreCase))
            .Split(';')[0];

        client.DefaultRequestHeaders.Authorization = null;
        client.DefaultRequestHeaders.Remove("Cookie");
        client.DefaultRequestHeaders.Add("Cookie", cookie);
    }
}
