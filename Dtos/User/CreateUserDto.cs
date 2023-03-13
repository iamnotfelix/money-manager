using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateUserDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}