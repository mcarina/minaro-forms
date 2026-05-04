using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MinaroForms.Domain.Users;

namespace MinaroForms.Infrastructure.Persistence.Configurations;

internal sealed class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("users");
        builder.HasKey(user => user.Id);

        builder.Property(user => user.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(user => user.Name).IsRequired();
        builder.Property(user => user.Email).IsRequired();
        builder.Property(user => user.PasswordHash).IsRequired();
        builder.Property(user => user.Role).HasDefaultValue("user").IsRequired();
        builder.Property(user => user.CreatedAt).HasDefaultValueSql("now()").IsRequired();
        builder.Property(user => user.UpdatedAt).HasDefaultValueSql("now()").IsRequired();

        builder.HasIndex(user => user.Email).IsUnique();
    }
}
