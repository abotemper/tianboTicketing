import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app'

//定义一个全局变量，signin，方便在其他地方使用
//不然要单写一个，所有需要它的地方还要再引入
declare global {
  var signin: () => Promise<string[]>;
}

let mongo: any;
//测试所有开始之前
beforeAll(async() => {
  process.env.JWT_KEY = 'asdfasdf';

// mongo = new MongoMemoryServer();
// const mongoUri = await mongo.getUri();
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

// await mongoose.connect(mongoUri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
  await mongoose.connect(mongoUri, {});
});


//在每个测试之前
beforeEach(async () => {
  //得到所有的collections
  const collections = await mongoose.connection.db.collections();

  //删除所有collections
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

// 所有测试之后
afterAll(async () => {
  if (mongo) { await mongo.stop(); }
  await mongoose.connection.close();
  
   
});

global.signin = async () => {
  const email = 'test@test.com';
  const password = 'password';

  //写测试时总是写一样的请求，邮件和密码，还不如统一写在一块减少重复代码
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email, password
    })
    .expect(201);

  const cookie = response.get('Set-Cookie');

  return cookie;
}

// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }







