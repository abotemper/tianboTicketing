import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client'
import Header from '../component/header';

//Component 就是index， banana， pageprops就是打算传给他们的各种组件集
//如果我们想在项目中包含一些全局css，我们只能将全局css到入到这个应用程序文件中。
//也就是我们把 css应用在所有组件之中
//再比如其他全局模块 比如 header，navigate,在我们这里header还需要知道当前用户是谁
//是否已经登录，从而展示不同的header内容，而我们的数据是从服务端来的
//我们需要再渲染之前得知我们的数据，从而需要getInitialProps，从而我们应该将index中的getInitialProps
//拿到这个更高层的_app中来
const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser}/>
      <div className='container'>
        <Component currentUser={currentUser} {...pageProps} />
      </div>
      
    </div>
    
  )
};


AppComponent.getInitialProps = async (appContext) => {
 const client = buildClient(appContext.ctx);
 const { data } = await client.get('/api/users/currentuser');

 //下面的getInitiaoProps是针对某个page的
 let pageProps = {};
 if (appContext.Component.getInitialProps) {
  pageProps = await appContext.Component.getInitialProps(
    appContext.ctx, 
    client, 
    data.currentUser
  );
 }

 return {
  pageProps,
  ...data
 };
};

export default AppComponent;