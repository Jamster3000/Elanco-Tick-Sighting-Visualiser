using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using TickVisualizer_Backend.Models;

namespace ElantroProj.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : Controller
    {
        private readonly AuthSQL _authSQL;

        public AuthController(AuthSQL authSQL)
        {
            _authSQL = authSQL;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            try
            {
                //Make sure all fields are filled out
                if (string.IsNullOrWhiteSpace(request.FullName) ||
                    string.IsNullOrWhiteSpace(request.Email) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "All fields are required" });
                }

                //Make sure the password is at least 8 characters long
                if (request.Password.Length < 8)
                {
                    return BadRequest(new { message = "Password must be at least 8 characters" });
                }

                //make sure there is no account using the email address
                var existingUser = await _authSQL.GetUserByEmail(request.Email);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "Email is already in use" });
                }

                //Hash password
                // Researeched from https://claudiobernasconi.ch/blog/how-to-hash-passwords-with-bcrypt-in-csharp/
                string hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);

                var userAccount = new UserAccount
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    PasswordHash = hashedPassword,
                    CreatedAt = DateTime.UtcNow
                };

                int userId = await _authSQL.CreateUserAccount(userAccount);

                if (userId > 0)
                {
                    return Ok(new { message = "Account created successfully" });
                }
                else
                {
                    return StatusCode(500, new { message = "An error occurred while creating the account" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Signup error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during signup" });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Email and password are required" });
                }

                var user = await _authSQL.GetUserByEmailAndPassword(request.Email, request.Password);

                if (user != null)
                {
                    return Ok(new
                    {
                        message = "Login successful",
                        user = new
                        {
                            user.Id,
                            user.Email,
                            user.FullName
                        }
                    });
                }
                else
                {
                    return Unauthorized(new { message = "Invalid email or password" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        [HttpPost("update-email")]
        public async Task<IActionResult> UpdateEmail([FromBody] UpdateEmailRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.CurrentEmail) ||
                    string.IsNullOrWhiteSpace(request.NewEmail) ||
                    string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new { message = "Current email, new email, and password are required" });
                }

                var user = await _authSQL.GetUserByEmailAndPassword(request.CurrentEmail, request.Password);
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid current email or password" });
                }

                var existingUser = await _authSQL.GetUserByEmail(request.NewEmail);
                if (existingUser != null)
                {
                    return BadRequest(new { message = "New email is already in use" });
                }

                var updatedUser = await _authSQL.UpdateUserEmail(user.Id, request.NewEmail);
                if (updatedUser != null)
                {
                    return Ok(new
                    {
                        message = "Email updated successfully",
                        user = new
                        {
                            updatedUser.Id,
                            updatedUser.Email,
                            updatedUser.FullName
                        }
                    });
                }
                else
                {
                    return StatusCode(500, new { message = "An error occurred while updating the email" });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Update email error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while updating the email" });
            }
        }

        [HttpDelete("delete-account/{userId}")]
        public async Task<IActionResult> DeleteAccount(int userId)
        {
            try
            {
                await _authSQL.DeleteUserAccount(userId);
                return Ok(new { message = "Account deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Delete account error: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred while deleting the account" });
            }
        }
    }

    public class SignupRequest
    {
        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(8)]
        public string Password { get; set; }
    }

    public class UpdateEmailRequest
    {
        [Required]
        public string CurrentEmail { get; set; }

        [Required]
        [EmailAddress]
        public string NewEmail { get; set; }

        [Required]
        public string Password { get; set; }
    }
}
