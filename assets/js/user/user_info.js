$(function(){
    let form=layui.form
    let layer =layui.layer
    form.verify({
        nickname:function(value){
          if(value.length>6){
            return '昵称长度必须在1~6之间'
          }
        }
    })
    // 获取用户已有信息 进行填充
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: "get",
            url: "/my/userinfo",
           
            success: function (res) {
                if(res.status !==0){
                    return layer.msg('获取用户信息失败')

                }
                // 获取到用户信息 
                console.log(res);
                // 调用form.val()快速为表单赋值  layui的方法
                //指定要填充的表单  数据
                form.val('formUserInfo',res.data)
                
            }
        });
    }
    // 自定义重置表单行为
    $('#btnReset').click(function (e) { 
        e.preventDefault();
        // 调用方法 重新重置为请求的初始值
        initUserInfo()
    });
    // 监听表单提交 更新用户数据  当前是window 并调用父标签的 方法刷新界面
   $('.layui-form').submit(function (e) { 
    e.preventDefault();
      $.ajax({
        method: "POST",
        url: "/my/userinfo",
        data: $(this).serialize(),
      
        success: function (res) {
            if(res.status !==0){
                return layer.msg('更新用户信息失败')
            }
            layer.msg('更新用户信息成功')
            // 调用父页面的方法
            window.parent.getUserInfo()
        }
      });
   });

})