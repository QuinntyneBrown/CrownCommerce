using CrownCommerce.Cli.Cron.Commands;
using CrownCommerce.Cli.Cron.Services;
using Microsoft.Extensions.Logging;
using NSubstitute;
using Xunit;

namespace CrownCommerce.Cli.Cron.Tests;

public class CronServiceTests
{
    private readonly ICronJobStore _store;
    private readonly ICronJobRunner _runner;
    private readonly ILogger<CronService> _logger;
    private readonly CronService _sut;

    public CronServiceTests()
    {
        _store = Substitute.For<ICronJobStore>();
        _runner = Substitute.For<ICronJobRunner>();
        _logger = Substitute.For<ILogger<CronService>>();
        _sut = new CronService(_store, _runner, _logger);
    }

    [Fact]
    public async Task ListJobsAsync_DelegatesToStore()
    {
        var expected = new List<CronJobDefinition>
        {
            new("job-a", "*/5 * * * *", "svc", "desc"),
        };
        _store.LoadJobsAsync().Returns(expected);

        var result = await _sut.ListJobsAsync();

        Assert.Same(expected, result);
        await _store.Received(1).LoadJobsAsync();
    }

    [Fact]
    public async Task RunJobAsync_WithValidJob_RunsAndRecordsSuccessHistory()
    {
        var job = new CronJobDefinition("my-job", "*/5 * * * *", "order", "test");
        _store.LoadJobsAsync().Returns(new List<CronJobDefinition> { job });
        _runner.RunJobAsync(job).Returns((true, (string?)null));

        var result = await _sut.RunJobAsync("my-job");

        Assert.True(result);
        await _runner.Received(1).RunJobAsync(job);
        await _store.Received(1).AppendHistoryAsync(Arg.Is<CronJobHistory>(h =>
            h.JobName == "my-job" && h.Status == "Success" && h.Error == null));
    }

    [Fact]
    public async Task RunJobAsync_WithValidJobThatFails_RecordsFailureHistory()
    {
        var job = new CronJobDefinition("my-job", "*/5 * * * *", "order", "test");
        _store.LoadJobsAsync().Returns(new List<CronJobDefinition> { job });
        _runner.RunJobAsync(job).Returns((false, "Connection refused"));

        var result = await _sut.RunJobAsync("my-job");

        Assert.False(result);
        await _runner.Received(1).RunJobAsync(job);
        await _store.Received(1).AppendHistoryAsync(Arg.Is<CronJobHistory>(h =>
            h.JobName == "my-job" && h.Status == "Failed" && h.Error == "Connection refused"));
    }

    [Fact]
    public async Task RunJobAsync_WithUnknownJob_ReturnsFalse()
    {
        _store.LoadJobsAsync().Returns(new List<CronJobDefinition>());

        var result = await _sut.RunJobAsync("nonexistent");

        Assert.False(result);
        await _runner.DidNotReceive().RunJobAsync(Arg.Any<CronJobDefinition>());
        await _store.DidNotReceive().AppendHistoryAsync(Arg.Any<CronJobHistory>());
    }

    [Fact]
    public async Task GetHistoryAsync_DelegatesToStoreWithFilter()
    {
        var expected = new List<CronJobHistory>
        {
            new("job-a", DateTime.UtcNow, "Success"),
        };
        _store.LoadHistoryAsync("job-a").Returns(expected);

        var result = await _sut.GetHistoryAsync("job-a");

        Assert.Same(expected, result);
        await _store.Received(1).LoadHistoryAsync("job-a");
    }

    [Fact]
    public async Task GetHistoryAsync_WithNull_DelegatesToStoreWithNull()
    {
        var expected = new List<CronJobHistory>();
        _store.LoadHistoryAsync(null).Returns(expected);

        var result = await _sut.GetHistoryAsync(null);

        Assert.Same(expected, result);
        await _store.Received(1).LoadHistoryAsync(null);
    }

    [Fact]
    public async Task StartDaemonAsync_LoadsJobsFromStore()
    {
        var jobs = new List<CronJobDefinition>
        {
            new("job-a", "*/5 * * * *", "svc", "desc"),
            new("job-b", "0 9 * * *", "svc2", "desc2"),
        };
        _store.LoadJobsAsync().Returns(jobs);

        await _sut.StartDaemonAsync(null);

        await _store.Received(1).LoadJobsAsync();
    }

    [Fact]
    public async Task StartDaemonAsync_WithFilter_LoadsJobsFromStore()
    {
        var jobs = new List<CronJobDefinition>
        {
            new("job-a", "*/5 * * * *", "svc", "desc"),
            new("job-b", "0 9 * * *", "svc2", "desc2"),
        };
        _store.LoadJobsAsync().Returns(jobs);

        await _sut.StartDaemonAsync("job-a");

        await _store.Received(1).LoadJobsAsync();
    }
}
