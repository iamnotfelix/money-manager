using Microsoft.AspNetCore.Mvc;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Services;
using moneyManager.Exceptions;
using moneyManager.Responses;
using moneyManager.Filters;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly CategoriesService service;

        public CategoriesController(IService<ICategoryDto> service) 
        {
            this.service = (CategoriesService) service;
        }

        // GET /categories?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet]
        public async Task<ActionResult<PagedResponse<IEnumerable<CategoryDto>>>> GetCategoriesAsync([FromQuery] PaginationFilter filter) 
        {
            try
            {
                var categories = await this.service.GetAllAsync(filter, Request.Path.Value!);
                var castedCategories = new PagedResponse<IEnumerable<CategoryDto>>(categories);
                return Ok(castedCategories);
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

        // GET /categories/search?text=:text&number=:number
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> SearchUserAsync([FromQuery] SearchFilter filter)
        {
            try
            {
                var users = await this.service.SearchCategoryAsync(filter);
                return Ok(users);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /categories/total?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet("total")]
        public async Task<ActionResult<PagedResponse<IEnumerable<CategoryTotalDto>>>> GetCategoriesTotalAsync([FromQuery] PaginationFilter filter) 
        {
            try
            {
                var categories = await this.service.GetCategoriesTotalAsync(filter, Request.Path.Value!);
                var castedCategories = new PagedResponse<IEnumerable<CategoryTotalDto>>(categories);
                return Ok(castedCategories);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }


        // GET /categories/ordered
        [HttpGet("ordered")]
        public async Task<ActionResult<PagedResponse<IEnumerable<CategoryTotalDto>>>> GetCategoriesOrderedByTotalExpenseAmountAsync([FromQuery] PaginationFilter filter) 
        { 
            try
            {
                var categories = await this.service.GetCategoriesOrderedByTotalExpenseAmountAsync(filter, Request.Path.Value!);
                var castedCategories = new PagedResponse<IEnumerable<CategoryTotalDto>>(categories);
                return Ok(castedCategories);
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