namespace moneyManager.Dtos
{
    public record GetByIdIncomeDto : IIncomeDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public double Amount { get; set; }
        public string? Currency { get; set; }
        public string? Comments { get; set; }
        public UserDto? User { get; set; }
    }
}