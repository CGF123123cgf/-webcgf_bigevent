$.ajaxPrefilter(function (options) {  
    // 每次发送ajax请求都会先执行这个函数 ，所以可以option （每个请求的配置对象的url 不完整的）
    //   加上根路径   
    // 统一管理 方便之后修改
    options.url='http://www.liulongbin.top:3007'+options.url
    console.log(options.url);
})