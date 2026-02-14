using CrownCommerce.Scheduling.Core.Entities;

namespace CrownCommerce.Scheduling.Core.Interfaces;

public interface IConversationRepository
{
    Task<ScheduleConversation?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<ScheduleConversation>> GetByEmployeeAsync(Guid employeeId, CancellationToken ct = default);
    Task<IReadOnlyList<ScheduleConversation>> GetByMeetingAsync(Guid meetingId, CancellationToken ct = default);
    Task<IReadOnlyList<ScheduleConversation>> GetRecentAsync(int count = 20, CancellationToken ct = default);
    Task AddAsync(ScheduleConversation conversation, CancellationToken ct = default);
    Task UpdateAsync(ScheduleConversation conversation, CancellationToken ct = default);
    Task AddMessageAsync(ConversationMessage message, CancellationToken ct = default);
}
