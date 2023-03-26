using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record ExpenseCategoryDto
    {
        public string? Notes { get; set; }
        [Required]
        public Guid CategoryId { get; set; }
    }
}