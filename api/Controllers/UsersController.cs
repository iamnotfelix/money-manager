using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Filters;
using moneyManager.Responses;
using moneyManager.Services;

namespace moneyManager.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UsersService service;

        public UsersController(IService<IUserDto> service) 
        {
            this.service = (UsersService) service;
        }


        // GET /users?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponse<IEnumerable<UserDto>>>> GetUsersAsync([FromQuery] PaginationFilter filter) 
        { 
            try
            {
                var users = await this.service.GetAllAsync(filter, Request.Path.Value!);
                var castedUsers = new PagedResponse<IEnumerable<UserDto>>(users);
                return Ok(castedUsers);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }


        // GET /users/{id}
        [HttpGet("{id}")]
        // [Authorize(Roles = "Admin")]
        [AllowAnonymous]
        public async Task<ActionResult<GetByIdUserDto>> GetUserAsync(Guid id)
        {
            try
            {
                var user = await this.service.GetByIdAsync(id);
                return Ok(user);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // GET /users/search?text=:text&number=:number
        [HttpGet("search")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<UserDto>>> SearchUserAsync([FromQuery] SearchFilter filter)
        {
            try
            {
                var users = await this.service.SearchUserAsync(filter);
                return Ok(users);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }
        
        // GET /users/total?pageNumber=:pageNumber&pageSize=:pageSize
        [HttpGet("total")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PagedResponse<IEnumerable<UserTotalDto>>>> GetUsersTotalAsync([FromQuery] PaginationFilter filter)
        {
            try
            {
                var users = await this.service.GetUsersTotalAsync(filter, Request.Path.Value!);
                var castedUsers = new PagedResponse<IEnumerable<UserTotalDto>>(users);
                return Ok(castedUsers);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // POST /users
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<UserDto>> CreateUserAsync(CreateUserDto user) 
        {
            try
            {
                var newUser = (GetByIdUserDto) await this.service.AddAsync(user);
                return CreatedAtAction(nameof(GetUserAsync), new { id = newUser.Id }, newUser);
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

        // PUT /users/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserDto user) 
        {
            try
            {
                await this.service.UpdateAsync(id, user);
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

        // DELETE /users/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteUserAsync(Guid id)
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