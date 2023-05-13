using System.Text.RegularExpressions;
using moneyManager.Exceptions;
using moneyManager.Models;

namespace moneyManager.Services
{
    public static class Validations
    {
        public static void Validate(this Expense expense) 
        {
            List<String> paymentTypes = new List<string>() 
                { "bt", "cash", "revolut", "revo", "alpha", ""};
            List<String> currencies = new List<string>()
                { "lei", "ron", "euro", ""};
            DateTime startDate = new DateTime(2000, 1, 1);
            DateTime endDate = new DateTime(2100, 1, 1);

            if (expense is null)
            {
                throw new NotFoundException("Expense not found.");
            }
            if (expense.Amount < 0) 
            {
                throw new ValidationException("Amount not in range.");
            }
            if (expense.PaymentType is not null && !paymentTypes.Contains(expense.PaymentType.ToLower()))
            {
                throw new ValidationException("Payment type does not exist.");
            } 
            if (expense.Description is not null && expense.Description.Count() > 250) 
            {
                throw new ValidationException("Description is to long.");
            }
            if (expense.Currency is not null && !currencies.Contains(expense.Currency.ToLower())) 
            {
                throw new ValidationException("Currency does not exist.");
            }
            if (expense.Date != DateTime.MinValue && expense.Date < startDate || expense.Date > endDate) 
            {
                throw new ValidationException("Date not in range.");
            }
        }

        public static void Validate(this Category category) 
        {
            // var nameRegex = new Regex("^[a-zA-Z ]+$");
            var nameRegex = new Regex("^[a-zA-Z0-9,-. ]+$");

            if (category is null)
            {
                throw new NotFoundException("Category not found.");
            }
            if (category.Name is not null && (!nameRegex.IsMatch(category.Name) || category.Name!.Count() == 0))
            {
                throw new ValidationException("Name is not valid.");
            } 
            if (category.Description is not null && category.Description.Count() > 250) 
            {
                throw new ValidationException("Description is too long.");
            }
        }

        public static void Validate(this User user) 
        {
            // var emailRegex = new Regex(@"^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Za-z]{2,}$");
            // var emailRegex = new Regex(@"^.{1,50}@.{2,30}\\.{2,}$");
            var emailRegex = new Regex(@"^.*@.*$");
            var passwordRegex = new Regex(@"^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$");
            List<String> roles = new List<string>() 
                { "admin", "moderator", "regular", ""};

            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }
            if (user.Username is not null && user.Username.Count() == 0)
            {
                throw new ValidationException("Username is not valid.");
            } 
            if (user.Email is not null && (!emailRegex.IsMatch(user.Email) || user.Email.Count() == 0))
            {
                throw new ValidationException("Email is not valid.");
            } 
            if (user.Password is not null && user.Password!.Count() < 8)
            {
                throw new ValidationException("Password is not valid.");
            }
            if (user.Roles is not null) 
            {
                user.Roles.Split(',').ToList().ForEach(role => 
                {
                    if (!roles.Contains(role.ToLower()))
                    {
                        throw new ValidationException("Role is not valid.");
                    }
                });
            }
        }

        public static void Validate(this UserProfile userProfile)
        {
            var nameRegex = new Regex("^[a-zA-Z ]+$");
            var genders = new List<string> () { "male", "female", "" };
            DateTime startDate = new DateTime(2000, 1, 1);
            DateTime endDate = new DateTime(2100, 1, 1);

            if (userProfile.Name is not null && (!nameRegex.IsMatch(userProfile.Name) || userProfile.Name.Count() == 0))
            {
                throw new ValidationException("Name is not valid.");
            }
            if (userProfile.Status is not null && userProfile.Status.Count() > 250) 
            {
                throw new ValidationException("Status is too long.");
            }
            if (userProfile.Bio is not null && userProfile.Bio.Count() > 250) 
            {
                throw new ValidationException("Bio is too long.");
            }
            if (userProfile.Gender is not null && !genders.Contains(userProfile.Gender.ToLower()))
            {
                throw new ValidationException("Gender is not valid.");
            }
            if (userProfile.Birthday != DateTime.MinValue && userProfile.Birthday < startDate || userProfile.Birthday > endDate) 
            {
                throw new ValidationException("Date not in range.");
            }
        }

        public static void Validate(this Income income) 
        {
            List<String> currencies = new List<string>()
                { "lei", "ron", "euro", ""};

            if (income is null)
            {
                throw new NotFoundException("Income not found.");
            }
            if (income.Name is not null && income.Name.Count() == 0)
            {
                throw new ValidationException("Name is not valid.");
            }
            if (income.Amount < 0)
            {
                throw new ValidationException("Amount not in range.");
            }
            if (income.Currency is not null && !currencies.Contains(income.Currency.ToLower())) 
            {
                throw new ValidationException("Currency does not exist.");
            }
            if (income.Comments is not null && income.Comments.Count() > 250) 
            {
                throw new ValidationException("Comments are too long.");
            }
        }
    }
}