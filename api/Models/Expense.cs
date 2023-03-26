
namespace moneyManager.Models
{
    public record Expense 
    {
        public Guid Id { get; init; }
        public int Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateCreated { get; set; }
        
        // Navigation propreties
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public ICollection<ExpenseCategory> ExpenseCategories { get; set; } = new List<ExpenseCategory>();
    }
}