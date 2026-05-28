using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Forms;
using MinaroForms.Domain.Users;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class FormConfiguration : IEntityTypeConfiguration<Form>
{
    public void Configure(EntityTypeBuilder<Form> builder)
    {
        builder.ToTable("forms");
        builder.HasKey(form => form.Id);

        builder.Property(form => form.OwnerUserId).IsRequired();
        builder.Property(form => form.Title).HasMaxLength(200).IsRequired();
        builder.Property(form => form.Description).HasMaxLength(2000);

        builder.Property(x => x.ShareUrl)
            .HasColumnName("share_url")
            .HasColumnType("text")
            .IsRequired(false);
            
        builder.Property(form => form.IsPublished).IsRequired();
        builder.Property(form => form.CreatedAt).IsRequired();
        builder.Property(form => form.UpdatedAt).IsRequired();

        builder.HasMany(form => form.Questions)
            .WithOne()
            .HasForeignKey(question => question.FormId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(form => form.Submissions)
            .WithOne()
            .HasForeignKey(submission => submission.FormId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne<User>()
            .WithMany()
            .HasForeignKey(form => form.OwnerUserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Navigation(form => form.Questions).UsePropertyAccessMode(PropertyAccessMode.Field);
        builder.Navigation(form => form.Submissions).UsePropertyAccessMode(PropertyAccessMode.Field);
    }
}
