using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record RegisterUserDto : IUserDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}