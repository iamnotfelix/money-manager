using moneyManager.Dtos;
using moneyManager.Models;
using moneyManager.Pagination;
using moneyManager.Repositories;
using moneyManager.Services;
using Moq;
using Moq.EntityFrameworkCore;
using Xunit;

namespace tests.ServicesTests
{
    public class ExpensesServiceTests
    {
        private readonly Mock<DatabaseContext> context;
        private readonly ExpensesService service;
        private readonly IUriBuilder uriBuilder;

        public ExpensesServiceTests()
        {
            this.context = new Mock<DatabaseContext>();
            this.uriBuilder = new moneyManager.Pagination.UriBuilder("http://localhost:5000");
            this.service = new ExpensesService(this.context.Object, this.uriBuilder);
        }

        [Theory]
        [InlineData(5)]
        [InlineData(10)]
        [InlineData(15)]
        [InlineData(25)]
        [InlineData(30)]
        public async Task GetExpensesHigherThanTest(int number)
        {
            var expenses = new List<Expense> {
                new Expense { Id = Guid.NewGuid(), Amount = 10 },
                new Expense { Id = Guid.NewGuid(), Amount = 20 },
                new Expense { Id = Guid.NewGuid(), Amount = 30 }
            };
            this.context.Setup(x => x.Expenses).ReturnsDbSet(expenses);

            var result = await this.service.GetExpensesHigherThan(number, new PaginationFilter(1, 20), "/expenses/filter/" + number.ToString());

            Assert.NotNull(result);
            Assert.All((IEnumerable<ExpenseDto>)result.Data, expense => Assert.True(expense.Amount > number));
        }
    }
}