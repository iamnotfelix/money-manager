namespace moneyManager.Dtos
{
    public record UserProfileDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? Bio { get; set; }
        public string? Gender { get; set; }
        public DateOnly Birthday { get; set; }
    }
}