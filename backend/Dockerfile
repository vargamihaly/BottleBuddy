# Backend API Dockerfile - Multi-stage build for .NET 9

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build

WORKDIR /app

# Copy project file only (skip solution to avoid docker-compose.dcproj reference issue)
COPY src/BottleBuddy.Api/BottleBuddy.Api.csproj ./src/BottleBuddy.Api/

# Restore dependencies for the specific project
RUN dotnet restore ./src/BottleBuddy.Api/BottleBuddy.Api.csproj

# Copy all source files
COPY . .

# Build the application
WORKDIR /app/src/BottleBuddy.Api
RUN dotnet build -c Release -o /app/build

# Publish the application
RUN dotnet publish -c Release -o /app/publish

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published files from build stage
COPY --from=build /app/publish .

# Create a non-root user
RUN useradd -m -u 1001 appuser && chown -R appuser:appuser /app
USER appuser

# Expose ports
EXPOSE 3668

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3668/health || exit 1

# Set environment variables
ENV ASPNETCORE_URLS=http://+:3668
ENV ASPNETCORE_ENVIRONMENT=Production

# Start the application
ENTRYPOINT ["dotnet", "BottleBuddy.Api.dll"]
