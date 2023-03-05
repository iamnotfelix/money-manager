using moneyManager.Models;

namespace moneyManager.Repositories
{
    public interface IExpensesRepository
    {
        Expense getExpense(Guid id);
        IEnumerable<Expense> getExpenses();
        void createExpense(Expense expense);
        void updateExpense(Expense expense);
        void deleteExpense(Guid id);
    }
}