namespace Vocabularity_Server.Controllers.Authentication
{
    public class JwtPayload(
        Guid userId,
        string username,
        string? email = null,
        string? googleId = null,
        string? picture = null
        )
    {

        public Guid UserId { get; set; } = userId;
        public string Username { get; set; } = username;


        public string? Email { get; set; } = email;
        public string? GoogleId { get; set; } = googleId;
        public string? Picture { get; set; } = picture;
    }
}
