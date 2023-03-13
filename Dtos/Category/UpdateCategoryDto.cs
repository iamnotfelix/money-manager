using System.ComponentModel.DataAnnotations;
using moneyManager.Models;

namespace moneyManager.Dtos
{
    public record UpdateCategoryDto
    {
        [Required]
        public string? Name { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}