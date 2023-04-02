using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateCategoryDto : ICategoyDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public Guid UserId { get; set; }
    }
}