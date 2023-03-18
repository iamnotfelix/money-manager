using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly DatabaseContext context;

        public CategoriesController(DatabaseContext context) 
        {
            this.context = context;
        }


        // GET /categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesAsync() 
        { 
            var categories = await Task.FromResult(this.context.Categories.ToList<Category>());
            if (categories == null)
            {
                return NotFound();
            }
            
            return Ok(categories.Select(category => category.AsDto()));
        }


        // GET /categories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdCategoryDto>> GetCategoryAsync(Guid id)
        {
            if (this.context.Categories is null) 
            {
                return NotFound();
            }

            var category = await context.Categories.FindAsync(id);

            if (category == null)
            {
                return NotFound();
            }

            await this.context.Entry(category)
                .Reference(c => c.User)
                .LoadAsync();

            await this.context.Entry(category)
                .Collection(c => c.ExpenseCategories)
                .LoadAsync();

            return new GetByIdCategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                User = category.User!.AsDto(),
                Expenses = category.ExpenseCategories.Select(ec => ec.Expense!.AsDto()).ToList()
            };
        }

        // POST /categories
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync(CreateCategoryDto category) 
        {
            var user = await this.context.Users.FindAsync(category.UserId);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            var actualCategory = new Category() {
                Id = Guid.NewGuid(),
                Name = category.Name,
                Description = category.Description,
                DateCreated = DateTime.Now,
                UserId = category.UserId
            };

            this.context.Categories.Add(actualCategory);
            await this.context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetCategoryAsync), new { id = actualCategory.Id }, actualCategory.AsDto());
        }

        // PUT /categories/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategoryAsync(Guid id, UpdateCategoryDto category) 
        {
            var existingCategory = await this.context.Categories.FindAsync(id);
            if (existingCategory == null)
            {
                return NotFound();
            }

            existingCategory.Name = category.Name is null ?
                existingCategory.Name : category.Name;
            existingCategory.Description = category.Description is null ?
                existingCategory.Description : category.Description;

            await this.context.SaveChangesAsync();
            
            // NOTE:  might have concurency problems

            return NoContent();
        }

        // DELETE /categories/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategoryAsync(Guid id)
        {
            var exisitingCategory = await this.context.Categories.FindAsync(id);
            if (exisitingCategory == null)
            {
                return NotFound();
            }
            
            this.context.Categories.Remove(exisitingCategory); 
            await this.context.SaveChangesAsync();

            return NoContent();
        }
    }
}