using moneyManager.Models;

namespace moneyManager.Dtos
{
    public record ExpenseDto
    {
        public Guid Id { get; set; }
        public int Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public Guid UserId { get; set; }
        public DateTime Date { get; set; }
        
        // public ICollection<Category> Category { get; set; } = new List<Category>();
    }
}