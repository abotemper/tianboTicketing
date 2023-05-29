// module.exports = {
//   webpackDevMiddleware: config => {
//     // 告诉webpack不要试图以某种自动方式监视文件更改，而是
//     // 每隔300毫秒自动将所有不同的文件拉倒我们的项目目录中
//     //传统上，在docker容器中运行时，此处的更改将通过文件更改检测解决此问题
//     config.watchOptions.poll = 300;
//     return config;
//   }
// };

module.exports = {
  webpack: (config) => {
    config.watchOptions.poll = 300;
    return config;
  },
};