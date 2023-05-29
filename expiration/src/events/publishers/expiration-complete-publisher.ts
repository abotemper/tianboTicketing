import { Subjects, Publisher, ExpirationCompleteEvent } from "@tiantianwuqing/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
};