import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Order } from "../../../models/order";
import mongoose from "mongoose";
import { OrderStatus, OrderCancelledEvent } from "@tiantianwuqing/common";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'asdasd',
    version: 0
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'asdasd',
    }
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn()
  };

  return { msg, data, listener, order };
};

it('updates the status of the order', async () => {
  const { msg, data, listener, order } = await setup();

  await listener.onMessage(data, msg);

  const updateOrder = await Order.findById(order.id);

  expect(updateOrder?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the message', async () => {
  const { msg, data, listener, order } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});