import Link from 'next/link';

const LandingPage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
         <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            View
         </Link>  
        </td> 
      </tr>
    );
  });
  return (
    <div>
      <h1>Tickets</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {ticketList}

        </tbody>
      </table>
    </div>
  );
};

LandingPage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default LandingPage;


// import axios from "axios";
// import buildClient from "../api/build-client";

// const LandingPage = ({ currentUser }) => {
//   return currentUser ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>
// };
// //如果我们需要在服务端渲染过程中获取任何数据，我们必须在getinitialprops中进行
// //页面渲染前进行数据获取，这里就是想在渲染数据前确定是否通过身份验证，
// //从而决定路由到哪个页面，这是在服务端进行的
// LandingPage.getInitialProps = async (context, client, currentUser) => {
//   const client = buildClient(context);
//   const { data } = await client.get('/api/users/currentuser');
//   return data;

//   // console.log(req.headers);
//   // if(typeof window === 'undefined') {
//   //   //we are on the server!
//   //   //requests should be made to http://ingress-nginx-controller.asdasdasdasd
//   //   const { data } = await axios.get(
//   //     //ingress-nginx-controller 是命名空间里的
//   //     'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
//   //      {
//   //       headers: req.headers
//   //     }
//   //   );

//   //   return data;
//   // }else {
//   //   //we are on the broswer!
//   //   // requests can be made with a base url of ''
//   //   const { data } = await axios.get('/api/users/currentuser');
//   //   //{currentuser}
//   //   return data;
//   // }
//   // return {};
// };

// export default LandingPage;
// //我们需要确定用户在任何给定时间点是否已登录，然后再屏幕上显示您是否已登陆
// //我们使用得是服务端渲染
// //每当我们想服务器发出初始请求，我们都希望立即发回某种html，来表现用户是否已经登录
// //


// // const LandingPage = ({ currentUser }) => {
// //   console.log(currentUser);
// //   axios.get('/api/users/currentuser');
 
// //   return <h1>Landing Page</h1>;
// // };

// // const LandingPage = ({ currentUser }) => {
// //   console.log(currentUser);

 
// //   return <h1>Landing Page</h1>;
// // };