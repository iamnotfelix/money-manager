using moneyManager.Repositories;
using moneyManager.Models;
using moneyManager.Dtos;
using moneyManager.Exceptions;
using moneyManager.Responses;
using Microsoft.EntityFrameworkCore;
using moneyManager.Filters;

namespace moneyManager.Services
{
    public class IncomesService : IService<IIncomeDto>
    {
        private readonly DatabaseContext context;
        private readonly IUriBuilder uriBuilder;
        private readonly IPermission permission;


        public IncomesService(DatabaseContext context, IUriBuilder uriBuilder, IPermission permission)
        {
            this.context = context;
            this.uriBuilder = uriBuilder;
            this.permission = permission;
        }
        
        public async Task<PagedResponse<IEnumerable<IIncomeDto>>> GetAllAsync(PaginationFilter filter, string route)
        {
            var incomes = await this.context.Incomes
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (incomes is null)
            {
                throw new NotFoundException("Incomes not found.");
            }
            
            var totalRecords = await this.context.Incomes.CountAsync();
            var incomesDtos = incomes.Select(income => income.AsDto());

            return PagedResponse<IIncomeDto>.CreatePagedReponse(incomesDtos, filter, totalRecords, uriBuilder, route);
        }

        public async Task<IIncomeDto> GetByIdAsync(Guid id)
        {
            var income = await context.Incomes.FindAsync(id);
            if (income is null)
            {
                throw new NotFoundException("Income not found.");
            }

            await this.context.Entry(income)
                .Reference(i => i.User)
                .LoadAsync();

            return income.AsGetByIdDto();
        }

        public async Task<PagedResponse<IEnumerable<IIncomeDto>>> GetIncomesTotalAsync(PaginationFilter filter, string route)
        {
            var incomes = await this.context.Incomes
                .Include(i => i.User)
                .ThenInclude(u => u!.Expenses)
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .ToListAsync();

            if (incomes is null)
            {
                throw new NotFoundException("Incomes not found.");
            }
            
            var totalRecords = await this.context.Incomes.CountAsync();
            var incomesDtos = incomes.Select(income => income.AsTotalDto());

            return PagedResponse<IIncomeDto>.CreatePagedReponse(incomesDtos, filter, totalRecords, uriBuilder, route);
        }

        public async Task<IIncomeDto> AddAsync(IIncomeDto entity)
        {
            CreateIncomeDto income = (CreateIncomeDto) entity;

            this.permission.Check(income.UserId);

            var user = await this.context.Users.FindAsync(income.UserId);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var actualIncome = new Income() 
            {
                Id = Guid.NewGuid(),
                Name = income.Name,
                Amount = income.Amount,
                Currency = income.Currency,
                Comments = income.Comments,
                DateCreated = DateTime.Now,
                UserId = income.UserId
            };

            actualIncome.Validate();

            this.context.Incomes.Add(actualIncome);
            await this.context.SaveChangesAsync();

            return actualIncome.AsGetByIdDto();
        }

        public async Task UpdateAsync(Guid id, IIncomeDto entity)
        {
            UpdateIncomeDto income = (UpdateIncomeDto) entity;

            this.permission.Check(id);

            var existingIncome = await this.context.Incomes.FindAsync(id);
            if (existingIncome is null)
            {
                throw new NotFoundException("Income not found.");
            }

            var validationIncome = new Income {
                Name = income.Name,
                Amount = income.Amount,
                Currency = income.Currency,
                Comments = income.Comments
            };

            validationIncome.Validate();

            existingIncome.Name = income.Name is null ? 
                existingIncome.Name : income.Name;
            existingIncome.Amount = income.Amount is 0 ? 
                existingIncome.Amount : income.Amount;
            existingIncome.Currency = income.Currency is null ?
                existingIncome.Currency : income.Currency;
            existingIncome.Comments = income.Comments is null ?
                existingIncome.Comments : income.Comments;
            
            await this.context.SaveChangesAsync();
            // NOTE:  might have concurency problems
        }
        
        public async Task DeleteAsync(Guid id)
        {
            this.permission.Check(id);
            
            var exisitingIncome = await this.context.Incomes.FindAsync(id);
            if (exisitingIncome is null)
            {
                throw new NotFoundException("Income not found.");
            }
            
            this.context.Incomes.Remove(exisitingIncome);
            await this.context.SaveChangesAsync();
        }
    }
}