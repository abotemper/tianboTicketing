import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../app'
import jwt from 'jsonwebtoken';

//定义一个全局变量，signin，方便在其他地方使用
//不然要单写一个，所有需要它的地方还要再引入
declare global {
  var signin: () => string[];
}

jest.mock('../nats-wrapper.ts');

let mongo: any;
//测试所有开始之前
beforeAll(async () => {
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
  jest.clearAllMocks();
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

global.signin = () => {

  // build a JWT payload . {id ,email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'tttt@tttt.com'
  };
  //create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  //build session object {JWT: MY_JWT}
  const session = { jwt: token };

  //turn that session into json
  const sessionJSON = JSON.stringify(session);

  //take json and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  //return a string thats the cookie with the encoded data
  return [`session=${base64}`];
}



// declare global {
//   namespace NodeJS {
//     export interface Global {
//       signin(): Promise<string[]>;
//     }
//   }
// }







