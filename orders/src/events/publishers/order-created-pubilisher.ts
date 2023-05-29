import { Publisher, OrderCreatedEvent, Subjects } from "@tiantianwuqing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated 
}