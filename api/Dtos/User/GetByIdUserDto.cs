namespace moneyManager.Dtos
{
    public record GetByIdUserDto : IUserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public ICollection<ExpenseDto> Expenses { get; set; } = new List<ExpenseDto>();
        public ICollection<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    }
}