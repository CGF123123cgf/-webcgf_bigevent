$(function () {
    // 调用网络请求函数 
    getUserInfo()
    let layer = layui.layer
    // 退出功能 layuilayer 弹出层
    $('#btnLogout').click(function () {
        // console.log('111');
        // 回调函数是真正的退出功能
        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
            //do something 和登录反着来
            // 1.清空本地存储的token
            localStorage.removeItem('token')
            // 2.重新跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });

    });

})
// 获取用户基本信息 进行页面渲染
function getUserInfo() {
    $.ajax({
        type: "get",
        url: "/my/userinfo",
        //设置请求头信息 配置对象
        // headers: {
        //     // 之前登录的时候存到啦 本地
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            // 渲染 用户头像 函数
            //  因为代码过多所以进行啦提取 传入获取到的数据
            if(res.status !==0){
              return layer.msg('获取用户信息失败')
            }
            renderAvatar(res.data)
        },
        // 控制用户访问权限 没登录不让访问
        // ajax不管成功还是失败都会调用这个回调 
        // complete:function (res) { 
        //     // 判断用户响应的东西 
        //     console.log(res);
        //     console.log('执行啦complete回调');
        //     if (res.responseJSON.status === 1 && res.responseJSON.message ==='身份认证失败！') {
        //         // 1.清空token
        //         localStorage.removeItem('token')
        //         // 2.跳转到登录页面
        //         // location.href='/login.html'
        //     }
        //  }
    });
}
// 渲染 用户头像 和名字函数

function renderAvatar(user) {
    // 1.设置用户名字 q获取用户名 以nickname 优先

    let name = user.nickname || user.username
    // 2设置文本
    $('#welcome').html('欢迎&nbsp;&nbsp' + name);

    // 3 头像
    if (user.user_pic !== null) {
        // 优先 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide();
    } else {
        //    渲染文字头像
        $('.layui-nav-img').hide();
        let first = name[0].toUpperCase()
        $('.text-avatar').html(first).show();

    }
}