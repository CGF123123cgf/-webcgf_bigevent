$.ajaxPrefilter(function (options) {
    // 每次发送ajax请求都会先执行这个函数 ，所以可以option （每个请求的配置对象的url 不完整的）
    //   加上根路径   
    // 统一管理 方便之后修改
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
    //   设置统一的 请求头
    //  设置请求头信息 配置对象  如果包含 my 索引是不等于负一的做一个判断
    if (options.url.indexOf(/my/) !== -1) {
        options.headers = {
            // 之前登录的时候存到啦 本地
            Authorization: localStorage.getItem('token') || ''
        }
    }
    // 全局统一挂载 complete 回调函数 
    // 有这些东西才做操作 没有不做

    options.complete = function (res) {
        // 判断用户响应的东西 
        // console.log(res);
        // console.log('执行啦complete回调');
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空token
            localStorage.removeItem('token')
            // 2.跳转到登录页面
            location.href='/login.html'
        }
    }
    // console.log(options.url);
})