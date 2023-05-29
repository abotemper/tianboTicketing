import request from 'supertest';//可以允许我们伪造一个express app的请求
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
          email: 'test@test.com',
          password: 'password'
        })
        .expect(201);
},150000);

it('returns a 400 with an invalid email', async () => {
  return request(app)
      .post('/api/users/signup')
      .send({
        email: 'tesasdasd',
        password: 'password'
      })
      .expect(400);
},150000);

it('returns a 400 with an invalid password', async () => {
  return request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'd'
      })
      .expect(400);
},150000);

it('returns a 400 with missing email and password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({})
    .expect(400);
  
  await request(app)
      .post('/api/users/signup')
      .send({
        email:'test@test.com'
      })
      .expect(400);
  
  
  await request(app)
      .post('/api/users/signup')
      .send({
        password: 'password'
      })
      .expect(400);
},150000);

it('disallows duplicate emails', async () => {
  await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(201);

  await request(app)
      .post('/api/users/signup')
      .send({
        email: 'test@test.com',
        password: 'password'
      })
      .expect(400);
},150000);

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password'
    })
    .expect(201);

//这块必须要注意我们在app.ts 中设置的cookieSession的值。
//那里们只允许https的访问，所以不处理的话这里会报错
//在测试环境中可以将secure选项改为false
  expect(response.get('Set-Cookie')).toBeDefined();
  
});