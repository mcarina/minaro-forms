using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class QuestionOptionConfiguration : IEntityTypeConfiguration<QuestionOption>
{
    public void Configure(EntityTypeBuilder<QuestionOption> builder)
    {
        builder.ToTable("question_options");
        builder.HasKey(option => option.Id);
        builder.Property(option => option.Id)
            .ValueGeneratedNever();

        builder.Property(option => option.Label).HasMaxLength(300).IsRequired();
        builder.Property(option => option.Value).HasMaxLength(300).IsRequired();
        builder.Property(option => option.Position).IsRequired();
    }
}
