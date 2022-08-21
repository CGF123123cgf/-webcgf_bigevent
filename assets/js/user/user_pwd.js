$(function () {
    // 密码验证
    let form = layui.form
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        //   给新密码 因为要和旧密码比较 传入的是当前输入框的值
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })
    //监听表单提交事件  发送网络请求
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method: "post",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('更新密码失败')
                }
                layui.layer.msg('更新密码成功')
                // 重置表单  获取到原生的表单 调用reset
                $('.layui-form')[0].reset()
            }
        });
    });

})