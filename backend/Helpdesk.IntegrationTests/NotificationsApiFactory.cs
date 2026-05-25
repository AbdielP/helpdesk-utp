extern alias NotificationsApi;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using NotificationsApi::helpdesk_notifications.Data;
using NotificationsApi::helpdesk_notifications.Entities;

namespace Helpdesk.IntegrationTests;

public class NotificationsApiFactory : WebApplicationFactory<NotificationsApi::Program>
{
    public static readonly Guid UserOneId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    public static readonly Guid UserTwoId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
    public static readonly Guid AdminOneId = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");
    public static readonly Guid TicketOneId = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");
    public static readonly Guid NotificationOneId = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");

    private const string JwtKey = "testing-secret-key-with-more-than-32-bytes";
    private readonly string databaseName = $"notifications-tests-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration(configuration =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = JwtKey,
                ["Jwt:Issuer"] = "helpdesk-utp",
                ["Jwt:Audience"] = "helpdesk-utp"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<NotificationsDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<NotificationsDbContext>>();
            services.AddDbContext<NotificationsDbContext>(options =>
                options.UseInMemoryDatabase(databaseName));

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<NotificationsDbContext>();

            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
            SeedDatabase(dbContext);
        });
    }

    public HttpClient CreateAuthenticatedClient(Guid userId, string email, string role)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Add("Cookie", $"access_token={CreateJwtToken(userId, email, role)}");

        return client;
    }

    public void ResetDatabase()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<NotificationsDbContext>();

        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();
        SeedDatabase(dbContext);
    }

    private static void SeedDatabase(NotificationsDbContext dbContext)
    {
        dbContext.Users.AddRange(
            new User { Id = UserOneId, Email = "user1@mail.com", Role = "user" },
            new User { Id = UserTwoId, Email = "user2@mail.com", Role = "user" },
            new User { Id = AdminOneId, Email = "admin1@mail.com", Role = "admin" });

        dbContext.Tickets.Add(new Ticket
        {
            Id = TicketOneId,
            Title = "Seed ticket",
            Status = "Abierto",
            CreatedBy = UserOneId,
            AssignedTo = null
        });

        dbContext.Notifications.Add(new Notification
        {
            Id = NotificationOneId,
            UserId = UserOneId,
            TicketId = TicketOneId,
            Type = "ticket.created",
            Message = "Tu ticket fue creado correctamente.",
            IsRead = false,
            CreatedAt = DateTime.UtcNow.AddMinutes(-5)
        });

        dbContext.SaveChanges();
    }

    private static string CreateJwtToken(Guid userId, string email, string role)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, email),
            new Claim(ClaimTypes.Email, email),
            new Claim(ClaimTypes.Role, role)
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey)),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            "helpdesk-utp",
            "helpdesk-utp",
            claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
