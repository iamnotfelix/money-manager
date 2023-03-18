namespace moneyManager.Dtos
{
    public record GetByIdUserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Name { get; set; }
        public ICollection<ExpenseDto> Expenses { get; set; } = new List<ExpenseDto>();
    }
}