using Microsoft.EntityFrameworkCore;
using BottleBuddy.Api;
using BottleBuddy.Api.Data;
using BottleBuddy.Api.Middleware;
using BottleBuddy.Api.Services;
using BottleBuddy.Api.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Authentication & Authorization
builder.Services.AddAuthenticationConfiguration(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:8080", "http://localhost:8081")
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register application services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IBottleListingService, BottleListingService>();
builder.Services.AddScoped<PickupRequestService>();

// Swagger/OpenAPI
builder.Services.AddSwaggerDocumentation();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerDocumentation();
}

app.UseGlobalExceptionHandler();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Map controllers
app.MapControllers();

// Run database migrations and seed sample data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();

    try
    {
        // Run database migrations
        logger.LogInformation("Applying database migrations...");
        var context = services.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
        logger.LogInformation("Database migrations applied successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while applying database migrations.");
        throw; // Re-throw to prevent app from starting with broken database
    }

    try
    {
        // Seed sample data
        await SeedData.Initialize(services);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "An error occurred while seeding the database. Continuing anyway...");
        // Don't throw - app can run without seed data
    }
}

app.Run();
