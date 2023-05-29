import { Publisher, OrderCancelledEvent, Subjects } from "@tiantianwuqing/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
