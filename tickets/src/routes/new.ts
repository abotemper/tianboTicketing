import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validateRequest } from '@tiantianwuqing/common';
import { Ticket } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/tickets', 
  requireAuth,
  [
   //not()+isEmpty()这两个一起就是不空
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0}).withMessage('Must greater than 0')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
   const { title, price } =req.body;

   const ticket = Ticket.build({
    title,
    price,
    userId: req.currentUser!.id
   });
   await ticket.save();
   await new TicketCreatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version,
   });

   res.status(201).send(ticket);
});

export { router as createTicketRouter };