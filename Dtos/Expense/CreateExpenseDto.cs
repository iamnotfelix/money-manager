using System.ComponentModel.DataAnnotations;
using moneyManager.Models;

namespace moneyManager.Dtos
{
    public record CreateExpenseDto
    {
        [Required]
        public int Amount { get; set; }
        [Required]
        public string? PaymentType { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public DateTime Date { get; set; }
        
        // [Required]
        // public ICollection<Category> Category { get; set; } = new List<Category>();
    }
}