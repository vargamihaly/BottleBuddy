using System.ComponentModel.DataAnnotations;

namespace BottleBuddy.Application.Dtos;

public class CreateMessageDto : IValidatableObject
{
    [StringLength(1000, ErrorMessage = "Message content must not exceed 1000 characters")]
    public string? Content { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        // At least one of Content or Image must be provided
        // Image validation happens in the controller
        if (string.IsNullOrWhiteSpace(Content))
        {
            // This will be checked in conjunction with image in the controller
            yield return new ValidationResult(
                "Either content or image must be provided",
                new[] { nameof(Content) });
        }
    }
}
