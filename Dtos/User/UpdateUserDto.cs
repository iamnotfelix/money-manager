using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record UpdateUserDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Password { get; set; }
    }
}