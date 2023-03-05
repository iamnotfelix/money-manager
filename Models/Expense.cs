using System;

namespace moneyManager.Models
{
    public class Expense 
    {
        public Guid Id { get; init; }
        public int Amount { get; set; }
        public string? Category { get; set; }
        public string? PaymentType { get; set; }
        public string?  Description { get; set; }
        public DateTime Time { get; set; }

    }
}