namespace moneyManager.Dtos
{
    public record GetByIdExpenseDto : IExpenseDto
    {
        public Guid Id { get; set; }
        public double Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public UserDto? User { get; set; }
        public DateOnly Date { get; set; }
        public ICollection<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    }
}