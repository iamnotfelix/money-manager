using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record LoginUserDto : IUserDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}