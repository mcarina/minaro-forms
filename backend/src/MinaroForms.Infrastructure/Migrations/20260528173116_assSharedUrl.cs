using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MinaroForms.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class assSharedUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "share_url",
                table: "forms",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "share_url",
                table: "forms");
        }
    }
}
