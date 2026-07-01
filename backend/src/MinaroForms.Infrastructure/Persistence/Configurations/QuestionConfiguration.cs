using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class QuestionConfiguration : IEntityTypeConfiguration<Question>
{
    public void Configure(EntityTypeBuilder<Question> builder)
    {
        builder.ToTable("questions");
        builder.HasKey(question => question.Id);
        builder.Property(question => question.Id)
            .ValueGeneratedNever();

        builder.Property(question => question.Type)
            .HasConversion<string>()
            .HasMaxLength(50)
            .IsRequired();

        builder.Property(question => question.Title).HasMaxLength(300).IsRequired();
        builder.Property(question => question.Description).HasMaxLength(2000);
        builder.Property(question => question.IsRequired).IsRequired();
        builder.Property(question => question.Position).IsRequired();
        builder.Property(question => question.SettingsJson).HasColumnType("jsonb");

        builder.HasMany(question => question.Options)
            .WithOne()
            .HasForeignKey(option => option.QuestionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(question => question.Options).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
