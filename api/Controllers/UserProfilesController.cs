using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Services;

namespace moneyManager.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class UserProfilesController : ControllerBase
    {
        private readonly UserProfilesService service;

        public UserProfilesController(IUserProfilesService service) 
        {
            this.service = (UserProfilesService) service;
        }


        // GET /userprofiles/{id}
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<UserProfileDto>> GetUserProfileAsync(Guid id)
        {
            try
            {
                var userProfile = await this.service.GetByIdAsync(id);
                return Ok(userProfile);
            }
            catch (NotFoundException e)
            {
                return NotFound(e.Message);
            }
        }

        // POST /userprofiles
        [HttpPost]
        [Authorize(Roles = "Admin,Moderator,Regular")]
        public async Task<ActionResult<UserDto>> CreateUserAsync(CreateUserProfileDto userProfile) 
        {
            try
            {
                var newUserProfile = await this.service.AddAsync(userProfile);
                return CreatedAtAction(nameof(GetUserProfileAsync), new { id = newUserProfile.Id }, newUserProfile);
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

        // PUT /userprofiles/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Moderator,Regular")]
        public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserProfileDto userProfile) 
        {
            try
            {
                await this.service.UpdateAsync(id, userProfile);
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
    }
}