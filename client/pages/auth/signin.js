import { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";

//next.js 可以让我们 直接
//想创建一个路由那么就直接建立一个文件夹，这个文件夹就会自动变成一个
//对应的路由
export default  () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { doRequest, errors } = useRequest({
    url: '/api/users/signin',
    method: 'post',
    body: {
      email, 
      password
    },
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event) => {
    //此处调用prevent default 以确保表单不会尝试通过浏览器提交自身
     event.preventDefault();
    
     await doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
          className="form-control" 
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        {/* 加了这个type会使得输入时输入不可见***** */}
        <input 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          type="password" 
          className="form-control" 
        />
      </div>

      {errors}
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};