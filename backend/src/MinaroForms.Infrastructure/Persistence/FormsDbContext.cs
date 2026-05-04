using Microsoft.EntityFrameworkCore;
using MinaroForms.Domain.Forms;
using MinaroForms.Domain.Users;

namespace MinaroForms.Infrastructure.Persistence;

public sealed class FormsDbContext(DbContextOptions<FormsDbContext> options) : DbContext(options)
{
    public DbSet<Form> Forms => Set<Form>();
    public DbSet<Question> Questions => Set<Question>();
    public DbSet<QuestionOption> QuestionOptions => Set<QuestionOption>();
    public DbSet<Submission> Submissions => Set<Submission>();
    public DbSet<SubmissionAnswer> SubmissionAnswers => Set<SubmissionAnswer>();
    public DbSet<User> Users => Set<User>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FormsDbContext).Assembly);
    }
}
