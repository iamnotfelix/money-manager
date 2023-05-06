using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Responses;
using Microsoft.EntityFrameworkCore;
using moneyManager.Filters;

namespace moneyManager.Services
{
    public class UsersService : IService<IUserDto>
    {
        private readonly DatabaseContext context;
        private readonly IUriBuilder uriBuilder;

        public UsersService(DatabaseContext context, IUriBuilder uriBuilder)
        {
            this.context = context;
            this.uriBuilder = uriBuilder;
        }

        // Roles?
        public async Task<PagedResponse<IEnumerable<IUserDto>>> GetAllAsync(PaginationFilter filter, string route)
        {
            var users = await this.context.Users
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (users is null)
            {
                throw new NotFoundException("Users not found.");
            }

            var totalRecords = await this.context.Users.CountAsync();
            var usersDtos = users.Select(user => user.AsDto());
            
            return PagedResponse<IUserDto>.CreatePagedReponse(usersDtos, filter, totalRecords, uriBuilder, route);
        }

        // Roles?
        public async Task<IUserDto> GetByIdAsync(Guid id)
        {
            var user = await context.Users.FindAsync(id);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            await this.context.Entry(user)
                .Reference(u => u.UserProfile)
                .LoadAsync();
            
            await this.context.Users.Entry(user)
                .Collection(u => u.Expenses)
                .LoadAsync();
            
            await this.context.Users.Entry(user)
                .Collection(u => u.Categories)
                .LoadAsync();

            return user.AsGetByIdDto();
        }

        // Admin?
        public async Task<IEnumerable<UserDto>> SearchUserAsync(SearchFilter filter)
        {
            var users = await this.context.Users
                .Where(u => u.Username!.StartsWith(filter.Text, StringComparison.OrdinalIgnoreCase))
                .Take(filter.Number)
                .ToListAsync();

            if (users is null)
            {
                throw new NotFoundException("Users not found.");
            }

            return users.Select(user => user.AsDto());
        }

        // Admin?
        public async Task<PagedResponse<IEnumerable<IUserDto>>> GetUsersTotalAsync(PaginationFilter filter, string route)
        {
            var users = await this.context.Users
                .Include(u => u.Expenses)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (users is null)
            {
                throw new NotFoundException("Users not found.");
            }

            var totalRecords = await this.context.Users.CountAsync();
            var usersDtos = users.Select(user => user.AsTotalDto());
            
            return PagedResponse<IUserDto>.CreatePagedReponse(usersDtos, filter, totalRecords, uriBuilder, route);
        }

        // Admin
        public async Task<IUserDto> AddAsync(IUserDto entity)
        {
            var user = (CreateUserDto) entity;
            var actualUser = new User() {
                Id = Guid.NewGuid(),
                Username = user.Username,
                Email = user.Email,
                Password = user.Password,
                DateCreated = DateTime.Now
            };

            actualUser.Validate();

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            actualUser.Password = passwordHash;

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

        // Admin
        public async Task UpdateAsync(Guid id, IUserDto entity)
        {
            var user = (UpdateUserDto) entity;
            var existingUser = await this.context.Users.FindAsync(id);
            if (existingUser is null)
            {
                throw new NotFoundException("User not found.");
            }

            var validationUser = new User {
                Username = user.Username,
                Email = user.Email,
                Password = user.Password
            };

            validationUser.Validate();

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(user.Password);
            
            existingUser.Username = user.Username is null ?
                existingUser.Username : user.Username;
            existingUser.Email = user.Email is null ?
                existingUser.Email : user.Email;
            existingUser.Password = user.Password is null ?
                existingUser.Password : passwordHash;

            await this.context.SaveChangesAsync();
            // NOTE:  might have concurency problems
        }

        // Admin
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