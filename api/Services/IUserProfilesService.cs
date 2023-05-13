using moneyManager.Dtos;

namespace moneyManager.Services
{
    public interface IUserProfilesService
    {
        Task<UserProfileDto> GetByIdAsync(Guid id);
        Task<UserProfileDto> AddAsync(CreateUserProfileDto userProfile);
        Task UpdateAsync(Guid id, UpdateUserProfileDto userProfile);
    }
}