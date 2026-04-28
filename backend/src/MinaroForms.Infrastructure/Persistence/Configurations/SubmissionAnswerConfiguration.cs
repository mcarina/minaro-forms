using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class SubmissionAnswerConfiguration : IEntityTypeConfiguration<SubmissionAnswer>
{
    public void Configure(EntityTypeBuilder<SubmissionAnswer> builder)
    {
        builder.ToTable("submission_answers");
        builder.HasKey(answer => answer.Id);

        builder.Property(answer => answer.AnswerText);
        builder.Property(answer => answer.AnswerJson).HasColumnType("jsonb");

        builder.HasOne<Question>()
            .WithMany()
            .HasForeignKey(answer => answer.QuestionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
