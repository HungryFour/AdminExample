module.exports = {
  publicPath: './',
  devServer : {
    hot:true,//自动保存
    open : true,//自动启动
    port : 8282,//默认端口号
    host : "0.0.0.0"
  },
  configureWebpack: {
    //警告 webpack 的性能提示
    performance: {
      hints:false,
    }
  }

};
