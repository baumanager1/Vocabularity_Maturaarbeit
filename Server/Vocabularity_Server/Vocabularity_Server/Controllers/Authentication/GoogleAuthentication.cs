using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using Vocabularity_Server.Data;
using Vocabularity_Server.Models.Entities;
namespace Vocabularity_Server.Controllers.Authentication
{
    [Route("/api/auth/google")]
    [ApiController]
    public class GoogleAuthentication(AppDbContext context, JwtService jwtService) : ControllerBase
    {
        private readonly AppDbContext _appDbContext = context;
        private readonly JwtService _jwtService = jwtService;


        [HttpPost]
        public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto dto)
        {

            var settings = new GoogleJsonWebSignature.ValidationSettings()
            {
                Audience = new List<string>() { "594148206302-ap6mfrultm3rj0qm45sjk2m27i0o56b6.apps.googleusercontent.com" }
            };

            GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.Token, settings);
                Console.WriteLine("GoogleEmail: " + payload.Email + "Subject: " + payload.Subject + "GoogleUsername: " + payload.Name);
                var user = await UserCheck(payload.Subject);
                var jwt = _jwtService.CreateToken(user);

                return Ok(new {token = jwt});
            }
            catch (Exception ex)
            {
                if (ex is UserNotFoundException) 
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new
                    {
                        error = "USER_NOT_FOUND",
                        message = "Please use an existing User Account to proceed"
                    });
                }
                Debug.WriteLine("EXCEPTION: " + ex); 
                return BadRequest("Invalid Google token: " + ex.Message);
            }
        }

        private async Task<User> UserCheck(string googleUserId)
        {
            return await _appDbContext.Users
                 .FirstOrDefaultAsync(u => u.GoogleId == googleUserId)
                 ?? throw new UserNotFoundException();
        }
    }
    public class GoogleLoginDto(string token)
    {
        public string Token { get; set; } = token;
    }

    class UserNotFoundException() : Exception { }
}