using System.ComponentModel.DataAnnotations;
using moneyManager.Models;

namespace moneyManager.Dtos
{
    public record CreateExpenseDto
    {
        [Required]
        [Range(0, 10000)]
        public int Amount { get; set; }
        [Required]
        public List<Category>? Category { get; set; }
        [Required]
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public User? User { get; set; }
        [Required]
        public DateTime Date { get; set; }
    }
}