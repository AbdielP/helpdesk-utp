using helpdesk_utp.auth.Models;
using helpdesk_utp.auth.Repositories;
using helpdesk_utp.auth.Services;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);

// OpenTelemetry Configuration
const string serviceName = "helpdesk-utp.auth";

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
builder.Services.AddOpenApi();

// Register Dependencies
builder.Services.AddScoped<IAuthRepository, MockAuthRepository>();
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// AUTH Endpoints
var authGroup = app.MapGroup("/auth");

authGroup.MapPost("/login", (LoginRequest request, IAuthService authService, ILogger<Program> logger) =>
{
    logger.LogInformation("Login attempt for user: {Username}", request.Username);
    var response = authService.Login(request);
    
    if (response is not null)
    {
        logger.LogInformation("Login successful for user: {Username}", request.Username);
        return Results.Ok(response);
    }
    
    logger.LogWarning("Login failed for user: {Username}", request.Username);
    return Results.Unauthorized();
});

authGroup.MapPost("/logout", (IAuthService authService, ILogger<Program> logger) =>
{
    logger.LogInformation("Logout request received");
    authService.Logout();
    logger.LogInformation("Logout successful");
    return Results.Ok(new { message = "Logged out successfully" });
});

app.Run();
