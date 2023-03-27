using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Services;
using moneyManager.Exceptions;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoriesService service;

        public CategoriesController(IService<ICategoyDto> service) 
        {
            this.service = (CategoriesService) service;
        }

        // GET /categories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesAsync() 
        {
            try
            {
                var categories = await this.service.GetAllAsync();
                return Ok(categories);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }


        // GET /categories/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdCategoryDto>> GetCategoryAsync(Guid id)
        {
            try
            {
                var category = await this.service.GetByIdAsync(id);
                return Ok(category);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /categories/ordered
        [HttpGet("ordered")]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategoriesOrderedByTotalExpenseAmountAsync() 
        { 
            try
            {
                var categories = await this.service.GetCategoriesOrderedByTotalExpenseAmountAsync();
                return Ok(categories);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /categories/minimum
        [HttpGet("minimum")]
        public async Task<ActionResult<Category>> GetCategoryWithMinTotalExpenseAmountAsync() 
        { 
            try
            {
                var category = await this.service.GetCategoryWithMinTotalExpenseAmountAsync();
                return Ok(category);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /categories/maximum
        [HttpGet("maximum")]
        public async Task<ActionResult<Category>> GetCategoryWithMaxTotalExpenseAmountAsync() 
        { 
            try
            {
                var category = await this.service.GetCategoryWithMaxTotalExpenseAmountAsync();
                return Ok(category);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // POST /categories
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategoryAsync(CreateCategoryDto category) 
        {
            try
            {
                var newCategory = (GetByIdCategoryDto) await this.service.AddAsync(category);
                return CreatedAtAction(nameof(GetCategoryAsync), new { id = newCategory.Id }, newCategory);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return ValidationProblem(e.Message);
            }
        }

        // PUT /categories/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCategoryAsync(Guid id, UpdateCategoryDto category) 
        {
            try
            {
                await this.service.UpdateAsync(id, category);
                return NoContent();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
            catch (ValidationException e)
            {
                return ValidationProblem(e.Message);
            }

        }

        // DELETE /categories/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCategoryAsync(Guid id)
        {
            try
            {
                await this.service.DeleteAsync(id);
                return NoContent();
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
    }
}