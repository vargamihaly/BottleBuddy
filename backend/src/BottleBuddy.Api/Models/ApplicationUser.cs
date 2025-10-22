using Microsoft.AspNetCore.Identity;

namespace BottleBuddy.Api.Models;

public class ApplicationUser : IdentityUser
{
    // One-to-one relationship with Profile
    public Profile? Profile { get; set; }
}
