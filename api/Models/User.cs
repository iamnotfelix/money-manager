namespace moneyManager.Models
{
    public record User
    {
        public Guid Id { get; init; }
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public DateTime DateCreated { get; set; }

        // Navigation propreties
        public ICollection<Expense> Expenses { get; set; } = new List<Expense>();
        public ICollection<Category> Categories { get; set; } = new List<Category>();
    }
}