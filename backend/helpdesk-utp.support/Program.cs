using helpdesk_utp.support.Data;
using helpdesk_utp.support.Repositories;
using helpdesk_utp.support.Services;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];

// OpenTelemetry Configuration
const string serviceName = "helpdesk-utp.support";

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

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
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

// Configure DB Context (using Npgsql)
builder.Services.AddDbContext<SupportDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repository and Service
builder.Services.AddScoped<ITicketRepository, TicketRepository>();
builder.Services.AddScoped<ITicketService, TicketService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("FrontendPolicy");

// GET /tickets
app.MapGet("/tickets", async (Guid? userId, ITicketService ticketService) =>
{
    if (userId is null || userId == Guid.Empty)
    {
        return Results.BadRequest("userId is required.");
    }

    var tickets = await ticketService.GetTicketsAsync(userId.Value);
    return Results.Ok(tickets);
});

// GET /ticket/:id
app.MapGet("/ticket/{id:guid}", async (Guid id, Guid? userId, ITicketService ticketService) =>
{
    if (userId is null || userId == Guid.Empty)
    {
        return Results.BadRequest("userId is required.");
    }

    var ticket = await ticketService.GetTicketByIdAsync(id, userId.Value);
    return ticket is not null ? Results.Ok(ticket) : Results.NotFound();
});

// PATCH /ticket/:id/status
app.MapPatch("/ticket/{id:guid}/status", async (Guid id, StatusUpdateDto statusUpdate, ITicketService ticketService) =>
{
    if (string.IsNullOrWhiteSpace(statusUpdate.Status))
    {
        return Results.BadRequest("Status is required.");
    }

    if (statusUpdate.ActorUserId == Guid.Empty)
    {
        return Results.BadRequest("actorUserId is required.");
    }

    var success = await ticketService.UpdateTicketStatusAsync(id, statusUpdate.Status, statusUpdate.ActorUserId);
    return success ? Results.NoContent() : Results.NotFound();
});

app.Run();

public record StatusUpdateDto(string Status, Guid ActorUserId);
