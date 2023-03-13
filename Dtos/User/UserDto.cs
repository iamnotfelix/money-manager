namespace moneyManager.Dtos
{
    public record UserDto
    {
        public Guid Id { get; set; }
        public string? Username { get; set; }
        public string? Name { get; set; }
    }
}