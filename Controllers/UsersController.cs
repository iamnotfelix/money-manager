using Microsoft.AspNetCore.Mvc;
using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;

namespace moneyManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly DatabaseContext context;

        public UsersController(DatabaseContext context) 
        {
            this.context = context;
        }


        // GET /expenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsersAsync() 
        { 
            var users = await Task.FromResult(this.context.Users.ToList<User>());
            if (users == null)
            {
                return NotFound();
            }

            return Ok(users.Select(user => user.AsDto()));
        }


        // GET /expenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<GetByIdUserDto>> GetUserAsync(Guid id)
        {
            if (this.context.Users is null) 
            {
                return NotFound();
            }

            var user = await context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }
            
            this.context.Users.Entry(user)
                .Collection(u => u.Expenses)
                .Load();
            
            var expensesDto = user.Expenses.Select(e => e.AsDto()).ToList();

            return new GetByIdUserDto
            {
                Id = user.Id,
                Username = user.Username,
                Name = user.Name,
                Expenses = expensesDto
            };
        }

        // POST /expense
        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUserAsync(CreateUserDto user) 
        {
            var actualUser = new User() {
                Id = Guid.NewGuid(),
                Username = user.Username,
                Name = user.Name,
                Email = user.Email,
                Password = user.Password,
                DateCreated = DateTime.Now
            };

            this.context.Users.Add(actualUser);
            await this.context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserAsync), new { id = actualUser.Id }, actualUser.AsDto());
        }

        // PUT /expense/{id}
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUserAsync(Guid id, UpdateUserDto user) 
        {
            var existingUser = await this.context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.Name = user.Name;
            existingUser.Password = user.Password;

            await this.context.SaveChangesAsync();
            
            // NOTE:  might have concurency problems

            return NoContent();
        }

        // DELETE /expenses/{id}
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteUserAsync(Guid id)
        {
            var exisitingUser = await this.context.Users.FindAsync(id);
            if (exisitingUser == null)
            {
                return NotFound();
            }

            // var usersExpenses = this.context.Expense.Where(expense => expense.User == exisitingUser);
            // if (usersExpenses != null && usersExpenses.Count() > 0)
            // {
            //     usersExpenses.Select(expense => this.context.Expense.Remove(expense));
            // }
            
            this.context.Users.Remove(exisitingUser); 
            await this.context.SaveChangesAsync();

            return NoContent();
        }
    }
}