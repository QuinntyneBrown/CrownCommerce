using CrownCommerce.Order.Core.Enums;
using CrownCommerce.Order.Core.Interfaces;
using CrownCommerce.Shared.Contracts;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace CrownCommerce.Order.Application.Consumers;

public sealed class PaymentCompletedConsumer(
    IOrderRepository orderRepository,
    ILogger<PaymentCompletedConsumer> logger) : IConsumer<PaymentCompletedEvent>
{
    public async Task Consume(ConsumeContext<PaymentCompletedEvent> context)
    {
        var evt = context.Message;
        logger.LogInformation("Payment completed for Order {OrderId}", evt.OrderId);

        var order = await orderRepository.GetByIdAsync(evt.OrderId);
        if (order is null) return;

        order.Status = OrderStatus.Confirmed;
        order.UpdatedAt = DateTime.UtcNow;
        await orderRepository.UpdateAsync(order);
    }
}
