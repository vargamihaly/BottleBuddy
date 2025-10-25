using BottleBuddy.Core.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;


namespace BottleBuddy.Persistence;

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
                .HasFilter("[Username] IS NOT NULL");

            // Set default values
            entity.Property(p => p.TotalRatings)
                .HasDefaultValue(0);

            entity.Property(p => p.CreatedAtUtc)
                .HasDefaultValueSql("GETUTCDATE()");
        });

        // Configure BottleListing
        modelBuilder.Entity<BottleListing>(entity =>
        {
            entity.HasKey(bl => bl.Id);

            // Relationship with User (Owner)
            entity.HasOne(bl => bl.Owner)
                .WithMany()
                .HasForeignKey(bl => bl.OwnerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete cycle
        });

        // Configure PickupRequest
        modelBuilder.Entity<PickupRequest>(entity =>
        {
            entity.HasKey(pr => pr.Id);

            // Relationship with BottleListing
            entity.HasOne(pr => pr.Listing)
                .WithMany()
                .HasForeignKey(pr => pr.ListingId)
                .OnDelete(DeleteBehavior.Cascade); // Can cascade from listing

            // Relationship with Volunteer (User)
            entity.HasOne(pr => pr.Volunteer)
                .WithMany()
                .HasForeignKey(pr => pr.VolunteerId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete cycle
        });

        // Configure Transaction
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasKey(t => t.Id);

            entity.HasOne(t => t.Listing)
                .WithOne()
                .HasForeignKey<Transaction>(t => t.ListingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(t => t.PickupRequest)
                .WithOne()
                .HasForeignKey<Transaction>(t => t.PickupRequestId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Rating
        modelBuilder.Entity<Rating>(entity =>
        {
            entity.HasKey(r => r.Id);

            // Relationship with Rater (who gives the rating)
            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(r => r.RaterId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Relationship with Rated User (who receives the rating)
            entity.HasOne<ApplicationUser>()
                .WithMany()
                .HasForeignKey(r => r.RatedUserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // Relationship with Transaction
            entity.HasOne<Transaction>()
                .WithMany()
                .HasForeignKey(r => r.TransactionId)
                .OnDelete(DeleteBehavior.Cascade); // Can cascade from transaction
        });
    }
}
