import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}
export abstract class Publisher<T extends Event> {
   abstract subject: T['subject'];
   private client: Stan;

   constructor(client: Stan) {
    this.client = client
   }

   //resolve 后的也应该是一个promise 所以这里的返回type应该注意一下，
   publish(data: T['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err);
        }
        console.log('Event published to subject', this.subject);
        resolve();
      });
    });

   }
}