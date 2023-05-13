using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Models;
using moneyManager.Repositories;

namespace moneyManager.Services
{
    public class UserProfilesService : IUserProfilesService
    {
        private readonly DatabaseContext context;
        private readonly IPermission permission;

        public UserProfilesService(DatabaseContext context, IPermission permission)
        {
            this.context = context;
            this.permission = permission;
        }

        public async Task<UserProfileDto> GetByIdAsync(Guid id)
        {
            var userProfile = await context.UserProfiles.FindAsync(id);
            if (userProfile is null)
            {
                throw new NotFoundException("User not found.");
            }

            return userProfile.AsDto();
        }
        
        public async Task<UserProfileDto> AddAsync(CreateUserProfileDto userProfile)
        {
            this.permission.Check(userProfile.UserId);

            var user = await this.context.Users.FindAsync(userProfile.UserId);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var newUserProfile = new UserProfile() {
                Id = Guid.NewGuid(),
                Name = userProfile.Name,
                Status = userProfile.Status,
                Bio = userProfile.Bio,
                Gender = userProfile.Gender,
                Birthday = userProfile.Birthday,
                DateCreated = DateTime.Now,
                UserId = userProfile.UserId
            };

            newUserProfile.Validate();

            this.context.UserProfiles.Add(newUserProfile);
            await this.context.SaveChangesAsync();

            return newUserProfile.AsDto();
        }

        public async Task UpdateAsync(Guid id, UpdateUserProfileDto userProfile)
        {

            var existingUserProfile = await this.context.UserProfiles.FindAsync(id);
            if (existingUserProfile is null)
            {
                throw new NotFoundException("Userprofile not found.");
            }

            this.permission.Check(existingUserProfile.UserId);
            
            var validationUserProfile = new UserProfile {
                Id = id,
                Name = userProfile.Name,
                Status = userProfile.Status,
                Bio = userProfile.Bio,
                Gender = userProfile.Gender,
                Birthday = userProfile.Birthday
            };

            validationUserProfile.Validate();

            existingUserProfile.Name = userProfile.Name is null ? 
                existingUserProfile.Name : userProfile.Name;
            existingUserProfile.Status = userProfile.Status is null ? 
                existingUserProfile.Status : userProfile.Status;
            existingUserProfile.Bio = userProfile.Bio is null ?
                existingUserProfile.Bio : userProfile.Bio;
            existingUserProfile.Gender = userProfile.Gender is null ?
                existingUserProfile.Gender : userProfile.Gender;
            existingUserProfile.Birthday = userProfile.Birthday == DateTime.MinValue ?
                existingUserProfile.Birthday : userProfile.Birthday;

            await this.context.SaveChangesAsync();
            
            // NOTE:  might have concurency problems
        }
    }
}