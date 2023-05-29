import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketCreatedEvent } from "@tiantianwuqing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

// nats streaming 包含很多channel， 比如 ticket：created channel
// channel 里 还有不同功能的 groups， 比如 order-service group，管理order
// 的都在这个 group里
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, title, price } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save()

    msg.ack();
  }
}