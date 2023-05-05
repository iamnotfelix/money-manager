using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace moneyManager.Migrations
{
    /// <inheritdoc />
    public partial class AddedCurrencyToIncome : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Currency",
                table: "Incomes",
                type: "longtext",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Currency",
                table: "Incomes");
        }
    }
}
