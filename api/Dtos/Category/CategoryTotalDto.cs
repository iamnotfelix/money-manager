namespace moneyManager.Dtos
{
    public record CategoryTotalDto : ICategoryDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public long Total { get; set; }
        public Guid UserId { get; set; }
    }
}