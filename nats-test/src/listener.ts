import nats from 'node-nats-streaming';
import { randomBytes } from 'crypto';

import { TicketCreatedListener } from './events/ticket-created-listener';


console.clear();
//第二个参数是该listner的 id， nats不允许一个id重复监听，
//比如说你不能勇同一个id， 开两个terminal 去监听
//这里用randomBytes 可以使得每个terminal产生一个独一无二的id

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222'
});

stan.on('connect', () => {
  console.log('Listener connected to NATS');

  stan.on('close', () => {
     console.log('NATS connection closed!');
     process.exit();
  });

  // const options = stan.
  //   subscriptionOptions().
  //   //手动确认，不会自动确认告知收到信息，自动的话，如果服务器或者
  //   //数据库出现问题，那么会丢失消息
  //   setManualAckMode(true)

  //   //获取过去所有事件
  //   .setDeliverAllAvailable()
  //   //这个持计划名字会标注哪些是否处理过
  //   //确保跟踪已转到次订阅的所有不同事件
  //   .setDurableName('accounting-service');

  //第一个参数是channel，第二个参数是queue Group
  // const subscription = stan.subscribe(
  //   'ticket:created', 
  //   //设置这个参数可以在重启时候，不用获取所有先前的事件
  //   //因为所有的事件都已经被发射到了上述持久提示组中
  //   'queue-group-name',
  //   options
  //   );

  // subscription.on('message', (msg: Message) => {
  //   const data = msg.getData();
  //   if (typeof data === 'string') {
  //     console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
  //   }

    
    //因为设置了手动确认，所以有下面代码才会确认收到消息
  //   msg.ack();
    
  // });

   new TicketCreatedListener(stan).listen();

});

//监视终端信号，当我们终止或停止进程，比如ctr+C 
//我们要在进程中断前先关闭客户端的连接
process.on('SIGINT', () => stan.close());
process.on('SIGTERN', () => stan.close());



