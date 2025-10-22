using BottleBuddy.Api.Data;
using BottleBuddy.Api.Models;
using Microsoft.AspNetCore.Identity;

namespace BottleBuddy.Api;

public static class SeedData
{
    public static async Task Initialize(IServiceProvider serviceProvider)
    {
        var context = serviceProvider.GetRequiredService<ApplicationDbContext>();
        var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();

        // Ensure database is created
        await context.Database.EnsureCreatedAsync();

        // Check if we already have data
        if (context.BottleListings.Any())
        {
            return; // Database has been seeded
        }

        // Create test user
        var testUser = new ApplicationUser
        {
            UserName = "test@bottlebuddy.hu",
            Email = "test@bottlebuddy.hu"
        };

        var result = await userManager.CreateAsync(testUser, "Test123!");
        if (!result.Succeeded)
        {
            // User might already exist
            testUser = await userManager.FindByEmailAsync("test@bottlebuddy.hu");
        }

        if (testUser == null) return;

        // Sample bottle listings around Budapest with realistic coordinates
        var sampleListings = new List<BottleListing>
        {
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Bottles from apartment building",
                BottleCount = 45,
                LocationAddress = "Andrássy út 60, Budapest",
                Latitude = 47.5030,
                Longitude = 19.0638,
                EstimatedRefund = 4500,
                Status = "open",
                UserId = testUser.Id,
                Description = "Collected from neighbors, easy pickup from building entrance"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Party leftovers",
                BottleCount = 120,
                LocationAddress = "Váci utca 25, Budapest",
                Latitude = 47.4960,
                Longitude = 19.0533,
                EstimatedRefund = 12000,
                Status = "open",
                UserId = testUser.Id,
                Description = "From weekend party, lots of bottles"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Office bottles",
                BottleCount = 30,
                LocationAddress = "Deák Ferenc tér 3, Budapest",
                Latitude = 47.4980,
                Longitude = 19.0540,
                EstimatedRefund = 3000,
                Status = "open",
                UserId = testUser.Id,
                Description = "Weekly collection from office kitchen"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Family collection",
                BottleCount = 80,
                LocationAddress = "Hősök tere, Budapest",
                Latitude = 47.5150,
                Longitude = 19.0770,
                EstimatedRefund = 8000,
                Status = "open",
                UserId = testUser.Id,
                Description = "Month's worth of bottles from family"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Restaurant bottles",
                BottleCount = 200,
                LocationAddress = "Erzsébet tér 12, Budapest",
                Latitude = 47.4970,
                Longitude = 19.0550,
                EstimatedRefund = 20000,
                Status = "open",
                UserId = testUser.Id,
                Description = "Daily restaurant collection, ready for pickup"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Small batch",
                BottleCount = 15,
                LocationAddress = "Oktogon, Budapest",
                Latitude = 47.5055,
                Longitude = 19.0625,
                EstimatedRefund = 1500,
                Status = "open",
                UserId = testUser.Id,
                Description = "Just a few bottles, quick pickup"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Event cleanup",
                BottleCount = 150,
                LocationAddress = "Margit híd, Budapest",
                Latitude = 47.5152,
                Longitude = 19.0445,
                EstimatedRefund = 15000,
                Status = "open",
                UserId = testUser.Id,
                Description = "After outdoor event, many bottles"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Neighbor's bottles",
                BottleCount = 60,
                LocationAddress = "Blaha Lujza tér, Budapest",
                Latitude = 47.4960,
                Longitude = 19.0708,
                EstimatedRefund = 6000,
                Status = "open",
                UserId = testUser.Id,
                Description = "Collecting for elderly neighbor"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Campus bottles",
                BottleCount = 95,
                LocationAddress = "Kálvin tér, Budapest",
                Latitude = 47.4880,
                Longitude = 19.0616,
                EstimatedRefund = 9500,
                Status = "open",
                UserId = testUser.Id,
                Description = "Student dorm collection"
            },
            new BottleListing
            {
                Id = Guid.NewGuid(),
                Title = "Gym bottles",
                BottleCount = 40,
                LocationAddress = "Nyugati pályaudvar, Budapest",
                Latitude = 47.5108,
                Longitude = 19.0571,
                EstimatedRefund = 4000,
                Status = "open",
                UserId = testUser.Id,
                Description = "Weekly collection from fitness center"
            }
        };

        await context.BottleListings.AddRangeAsync(sampleListings);
        await context.SaveChangesAsync();
    }
}
