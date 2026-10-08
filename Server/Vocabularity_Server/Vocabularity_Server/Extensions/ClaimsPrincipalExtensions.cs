using System.Security.Claims;

namespace Vocabularity_Server.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid? GetUserId(this ClaimsPrincipal user)
        {
            var userIdClaim = user.FindFirst("userId")?.Value;

            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return null;
            }

            return userId;
        }
    }
}
