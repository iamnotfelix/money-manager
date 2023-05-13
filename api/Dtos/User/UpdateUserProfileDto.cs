namespace moneyManager.Dtos
{
    public record UpdateUserProfileDto
    {
        public string? Name { get; set; }
        public string? Status { get; set; }
        public string? Bio { get; set; }
        public string? Gender { get; set; }
        public DateTime Birthday { get; set; }
    }
}