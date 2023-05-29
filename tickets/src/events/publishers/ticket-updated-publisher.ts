import { Publisher, Subjects, TicketUpdatedEvent } from '@tiantianwuqing/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
