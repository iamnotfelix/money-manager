namespace moneyManager.Models
{
    public record Category
    {
        public Guid Id { get; init; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public string? Color { get; set; }
        public User? CreatedBy { get; set; }
        public DateTime DateCreated { get; set; }
    }
}