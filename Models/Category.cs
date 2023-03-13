using System.ComponentModel.DataAnnotations.Schema;

namespace moneyManager.Models
{
    public record Category
    {
        public Guid Id { get; init; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }
        public DateTime DateCreated { get; set; }
        
        public User? User { get; set; }
        //public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
    }
}