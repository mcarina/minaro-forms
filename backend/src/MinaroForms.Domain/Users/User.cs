namespace MinaroForms.Domain.Users;

public sealed class User
{
    private User()
    {
    }

    public User(string name, string email, string passwordHash, string role = "user")
    {
        Id = Guid.NewGuid();
        Name = RequireText(name, nameof(name));
        Email = RequireText(email, nameof(email)).ToLowerInvariant();
        PasswordHash = RequireText(passwordHash, nameof(passwordHash));
        Role = RequireText(role, nameof(role));
        CreatedAt = DateTimeOffset.UtcNow;
        UpdatedAt = CreatedAt;
    }

    public Guid Id { get; private set; }
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public string PasswordHash { get; private set; } = string.Empty;
    public string Role { get; private set; } = "user";
    public DateTimeOffset CreatedAt { get; private set; }
    public DateTimeOffset UpdatedAt { get; private set; }

    public void Rename(string name)
    {
        Name = RequireText(name, nameof(name));
        Touch();
    }

    public void ChangeEmail(string email)
    {
        Email = RequireText(email, nameof(email)).ToLowerInvariant();
        Touch();
    }

    public void ChangePasswordHash(string passwordHash)
    {
        PasswordHash = RequireText(passwordHash, nameof(passwordHash));
        Touch();
    }

    public void ChangeRole(string role)
    {
        Role = RequireText(role, nameof(role));
        Touch();
    }

    private void Touch() => UpdatedAt = DateTimeOffset.UtcNow;

    private static string RequireText(string value, string paramName)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new ArgumentException("Value cannot be empty.", paramName);
        }

        return value.Trim();
    }
}
