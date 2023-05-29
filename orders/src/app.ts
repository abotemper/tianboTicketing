import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@tiantianwuqing/common';
import { deleteOrderRouter } from './routes/delete';
import { showOrderRouter } from './routes/show';
import { newOrderRouter } from './routes/new';
import { indexOrderRouter } from './routes/index';

const app = express();
//express看到https代理会有些担心，所以这里添加一个手动设置
//以确保express知道它位于ingress engine x的代理之后，并确保它仍然相信流量是安全的
//即使流量来自于该代理
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    //cookie不需要加密，因为jwt加密性已经很好了
    signed: false,

    //这里如果设置成true的意思是只允许https访问，更加安全
    //但最好用环境变量，这样不会影响测试
    // secure: process.env.NODE_ENV !== 'test'
    secure: false,
  })
);

app.use(currentUser);

app.use(deleteOrderRouter);

app.use(indexOrderRouter);

app.use(newOrderRouter);

app.use(showOrderRouter);

app.all('*', async(req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app }