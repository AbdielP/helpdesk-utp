using helpdesk_users.Entities;
using Microsoft.EntityFrameworkCore;

namespace helpdesk_users.Data;

public static class DatabaseInitializer
{
    public static async Task InitializeAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<UserDbContext>>();

        await MigrateWithRetryAsync(dbContext, logger);
        await SeedUsersAsync(dbContext);
    }

    private static async Task MigrateWithRetryAsync(UserDbContext dbContext, ILogger logger)
    {
        const int maxAttempts = 10;

        for (var attempt = 1; attempt <= maxAttempts; attempt++)
        {
            try
            {
                await dbContext.Database.MigrateAsync();
                return;
            }
            catch (Exception exception) when (attempt < maxAttempts)
            {
                logger.LogWarning(
                    exception,
                    "Database migration attempt {Attempt}/{MaxAttempts} failed. Retrying...",
                    attempt,
                    maxAttempts);

                await Task.Delay(TimeSpan.FromSeconds(3));
            }
        }
    }

    private static async Task SeedUsersAsync(UserDbContext dbContext)
    {
        var users = new[]
        {
            new User { Email = "user1@mail.com", Password = "1234", Role = "user" },
            new User { Email = "user2@mail.com", Password = "1234", Role = "user" },
            new User { Email = "support1@mail.com", Password = "1234", Role = "support" },
            new User { Email = "support2@mail.com", Password = "1234", Role = "support" },
            new User { Email = "admin1@mail.com", Password = "1234", Role = "admin" }
        };

        foreach (var seedUser in users)
        {
            var userExists = await dbContext.Users
                .AnyAsync(user => user.Email.ToLower() == seedUser.Email);

            if (userExists)
            {
                continue;
            }

            seedUser.Id = Guid.NewGuid();
            seedUser.CreatedAt = DateTime.UtcNow;
            dbContext.Users.Add(seedUser);
        }

        await dbContext.SaveChangesAsync();
    }
}
