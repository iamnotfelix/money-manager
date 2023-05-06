using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    [Table("expensecategories")]
    public record ExpenseCategory
    {
        public string? Notes { get; set; }
        public DateTime DateCreated { get; set; }
        
        // Navigation properties
        public Guid ExpenseId { get; set; }
        public Guid CategoryId { get; set; }
        public Expense? Expense { get; set; }
        public Category? Category { get; set; }
    }
}