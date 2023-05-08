using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateUserDto : IUserDto
    {
        [Required]
        public string? Username { get; set; }
        [Required]
        public string? Email { get; set; }
        [Required]
        public string? Password { get; set; }
        [Required]
        public string? Roles { get; set; }
        public ICollection<Guid> ExpenseIds { get; set; } = new List<Guid>();
    }
}