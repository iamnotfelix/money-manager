using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    [Table("userprofiles")]
    public record UserProfile
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? Bio { get; set; }
        public string? Gender { get; set; }
        public DateOnly Birthday { get; set; }
        public DateTime DateCreated { get; set; }

        // Navigation properties
        public Guid UserId { get; set; }
        public User? User { get; set; }
    }
}