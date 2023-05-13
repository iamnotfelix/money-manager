using Microsoft.AspNetCore.Mvc;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Services;
using moneyManager.Exceptions;
using moneyManager.Responses;
using moneyManager.Filters;
using Microsoft.AspNetCore.Authorization;

namespace moneyManager.Controllers
{
    [ApiController]
    [Authorize]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [AllowAnonymous]
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
        [Authorize(Roles = "Admin,Moderator,Regular")]
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
            catch (ForbiddenException e)
            {
                return BadRequest(e.Message);
            }
        }

        // PUT /categories/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Regular")]
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
            catch (ForbiddenException e)
            {
                return BadRequest(e.Message);
            }
        }

        // DELETE /categories/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Moderator,Regular")]
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
            catch (ForbiddenException e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}