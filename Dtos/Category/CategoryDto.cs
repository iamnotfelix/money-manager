namespace moneyManager.Dtos
{
    public record CategoryDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Guid UserId { get; set; }
        public ICollection<ExpenseDto> Expenses { get; set; } = new List<ExpenseDto>();
    }
}