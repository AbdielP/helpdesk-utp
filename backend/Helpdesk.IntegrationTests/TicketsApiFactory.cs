extern alias TicketsApi;

using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
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
using TicketsApi::helpdesk_tickets.Data;
using TicketsApi::helpdesk_tickets.Entities;

namespace Helpdesk.IntegrationTests;

public class TicketsApiFactory : WebApplicationFactory<TicketsApi::Program>
{
    public static readonly Guid UserOneId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    public static readonly Guid UserTwoId = Guid.Parse("22222222-2222-2222-2222-222222222222");
    public static readonly Guid SupportOneId = Guid.Parse("33333333-3333-3333-3333-333333333333");
    public static readonly Guid AdminOneId = Guid.Parse("44444444-4444-4444-4444-444444444444");
    public static readonly Guid UserOneTicketId = Guid.Parse("55555555-5555-5555-5555-555555555555");
    public static readonly Guid UserTwoTicketId = Guid.Parse("66666666-6666-6666-6666-666666666666");

    private const string JwtKey = "testing-secret-key-with-more-than-32-bytes";
    private readonly string databaseName = $"tickets-tests-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration(configuration =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = JwtKey,
                ["Jwt:Issuer"] = "helpdesk-utp",
                ["Jwt:Audience"] = "helpdesk-utp",
                ["Notifications:ApiUrl"] = ""
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<TicketsDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<TicketsDbContext>>();
            services.AddDbContext<TicketsDbContext>(options =>
                options.UseInMemoryDatabase(databaseName));

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TicketsDbContext>();

            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();
            SeedDatabase(dbContext);
        });
    }

    public HttpClient CreateAuthenticatedClient(Guid userId, string email, string role)
    {
        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization = null;
        client.DefaultRequestHeaders.Add("Cookie", $"access_token={CreateJwtToken(userId, email, role)}");

        return client;
    }

    public void ResetDatabase()
    {
        using var scope = Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TicketsDbContext>();

        dbContext.Database.EnsureDeleted();
        dbContext.Database.EnsureCreated();
        SeedDatabase(dbContext);
    }

    private static void SeedDatabase(TicketsDbContext dbContext)
    {
        var now = DateTime.UtcNow;

        dbContext.Users.AddRange(
            new User { Id = UserOneId, Email = "user1@mail.com", Role = "user" },
            new User { Id = UserTwoId, Email = "user2@mail.com", Role = "user" },
            new User { Id = SupportOneId, Email = "support1@mail.com", Role = "support" },
            new User { Id = AdminOneId, Email = "admin1@mail.com", Role = "admin" });

        dbContext.Tickets.AddRange(
            new Ticket
            {
                Id = UserOneTicketId,
                Title = "User one ticket",
                Description = "Ticket created by user one",
                Category = "Software",
                Priority = "medium",
                Status = "Abierto",
                CreatedBy = UserOneId,
                AssignedTo = null,
                CreatedAt = now.AddMinutes(-10),
                UpdatedAt = now.AddMinutes(-10)
            },
            new Ticket
            {
                Id = UserTwoTicketId,
                Title = "User two ticket",
                Description = "Ticket created by user two",
                Category = "Hardware",
                Priority = "high",
                Status = "Abierto",
                CreatedBy = UserTwoId,
                AssignedTo = SupportOneId,
                CreatedAt = now.AddMinutes(-5),
                UpdatedAt = now.AddMinutes(-5)
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
