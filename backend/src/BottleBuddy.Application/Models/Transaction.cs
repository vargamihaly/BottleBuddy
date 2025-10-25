using BottleBuddy.Application.Enums;

namespace BottleBuddy.Application.Models;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid ListingId { get; set; }
    public BottleListing? Listing { get; set; }
    public Guid PickupRequestId { get; set; }
    public PickupRequest? PickupRequest { get; set; }
    public decimal VolunteerAmount { get; set; }
    public decimal OwnerAmount { get; set; }
    public decimal TotalRefund { get; set; }
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? CompletedAtUtc { get; set; }
    public TransactionStatus Status { get; set; } = TransactionStatus.Pending;
}
