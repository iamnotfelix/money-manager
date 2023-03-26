using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;

namespace moneyManager.Services
{
    public class UsersService : IService<IUserDto>
    {
        private readonly DatabaseContext context;

        public UsersService(DatabaseContext context)
        {
            this.context = context;
        }

        public async Task<IEnumerable<IUserDto>> GetAllAsync()
        {
            var users = await Task.FromResult(this.context.Users.ToList<User>());
            if (users is null)
            {
                throw new NotFoundException();
            }

            return users.Select(user => user.AsDto());
        }

        public async Task<IUserDto> GetByIdAsync(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }
            
            await this.context.Users.Entry(user)
                .Collection(u => u.Expenses)
                .LoadAsync();
            
            await this.context.Users.Entry(user)
                .Collection(u => u.Categories)
                .LoadAsync();

            return user.AsGetByIdDto();
        }

        public async Task<IUserDto> AddAsync(IUserDto entity)
        {
            var user = (CreateUserDto) entity;
            var actualUser = new User() {
                Id = Guid.NewGuid(),
                Username = user.Username,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                DateCreated = DateTime.Now
            };

            foreach (var expenseId in user.ExpenseIds)
            {
                var expense = await this.context.Expenses.FindAsync(expenseId);
                if (expense is null)
                {
                    throw new NotFoundException("Expense not found.");
                }

                expense.UserId = actualUser.Id;
            }

            this.context.Users.Add(actualUser);
            await this.context.SaveChangesAsync();

            return actualUser.AsGetByIdDto();
        }

        public async Task UpdateAsync(Guid id, IUserDto entity)
        {
            var user = (UpdateUserDto) entity;
            var existingUser = await this.context.Users.FindAsync(id);
            if (existingUser is null)
            {
                throw new NotFoundException("User not found.");
            }

            existingUser.Name = user.Name is null ?
                existingUser.Name : user.Name;
            existingUser.Password = user.Password is null ?
                existingUser.Password : user.Password;

            await this.context.SaveChangesAsync();
            // NOTE:  might have concurency problems
        }

        public async Task DeleteAsync(Guid id)
        {
            var exisitingUser = await this.context.Users.FindAsync(id);
            if (exisitingUser is null)
            {
                throw new NotFoundException("User not found.");
            }
            
            this.context.Users.Remove(exisitingUser); 
            await this.context.SaveChangesAsync();
        }
    }
}