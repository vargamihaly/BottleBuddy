using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BottleBuddy.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixTotalRatingsNotNull : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // First, update any existing NULL values to 0
            migrationBuilder.Sql("UPDATE \"Profiles\" SET \"TotalRatings\" = 0 WHERE \"TotalRatings\" IS NULL");

            // Then alter the column to be NOT NULL with default value 0
            migrationBuilder.AlterColumn<int>(
                name: "TotalRatings",
                table: "Profiles",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "TotalRatings",
                table: "Profiles",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: false,
                oldDefaultValue: 0);
        }
    }
}
