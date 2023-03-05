using moneyManager.Models;

namespace moneyManager.Repositories
{
    public interface IExpensesRepository
    {
        Expense getExpense(Guid id);
        IEnumerable<Expense> getExpenses();
        void createExpense(Expense expense);
    }
}