using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Vocabularity_Server.Data;
using Vocabularity_Server.Models.Authentication.Requests;
using Vocabularity_Server.Models.Entities;

namespace Vocabularity_Server.Controllers.Authentication
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController(AppDbContext appDbContext, JwtService jwtService) : ControllerBase
    {
        private readonly AppDbContext _appDbContext = appDbContext;
        private readonly JwtService _jwtService = jwtService;

        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> CredentialsLogin([FromBody] CredentialsLoginRequest request)
        {
            var user = await _appDbContext.Users.FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || user.PasswordHash == null)
            {
                return Unauthorized(new
                {
                    error = "INVALID_CREDENTIALS",
                    message = "Invalid Username or Password."
                });
            }

            var hasher = new PasswordHasher<User>();

            var result = hasher.VerifyHashedPassword(
                user,
                user.PasswordHash,
                request.Password
            );

            if(result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new
                {
                    error = "INVALID_CREDENTIALS",
                    message = "Invalid Username or Password."
                });
            }

            var jwt = _jwtService.CreateToken(user);

            return Ok(new
            {
                token = jwt
            });
        }

    }
}
