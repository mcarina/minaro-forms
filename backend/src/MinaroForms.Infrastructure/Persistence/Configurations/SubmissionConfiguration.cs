using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Forms;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.ToTable("submissions");
        builder.HasKey(submission => submission.Id);

        builder.Property(submission => submission.SubmittedAt).IsRequired();
        builder.Property(submission => submission.RespondentEmail).HasMaxLength(320);

        builder.HasMany(submission => submission.Answers)
            .WithOne()
            .HasForeignKey(answer => answer.SubmissionId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Navigation(submission => submission.Answers).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
