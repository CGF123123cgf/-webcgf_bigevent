$(function () {
    $("#link_reg").click(function () {
        $('.login-box').hide();
        $('.reg-box').show();

    });
    $("#link_login").click(function () {
        $('.login-box').show();
        $('.reg-box').hide();

    });
    //从layui中获取form对象
    let form = layui.form
    let layer = layui.layer
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // vlaue 是确认密码的值
        repwd: function (value) {
            let pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return "两次密码不一致"
            }
        }
    })
    // 注册
    $('#form_reg').submit(function (e) {
        e.preventDefault();
        $.post("/api/reguser", { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() },
            function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);

                    return layer.msg(res.message)
                }
                layer.msg('注册成功，请登录')
                //    console.log('注册成功'); layui 提示消息 内置的模块 弹出层 msg
                //自定跳转页面
                $('#link_login').click()
            },

        );
    });
    // 登录
    $('#form_login').submit(function (e) {
        e.preventDefault();
        console.log(111);
        $.ajax({
            type: "post",
            url: "/api/login",
            // 快速获取表单数据 上面是手动拼接
            data: $(this).serialize(),

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                console.log(res.token);
                // 把token 存到本地  用的时候 去本地取
                // let str = '123'
                localStorage.setItem('token', res.token)
                console.log(localStorage);
                // 跳转到后台主页  重新打开页面就本地能存啦
                location.href='/index.html'
            }
        });
    });

})