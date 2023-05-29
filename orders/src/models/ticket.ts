import mongoose from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
  id: string
  title: string;
  price: number;
}

export interface TicketDoc extends mongoose.Document{
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc>{
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>;
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id
    }
  }
});

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1
  });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
  });
};

//function关键字是为了兼容旧版js, 有this
ticketSchema.methods.isReserved = async function() {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    ticket: this as any,
    status: {
      //"$" 是 MongoDB 的语法,表示这几个都符合
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete
      ],
    },
  });
  //为了返回一个布尔值， null 就返回false， 有值就翻转成false再反转成true
  return !!existingOrder;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket }