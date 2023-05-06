using System.ComponentModel.DataAnnotations;

namespace moneyManager.Dtos
{
    public record CreateExpenseDto : IExpenseDto
    {
        [Required]
        public double Amount { get; set; }
        [Required]
        public string? PaymentType { get; set; }
        [Required]
        public string? Description { get; set; }
        [Required]
        public string? Currency { get; set; }
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public DateOnly Date { get; set; }
        [Required]
        public ICollection<ExpenseCategoryDto> ExpenseCategories { get; set; } 
            = new List<ExpenseCategoryDto>();
    }
}