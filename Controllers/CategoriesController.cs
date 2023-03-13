// using Microsoft.AspNetCore.Mvc;
// using moneyManager.Repositories;
// using moneyManager.Models;
// using moneyManager.Dtos;

// namespace moneyManager.Controllers
// {
//     [ApiController]
//     [Route("api/[controller]")]
//     public class CategoriesController : ControllerBase
//     {
//         private readonly DatabaseContext context;

//         public CategoriesController(DatabaseContext context) 
//         {
//             this.context = context;
//         }


//         // GET /expenses
//         [HttpGet]
//         public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesAsync() 
//         { 
//             if (this.context.Categories == null) 
//             {
//                 return NotFound();
//             }

//             return await Task.FromResult(this.context.Categories.ToList<Category>());
//         }


//         // GET /expenses/{id}
//         [HttpGet("{id}")]
//         public async Task<ActionResult<Category>> GetCategoryAsync(Guid id)
//         {
//             if (this.context.Categories is null) 
//             {
//                 return NotFound();
//             }

//             var category = await context.Categories.FindAsync(id);

//             if (category == null)
//             {
//                 return NotFound();
//             }

//             return category;
//         }

//         // POST /expense
//         [HttpPost]
//         public async Task<ActionResult<Category>> CreateCategoryAsync(Category category) 
//         {
//             var actualCategory = new Category() {
//                 Id = Guid.NewGuid(),
//                 Name = category.Name,
//                 Description = category.Description,
//                 User = category.User,
//                 DateCreated = category.DateCreated
//             };

//             this.context.Categories.Add(actualCategory);
//             await this.context.SaveChangesAsync();

//             return CreatedAtAction(nameof(GetCategoryAsync), new { id = actualCategory.Id }, actualCategory);
//         }

//         // PUT /expense/{id}
//         [HttpPut("{id}")]
//         public async Task<ActionResult> UpdateCategoryAsync(Guid id, Category category) 
//         {
//             var existingCategory = await this.context.Categories.FindAsync(id);
//             if (existingCategory == null)
//             {
//                 return NotFound();
//             }

//             existingCategory.Name = category.Name;
//             existingCategory.Description = category.Description;
//             existingCategory.User = category.User;
//             existingCategory.DateCreated = category.DateCreated;

//             await this.context.SaveChangesAsync();
            
//             // NOTE:  might have concurency problems

//             return NoContent();
//         }

//         // DELETE /expenses/{id}
//         [HttpDelete("{id}")]
//         public async Task<ActionResult> DeleteCategoryAsync(Guid id)
//         {
//             var exisitingCategory = await this.context.Categories.FindAsync(id);
//             if (exisitingCategory == null)
//             {
//                 return NotFound();
//             }
            
//             this.context.Categories.Remove(exisitingCategory); 
//             await this.context.SaveChangesAsync();

//             return NoContent();
//         }
//     }
// }