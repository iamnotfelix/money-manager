
using moneyManager.Dtos;
using moneyManager.Responses;

namespace moneyManager.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterUserDto user);
        Task<LoginResponse<GetByIdUserDto>> Login(LoginUserDto user);
    }
}