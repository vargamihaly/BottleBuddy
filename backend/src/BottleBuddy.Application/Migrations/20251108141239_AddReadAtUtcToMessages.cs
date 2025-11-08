using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BottleBuddy.Application.Migrations
{
    /// <inheritdoc />
    public partial class AddReadAtUtcToMessages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ReadAtUtc",
                table: "Messages",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReadAtUtc",
                table: "Messages");
        }
    }
}
