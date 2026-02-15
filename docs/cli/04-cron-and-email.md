# cc cron & cc email — Job Scheduling and Email Tools

> **Rank**: #5 (cron), #6 (email)
> **Effort**: Medium (2 weeks each)
> **Dependencies**: NCrontab, SmtpClient / SendGrid SDK

## cc cron — Local Job Scheduler

### The Problem

Crown Commerce needs recurring background work but has no job infrastructure:

- **Expired carts** sit in the Order database forever (no cleanup)
- **CRM follow-ups** that are overdue never trigger reminder emails
- **Meeting reminders** don't send until the Teams app implements it
- **Newsletter campaigns** can't be scheduled for future delivery
- **Notification logs** grow unbounded (no archival)

In production, these would run as Azure Functions or Hangfire jobs. But developers need to build and test the job logic locally first.

### Job Architecture

Each job implements a simple interface:

```csharp
public interface ICronJob
{
    string Name { get; }
    string Schedule { get; }  // cron expression
    string TargetService { get; }
    string Description { get; }
    Task ExecuteAsync(IServiceProvider services, CancellationToken ct);
}
```

Example job implementation:

```csharp
public class ClearExpiredCartsJob : ICronJob
{
    public string Name => "clear-expired-carts";
    public string Schedule => "*/30 * * * *";  // every 30 minutes
    public string TargetService => "order";
    public string Description => "Remove cart items older than 24 hours";

    public async Task ExecuteAsync(IServiceProvider services, CancellationToken ct)
    {
        var db = services.GetRequiredService<OrderDbContext>();
        var cutoff = DateTime.UtcNow.AddHours(-24);

        var expired = await db.CartItems
            .Where(c => c.CreatedAt < cutoff)
            .ToListAsync(ct);

        if (expired.Count == 0) return;

        db.CartItems.RemoveRange(expired);
        await db.SaveChangesAsync(ct);

        Console.WriteLine($"Removed {expired.Count} expired cart items");
    }
}
```

### Full Job Catalog

```
$ cc cron list

Crown Commerce Scheduled Jobs
══════════════════════════════

  Job                         Schedule         Service       Description
  ──────────────────────────────────────────────────────────────────────────
  clear-expired-carts         */30 * * * *     order         Remove cart items older than 24h
  send-follow-up-reminders    0 9 * * *        crm           Email contacts with overdue follow-ups
  send-meeting-reminders      */15 * * * *     scheduling    Notify attendees 15 min before meetings
  daily-subscriber-digest     0 8 * * *        newsletter    Send daily digest to active subscribers
  weekly-campaign-report      0 9 * * MON      newsletter    Generate campaign performance metrics
  sync-employee-presence      */5 * * * *      scheduling    Update presence based on last activity
  cleanup-notification-logs   0 2 * * *        notification  Archive notification logs older than 90 days
  refresh-crm-metrics         0 * * * *        crm           Recalculate lead scores and pipeline stats
  generate-revenue-report     0 6 * * *        order         Daily revenue and order volume summary
  check-payment-status        */10 * * * *     payment       Poll pending payments for status updates
  expire-unconfirmed-subs     0 3 * * *        newsletter    Remove subscribers unconfirmed after 7 days
  backup-databases            0 1 * * *        all           Trigger Azure SQL backup verification
```

### Running Jobs

```bash
# Run a specific job now (useful for testing)
$ cc cron run clear-expired-carts
[2026-02-15 08:15:32] clear-expired-carts started
[2026-02-15 08:15:33] Removed 3 expired cart items
[2026-02-15 08:15:33] clear-expired-carts completed (1.2s)

# Start the daemon (runs all jobs on their schedules)
$ cc cron start
Crown Commerce Cron Daemon started
  12 jobs registered
  Next run: sync-employee-presence at 08:20:00

# Check execution history
$ cc cron history
  Job                       Last Run            Duration   Status
  ──────────────────────────────────────────────────────────────────
  clear-expired-carts       Feb 15, 08:00       1.2s       OK
  send-follow-up-reminders  Feb 15, 09:00       4.8s       OK (sent 2 emails)
  sync-employee-presence    Feb 15, 08:15       0.3s       OK
  check-payment-status      Feb 15, 08:10       0.5s       OK (0 pending)
```

---

## cc email — Email Campaign & Transactional Mailer

### The Problem

The platform has two email systems (SendGrid in Notification, SMTP in Newsletter) but no way to:

- Preview what an email looks like before sending
- Test email flows without deploying to production
- Send a one-off campaign without writing code
- Debug delivery issues (did the email send? what did it contain?)

### Local Email Testing

The star feature: a built-in SMTP trap that catches all emails during development.

```bash
$ cc email server
Local email server started
  SMTP: localhost:1025 (catches all outgoing mail)
  Web UI: http://localhost:8025 (view captured emails)

  Tip: Set Email:Smtp:Host=localhost and Email:Smtp:Port=1025 in appsettings
```

This works by bundling a lightweight SMTP server. All emails sent by the Notification and Newsletter services are caught and displayed in a web UI — no emails actually leave the machine.

### Template Preview

Open any email template in the browser with sample data:

```bash
$ cc email preview order-confirmation
Opening http://localhost:8025/preview/order-confirmation in browser...

$ cc email templates
  Template                      Service         Variables
  ──────────────────────────────────────────────────────────────
  order-confirmation            notification    orderId, customerName, items[], total
  payment-receipt               notification    paymentId, amount, last4
  order-status-update           notification    orderId, status, trackingNumber
  refund-notification           notification    refundId, amount, reason
  inquiry-confirmation          notification    inquiryId, customerName
  chat-started-admin            notification    conversationId, customerName
  newsletter-welcome            notification    subscriberName, unsubscribeToken
  campaign-completed            notification    campaignName, sentCount, openRate
```

### Sending Campaigns

```bash
# Send to all subscribers tagged 'origin-coming-soon'
$ cc email campaign \
    --subject "Spring Collection is Here" \
    --template spring-launch \
    --tag origin-coming-soon \
    --schedule "2026-03-01 09:00"

Campaign created:
  Subject: Spring Collection is Here
  Recipients: 847 subscribers (tag: origin-coming-soon)
  Scheduled: March 1, 2026 at 9:00 AM EST
  Preview: http://localhost:8025/preview/campaign/abc123

# Send immediately to a test address first
$ cc email campaign \
    --subject "Spring Collection is Here" \
    --template spring-launch \
    --test-to quinn@crowncommerce.com

Test email sent to quinn@crowncommerce.com
```

### Delivery Audit

```bash
$ cc email history --last 20

  Timestamp            To                         Subject                    Status
  ────────────────────────────────────────────────────────────────────────────────────
  Feb 15, 08:00:15     wanjiku@gmail.com          Order Confirmation #1042   Delivered
  Feb 15, 07:45:30     quinn@crowncommerce.com    New Inquiry Received       Delivered
  Feb 14, 22:10:00     sophia@outlook.com         Payment Receipt            Bounced
  Feb 14, 21:00:00     [847 recipients]           Weekly Newsletter          94% delivered
```
