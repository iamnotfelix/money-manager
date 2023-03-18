namespace moneyManager.Dtos
{
    public record GetByIdCategoryDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public UserDto? User { get; set; }
        public ICollection<ExpenseDto> Expenses { get; set;} = new List<ExpenseDto>();
    }
}