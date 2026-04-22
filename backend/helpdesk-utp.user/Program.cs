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

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<UserDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Endpoints
var ticketGroup = app.MapGroup("/ticket");

// GET /tickets
app.MapGet("/tickets", async (ITicketService ticketService) => 
    Results.Ok(await ticketService.GetTicketsAsync()));

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
    return Results.Created($"/ticket/{createdTicket.Id}", createdTicket);
});

app.Run();
