
using moneyManager.Dtos;
using moneyManager.Pagination;

namespace moneyManager.Services
{
    public interface IAuthService
    {
        Task<string> RegisterAsync(RegisterUserDto user);
        Task<LoginResponse<GetByIdUserDto>> Login(LoginUserDto user);
    }
}