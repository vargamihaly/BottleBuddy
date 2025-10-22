using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using BottleBuddy.Api.Models;

namespace BottleBuddy.Api.Data;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : IdentityDbContext<ApplicationUser>(options)
{
    public DbSet<BottleListing> BottleListings => Set<BottleListing>();
    public DbSet<PickupRequest> PickupRequests => Set<PickupRequest>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Rating> Ratings => Set<Rating>();
    public DbSet<Transaction> Transactions => Set<Transaction>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure one-to-one relationship between ApplicationUser and Profile
        modelBuilder.Entity<ApplicationUser>()
            .HasOne(u => u.Profile)
            .WithOne(p => p.User)
            .HasForeignKey<Profile>(p => p.Id)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure Profile
        modelBuilder.Entity<Profile>(entity =>
        {
            entity.HasKey(p => p.Id);

            // Username should be unique if not null
            entity.HasIndex(p => p.Username)
                .IsUnique()
                .HasFilter("\"Username\" IS NOT NULL");

            // Set default values
            entity.Property(p => p.TotalRatings)
                .HasDefaultValue(0);

            entity.Property(p => p.CreatedAt)
                .HasDefaultValueSql("NOW()");
        });
    }
}
