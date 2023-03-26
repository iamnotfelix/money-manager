namespace moneyManager.Dtos
{
    public record CategoryDto : ICategoyDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Guid UserId { get; set; }
    }
}