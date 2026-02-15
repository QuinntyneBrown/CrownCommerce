# cc team & cc schedule — Operations Tools

> **Rank**: #7 (team), #8 (schedule)
> **Effort**: Low (1 week each)
> **Dependencies**: Identity + Scheduling databases

## cc team — Team Member Management

### The Problem

Adding a team member requires creating records in two separate databases:

1. **Identity Service** (`AppUsers` table) — user account with email, password hash, role
2. **Scheduling Service** (`Employees` table) — employee profile with job title, department, timezone, presence

These must share the same `UserId` (GUID). Currently this is only done by the seeders using hardcoded GUIDs. There's no operational tool to onboard a new hire, deactivate a departing team member, or bulk-import staff.

### How It Works

The tool connects directly to both LocalDB databases (or remote via `--env`) and performs coordinated writes:

```csharp
public async Task AddTeamMember(TeamMemberRequest request)
{
    var userId = Guid.NewGuid();
    var passwordHash = BCrypt.HashPassword(request.TempPassword ?? "Welcome123!");

    // Step 1: Create AppUser in Identity DB
    using var identityDb = CreateDbContext<IdentityDbContext>("identity");
    identityDb.Users.Add(new AppUser
    {
        Id = userId,
        Email = request.Email,
        PasswordHash = passwordHash,
        FirstName = request.FirstName,
        LastName = request.LastName,
        Role = request.Role,
        IsActive = true,
        CreatedAt = DateTime.UtcNow
    });
    await identityDb.SaveChangesAsync();

    // Step 2: Create Employee in Scheduling DB
    using var schedulingDb = CreateDbContext<SchedulingDbContext>("scheduling");
    schedulingDb.Employees.Add(new Employee
    {
        Id = Guid.NewGuid(),
        UserId = userId,
        Email = request.Email,
        FirstName = request.FirstName,
        LastName = request.LastName,
        JobTitle = request.JobTitle,
        Department = request.Department,
        TimeZone = request.TimeZone ?? "America/Toronto",
        Status = EmployeeStatus.Active,
        Presence = PresenceStatus.Offline
    });
    await schedulingDb.SaveChangesAsync();
}
```

### Team Directory

```
$ cc team list

Crown Commerce Team Directory
══════════════════════════════

  Name              Email                         Role      Department       Timezone          Status
  ─────────────────────────────────────────────────────────────────────────────────────────────────────
  Quinn M.          quinn@crowncommerce.com       Admin     Engineering      America/Toronto   Active
  Amara K.          amara@crowncommerce.com       Admin     Engineering      Africa/Lagos      Active
  Wanjiku N.        wanjiku@crowncommerce.com     Customer  Hair Styling     Africa/Lagos      Active
  Sophia L.         sophia@crowncommerce.com      Customer  Marketing        America/Toronto   Active
  James R.          james@crowncommerce.com       Customer  Operations       Europe/London     Active

  5 team members (5 active, 0 inactive)
```

### Bulk Import

For onboarding multiple hires at once:

```bash
$ cc team import --file new-hires.csv

Importing 3 team members...
  [1/3] nina@crowncommerce.com    → Created (Admin, Engineering, Africa/Nairobi)
  [2/3] chen@crowncommerce.com    → Created (Customer, Hair Styling, Asia/Shanghai)
  [3/3] maria@crowncommerce.com   → Created (Customer, Marketing, America/Sao_Paulo)

3 team members imported. Temporary password: Welcome123!
Remind new members to change their password on first login.
```

CSV format:

```csv
email,firstName,lastName,role,jobTitle,department,timezone
nina@crowncommerce.com,Nina,Okafor,Admin,Backend Developer,Engineering,Africa/Nairobi
chen@crowncommerce.com,Chen,Wei,Customer,Senior Stylist,Hair Styling,Asia/Shanghai
maria@crowncommerce.com,Maria,Santos,Customer,Content Manager,Marketing,America/Sao_Paulo
```

---

## cc schedule — Meeting & Schedule Manager

### The Problem

The Teams app frontend is 50% built — meetings can be viewed but not created. For a distributed team, scheduling across timezones is a daily task that shouldn't require the full web app to be functional.

### Timezone-Aware Meeting Creation

```bash
$ cc schedule create-meeting \
    --title "Sprint Review" \
    --start "2026-02-17 14:00" \
    --duration 1h \
    --attendees quinn,amara,james \
    --location "Google Meet"

Meeting created: Sprint Review
  ─────────────────────────────────
  Toronto (Quinn)      2:00 PM - 3:00 PM EST
  Lagos (Amara)        8:00 PM - 9:00 PM WAT
  London (James)       7:00 PM - 8:00 PM GMT
  ─────────────────────────────────
  3 attendees notified via email
```

The tool reads each attendee's timezone from their Employee record and displays the meeting in every relevant timezone.

### Team Availability Grid

Finding a time that works across timezones:

```
$ cc schedule availability --date 2026-02-17

Team Availability — Monday, Feb 17
  Working hours shown in UTC

              06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22
  Quinn (EST) ░░  ░░  ░░  ░░  ██  ██  ██  ██  ██  ██  ██  ██  ██  ░░  ░░  ░░  ░░
  Amara (WAT) ░░  ░░  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ░░  ░░  ░░  ░░  ░░
  Wanjiku(WAT)░░  ░░  ██  ██  ██  ██  ██  ██  ██  ██  ██  ██  ░░  ░░  ░░  ░░  ░░
  Sophia(EST) ░░  ░░  ░░  ░░  ██  ██  ██  ██  ██  ██  ██  ██  ██  ░░  ░░  ░░  ░░
  James (GMT) ░░  ░░  ░░  ██  ██  ██  ██  ██  ██  ██  ██  ██  ░░  ░░  ░░  ░░  ░░

  ██ = available    ░░ = outside working hours

  Best overlap: 10:00 - 12:00 UTC (all 5 members available)
    = 5:00 AM - 7:00 AM EST | 11:00 AM - 1:00 PM WAT | 10:00 AM - 12:00 PM GMT
```

### Recurring Meetings

```bash
# Daily standup, weekdays only
$ cc schedule create-meeting \
    --title "Daily Standup" \
    --start "2026-02-17 14:00" \
    --duration 15m \
    --attendees all \
    --recurrence weekdays \
    --until "2026-06-30"

Created recurring meeting: Daily Standup
  94 occurrences (weekdays, Feb 17 - Jun 30)
  Next: Monday Feb 17, 2:00 PM EST
```

### Channel Management

```bash
# List channels
$ cc schedule channels

  Channel                 Type       Members   Last Activity
  ──────────────────────────────────────────────────────────────
  #general                Public     5         Feb 15, 08:00 AM
  #product-launches       Public     5         Feb 14, 03:22 PM
  #engineering            Public     3         Feb 15, 07:45 AM
  #hair-styling-tips      Public     2         Feb 13, 11:00 AM
  #random                 Public     5         Feb 14, 06:30 PM
  #marketing              Public     3         Feb 12, 02:15 PM
  #client-support         Public     4         Feb 14, 10:00 AM
  Quinn ↔ Amara           DM         2         Feb 15, 08:10 AM

# Create a new channel
$ cc schedule create-channel --name "launch-planning" --type public
Channel #launch-planning created (public, 0 members)
```
