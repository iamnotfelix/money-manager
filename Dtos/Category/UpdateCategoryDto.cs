using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record UpdateCategoryDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
    }
}