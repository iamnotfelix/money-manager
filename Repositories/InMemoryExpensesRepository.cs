using moneyManager.Models;

namespace moneyManager.Repositories
{
    public class InMemoryExpensesRepository : IExpensesRepository
    {
        private readonly List<Expense> expenses = new List<Expense>()
        {
            new Expense {Id = Guid.NewGuid(), Amount = 10, Category = "Groceries", Description = "asdf", PaymentType = "Revolut", Time = DateTime.Now },
            new Expense {Id = Guid.NewGuid(), Amount = 20, Category = "Transport", Description = "asdf", PaymentType = "BT", Time = DateTime.Now },
            new Expense {Id = Guid.NewGuid(), Amount = 30, Category = "Entertainment", Description = "asdf", PaymentType = "Cash", Time = DateTime.Now }
        };

        public IEnumerable<Expense> getExpenses() 
        {
            return this.expenses;
        }

        public Expense getExpense(Guid id) 
        {
            return this.expenses.Where(expense => expense.Id == id).SingleOrDefault();
        }

        public void createExpense(Expense expense) 
        {
            this.expenses.Add(expense);
        }

    }
}