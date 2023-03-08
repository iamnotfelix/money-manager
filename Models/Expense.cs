
namespace moneyManager.Models
{
    public record Expense 
    {
        public Guid Id { get; init; }
        public int Amount { get; set; }
        public List<Category>? Category { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public User? User { get; set; }
        public DateTime Date { get; set; }

    }
}