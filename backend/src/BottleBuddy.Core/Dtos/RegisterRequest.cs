using System.ComponentModel.DataAnnotations;

namespace BottleBuddy.Core.Dtos;

public class RegisterRequest
{
    // Required authentication fields
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Please enter a valid email address")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(8, ErrorMessage = "Password must be at least 8 characters")]
    [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$",
        ErrorMessage = "Password must contain at least one uppercase letter, one lowercase letter, and one number")]
    public string Password { get; set; } = string.Empty;

    // Optional profile fields
    [MaxLength(100, ErrorMessage = "Full name cannot exceed 100 characters")]
    public string? FullName { get; set; }

    [MaxLength(50, ErrorMessage = "Username cannot exceed 50 characters")]
    [RegularExpression(@"^[a-zA-Z0-9_-]+$", ErrorMessage = "Username can only contain letters, numbers, underscores, and hyphens")]
    public string? Username { get; set; }

    [Phone(ErrorMessage = "Please enter a valid phone number")]
    public string? Phone { get; set; }
}
