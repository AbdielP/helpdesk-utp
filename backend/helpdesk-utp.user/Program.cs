using helpdesk_utp.user.Data;
using helpdesk_utp.user.Models;
using helpdesk_utp.user.Repositories;
using helpdesk_utp.user.Services;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

// OpenTelemetry Configuration
const string serviceName = "helpdesk-utp.user";
builder.Services.AddOpenTelemetry()
    .ConfigureResource(resource => resource.AddService(serviceName))
    .WithTracing(tracing => tracing
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddConsoleExporter())
    .WithMetrics(metrics => metrics
        .AddAspNetCoreInstrumentation()
        .AddHttpClientInstrumentation()
        .AddConsoleExporter());

builder.Logging.AddOpenTelemetry(options =>
{
    options.SetResourceBuilder(ResourceBuilder.CreateDefault().AddService(serviceName));
    options.AddConsoleExporter();
});

// EF Core with Npgsql (Driver: Npgsql.EntityFrameworkCore.PostgreSQL)
builder.Services.AddDbContext<UserDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Dependencies
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<ITicketService, TicketService>();

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

var applyMigrations = builder.Configuration.GetValue("ApplyMigrationsOnStartup", false);

if (applyMigrations)
{
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

// Endpoints
var ticketGroup = app.MapGroup("/ticket");

// GET /tickets
app.MapGet("/tickets", async (Guid? userId, ITicketService ticketService) =>
{
    if (userId is null || userId == Guid.Empty)
    {
        return Results.BadRequest("userId is required.");
    }

    return Results.Ok(await ticketService.GetTicketsAsync(userId.Value));
});

// GET /ticket/:id
ticketGroup.MapGet("/{id:guid}", async (Guid id, ITicketService ticketService) =>
{
    var ticket = await ticketService.GetTicketAsync(id);
    return ticket is not null ? Results.Ok(ticket) : Results.NotFound();
});

// POST /ticket/new
ticketGroup.MapPost("/new", async (CreateTicketRequest request, ITicketService ticketService) =>
{
    var createdTicket = await ticketService.CreateNewTicketAsync(request);
    return Results.Created($"/ticket/{createdTicket.Id}", new
    {
        id = createdTicket.Id,
        title = createdTicket.Title,
        description = createdTicket.Description,
        category = createdTicket.Category,
        priority = createdTicket.Priority,
        status = createdTicket.Status,
        created_by = createdTicket.CreatedBy,
        assigned_to = createdTicket.AssignedTo,
        created_at = createdTicket.CreatedAt,
        updated_at = createdTicket.UpdatedAt
    });
});

app.Run();
