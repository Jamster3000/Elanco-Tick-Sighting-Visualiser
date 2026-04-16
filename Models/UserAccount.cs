using System.Text.Json.Serialization;

namespace TickVisualizer_Backend.Models
{
    public class UserAccount
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}
