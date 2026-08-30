using Google.Apis.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Runtime.Intrinsics.X86;
namespace Vocabularity_Server.Controllers.Authentication.GoogleAuthentication
{
    [Route("/auth/google")]
    [ApiController]
    public class GoogleAuthentication(IConfiguration config) : ControllerBase
    {
        private readonly IConfiguration _config = config;

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
                var jwtPayload = new JwtPayload(payload.Email, payload.Subject, payload.Name, payload.Picture);
                var jwt = CreateJWT(jwtPayload);

                return Ok(new {token = jwt});
            }
            catch (Exception ex)
            {

                System.Diagnostics.Debug.WriteLine("EXCEPTION: " + ex); // now you'll actually see it in the console
                return BadRequest("Invalid Google token: " + ex.Message);
            }
        }

        private string CreateJWT(JwtPayload payload)
        {
            var claims = new[]
            {
                new System.Security.Claims.Claim("email", payload.Email),
                new System.Security.Claims.Claim("sub", payload.Subject),
                new System.Security.Claims.Claim("username", payload.Username),
                new System.Security.Claims.Claim("picture", payload.Picture)
            };

            var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(key, Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(4),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
     public class GoogleLoginDto(string token)
    {
        public string Token { get; set; } = token;
    }

    class JwtPayload(string email, string sub, string username, string picture)
    {
        public string Email { get; set; } = email;
        public string Subject { get; set; } = sub;
        public string Username { get; set; } = username;
        public string Picture { get; set; } = picture;

    }
}