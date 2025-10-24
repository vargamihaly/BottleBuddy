using Microsoft.AspNetCore.Identity;

namespace BottleBuddy.Api.Models;

public class User : IdentityUser
{
    // One-to-one relationship with Profile
    public Profile? Profile { get; set; }
}
