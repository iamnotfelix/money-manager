using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateUserProfileDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Status { get; set; }
        [Required]
        public string? Bio { get; set; }
        [Required]
        public string? Gender { get; set; }
        [Required]
        public DateTime Birthday { get; set; }
        [Required]
        public Guid UserId { get; set; }
    }
}