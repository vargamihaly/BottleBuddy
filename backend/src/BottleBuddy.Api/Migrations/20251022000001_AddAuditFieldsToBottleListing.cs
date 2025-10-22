using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BottleBuddy.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditFieldsToBottleListing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "BottleListings",
                type: "timestamp with time zone",
                nullable: false,
                defaultValueSql: "NOW()");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "BottleListings",
                type: "timestamp with time zone",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "BottleListings");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "BottleListings");
        }
    }
}
