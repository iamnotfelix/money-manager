namespace moneyManager.Dtos
{
    public record UpdateCategoryDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
    }
}