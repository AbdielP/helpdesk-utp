extern alias UsersApi;

using UsersApi::helpdesk_users.Data;
using UsersApi::helpdesk_users.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Helpdesk.IntegrationTests;

public class UsersApiFactory : WebApplicationFactory<UsersApi::Program>
{
    private readonly string databaseName = $"users-tests-{Guid.NewGuid()}";

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration(configuration =>
        {
            configuration.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["Jwt:Key"] = "testing-secret-key-with-more-than-32-bytes",
                ["Jwt:Issuer"] = "helpdesk-utp",
                ["Jwt:Audience"] = "helpdesk-utp"
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<UserDbContext>>();
            services.RemoveAll<IDbContextOptionsConfiguration<UserDbContext>>();
            services.AddDbContext<UserDbContext>(options =>
                options.UseInMemoryDatabase(databaseName));

            using var scope = services.BuildServiceProvider().CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();

            dbContext.Database.EnsureDeleted();
            dbContext.Database.EnsureCreated();

            dbContext.Users.AddRange(
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "user1@mail.com",
                    Password = "1234",
                    Role = "user",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "support1@mail.com",
                    Password = "1234",
                    Role = "support",
                    CreatedAt = DateTime.UtcNow
                },
                new User
                {
                    Id = Guid.NewGuid(),
                    Email = "admin1@mail.com",
                    Password = "1234",
                    Role = "admin",
                    CreatedAt = DateTime.UtcNow
                });

            dbContext.SaveChanges();
        });
    }
}
