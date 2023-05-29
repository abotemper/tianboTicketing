import request from 'supertest';


import { app } from '../../app';

//先注册，再看登录
it('response with details about the current user', async () => {

   const cookie = await global.signin();
   
//之前一直用postman， 他会帮我们管理cookie， 但这里不会自动管理
//这里用get，因为是currentuser，是请求数据，而不是更新状态
   const response = await request(app)
      .get('/api/users/currentuser')
      .set('Cookie', cookie)
      .send()
      .expect(200);

    console.log(response.body);
    expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with null if not authenticated', async () => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});