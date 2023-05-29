import { Message } from "node-nats-streaming";
import { Subjects, Listener, TicketUpdatedEvent, TicketCreatedEvent } from "@tiantianwuqing/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject =  Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  //接收方必须看到目前有的信息version比新来的信息的version少一
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;
    ticket.set({ title, price});
    await ticket.save();

    msg.ack();
      
  }
}