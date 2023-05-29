import { NotAuthorizedError, NotFoundError, requireAuth } from '@tiantianwuqing/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/order';


const router = express.Router();

router.get(
  '/api/orders/:orderId', 
  requireAuth, 
  async (req: Request, res: Response) => {
  //找到这个订单后，还要同时获取关联的ticket，这就是与订单相关的ticket
  const order = await Order.findById(req.params.orderId).populate('ticket');
  
  if (!order) {
    throw new NotFoundError();
  }
  if (order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  res.send(order);
});

export { router as showOrderRouter };