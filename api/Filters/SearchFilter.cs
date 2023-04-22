namespace moneyManager.Filters
{
    public class SearchFilter
    {
        private string text;
        private int number;
        public string Text
        {
            get { return this.text; }
            set 
            { 
                if (value is null) { this.text = ""; }
                else { this.text = value.Count() > 50 ? value.Take(50).ToString()! : value; }
            }
        }
        public int Number
        {
            get { return this.number; }
            set 
            { 
                if (value < 1) { this.number = 1; } 
                else if (value > 20) { this.number = 20; }
                else { this.number = value; }
            }
        }

        public SearchFilter()
        {
            this.text = "";
            this.number = 20;
        }

        public SearchFilter(string text, int number)
        {
            this.text = text;
            this.number = number;
        }
    }
}