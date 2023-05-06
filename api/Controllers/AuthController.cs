using Microsoft.AspNetCore.Mvc;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Responses;
using moneyManager.Services;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService service;

        public AuthController(IAuthService service) 
        {
            this.service = (AuthService) service;
        }

        // POST /auth/register
        [HttpPost("register")]
        public async Task<ActionResult<string>> RegisterAsync(RegisterUserDto user) 
        {
            try
            {
                var activationToken = await this.service.RegisterAsync(user);
                return Ok(activationToken);
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
        
        // POST /auth/register/confirm/:token
        [HttpPost("register/confirm/:token")]
        public async Task<ActionResult<GetByIdUserDto>> ActivateAsync(string token) 
        {
            try
            {
                var activationResponse = await this.service.ActivateAsync(token);
                return Ok(activationResponse);
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
        
        // POST /auth/login
        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse<GetByIdUserDto>>> LoginAsync(LoginUserDto user) 
        {
            try
            {
                var loginResponse = await this.service.Login(user);
                return Ok(loginResponse);
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
    }
}