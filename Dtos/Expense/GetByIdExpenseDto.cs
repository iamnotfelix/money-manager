namespace moneyManager.Dtos
{
    public record GetByIdExpenseDto
    {
        public Guid Id { get; set; }
        public int Amount { get; set; }
        public string? PaymentType { get; set; }
        public string? Description { get; set; }
        public string? Currency { get; set; }
        public UserDto? User { get; set; }
        public DateTime Date { get; set; }
        public ICollection<CategoryDto> Categories { get; set; } = new List<CategoryDto>();
    }
}