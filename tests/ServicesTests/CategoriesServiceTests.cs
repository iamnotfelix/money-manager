using moneyManager.Dtos;
using moneyManager.Filters;
using moneyManager.Models;
using moneyManager.Pagination;
using moneyManager.Repositories;
using moneyManager.Services;
using Moq;
using Moq.EntityFrameworkCore;
using Xunit;

namespace tests.ServicesTests
{
    public class CategoriesServiceTests
    {
        private readonly Mock<DatabaseContext> context;
        private readonly CategoriesService service;
        private readonly IUriBuilder uriBuilder;

        public CategoriesServiceTests()
        {
            this.context = new Mock<DatabaseContext>();
            this.uriBuilder = new moneyManager.Services.UriBuilder("http://localhost:5000");
            this.service = new CategoriesService(this.context.Object, this.uriBuilder);
        }

        [Fact]
        public async Task GetCategoriesOrderedByTotalExpenseAmountTest()
        {
            var expense1 = new Expense { Id = Guid.NewGuid(), Amount = 10 };
            var expense2 = new Expense { Id = Guid.NewGuid(), Amount = 20 };
            var expense3 = new Expense { Id = Guid.NewGuid(), Amount = 30 };
            var expense4 = new Expense { Id = Guid.NewGuid(), Amount = 40 };
            var expense5 = new Expense { Id = Guid.NewGuid(), Amount = 50 };

            var category1 = new Category { Id = Guid.NewGuid() };
            var category2 = new Category { Id = Guid.NewGuid() };
            var category3 = new Category { Id = Guid.NewGuid() };

            var expenseCategory1 = new ExpenseCategory { 
                ExpenseId = expense1.Id, Expense = expense1, 
                CategoryId = category1.Id, Category = category1    
            };
            var expenseCategory2 = new ExpenseCategory { 
                ExpenseId = expense5.Id, Expense = expense5, 
                CategoryId = category1.Id, Category = category1    
            };
            var expenseCategory3 = new ExpenseCategory { 
                ExpenseId = expense3.Id, Expense = expense3, 
                CategoryId = category2.Id, Category = category2    
            };
            var expenseCategory4 = new ExpenseCategory { 
                ExpenseId = expense4.Id, Expense = expense4, 
                CategoryId = category2.Id, Category = category2    
            };
            var expenseCategory5 = new ExpenseCategory { 
                ExpenseId = expense1.Id, Expense = expense1, 
                CategoryId = category3.Id, Category = category3    
            };
            var expenseCategory6 = new ExpenseCategory { 
                ExpenseId = expense2.Id, Expense = expense2, 
                CategoryId = category3.Id, Category = category3    
            };

            category1.ExpenseCategories = new List<ExpenseCategory> { expenseCategory1, expenseCategory2 };
            category2.ExpenseCategories = new List<ExpenseCategory> { expenseCategory2, expenseCategory4 };
            category3.ExpenseCategories = new List<ExpenseCategory> { expenseCategory5, expenseCategory6 };

            expense1.ExpenseCategories = new List<ExpenseCategory> { expenseCategory1, expenseCategory5 };
            expense2.ExpenseCategories = new List<ExpenseCategory> { expenseCategory6 };
            expense3.ExpenseCategories = new List<ExpenseCategory> { expenseCategory3 };
            expense4.ExpenseCategories = new List<ExpenseCategory> { expenseCategory4 };
            expense5.ExpenseCategories = new List<ExpenseCategory> { expenseCategory2};

            var categories = new List<Category> { category1, category2, category3 };
            this.context.Setup(x => x.Categories).ReturnsDbSet(categories);

            var result = await this.service.GetCategoriesOrderedByTotalExpenseAmountAsync(new PaginationFilter(1, 20), "/categories/ordered/");
            var castedResult = new PagedResponse<IEnumerable<CategoryTotalDto>>(result);

            Assert.NotNull(castedResult.Data);
            var res = castedResult.Data.ToList();
            for (int i = 1; i < res.Count(); ++i) 
            {
                Assert.True(res[i].Total > res[i - 1].Total);
            }
        }
    }
}