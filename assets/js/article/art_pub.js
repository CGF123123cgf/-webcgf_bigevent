$(function () {
    let layer = layui.layer
    let form = layui.form
    // 初始化富文本编辑器  按照步骤即可
    initEditor()

    // 定义模板 发送请求 渲染 调用form.rander()因为是动态添加的
    initCate()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        });
    }
    // 1. 初始化图片裁剪器
    let $image = $('#image')
    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)
    // 选择封面 

    $('#btnChooseImage').click(function () {
        $('#coverFile').click()

    });
    //  选择的封面在展示区显示 替换
    // 1 拿到图片文件
    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').change(function (e) {
        // 获取文件的列表数组
        let files = e.target.files
        // 判断用户是否选择啦文件
        if (files.length === 0) {
            return
        }
        // 选择啦文件 根据文件，创建对应的url地址
        let newImgURL = URL.createObjectURL(files[0])
        // 重新设置 图片路径
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });

    // 发布文章的实现步骤 ：
    // 首先 1先获取到数据  2发请求调接口 
    //  1先获取到数据
    // 定义文章的发布状态 默认已发布
    let art_state = '已发布'
    // 如果用户点击存为草稿按钮 绑定点击事件改发布状态
    $('#btnSave2').click(function (e) {
        art_state = '草稿'

    });
    $('#btnSave1').click(function (e) {
        art_state = '已发布'

    });
    // 为表单 绑定submit提交事件
    $('#form-pub').submit(function (e) {
        e.preventDefault();
        let fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 文章的封面数据  图片文件  追加到formDate

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // fd.forEach(function (v, k) {
                //     console.log(k, v);
                // })
                // 发起请求
                publishArticle(fd)
            })

    });
    // 定义发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "post",
            url: "/my/article/add",
            data: fd,
            //    FormDate格式的表单数据必须配置以下配置项
            contentType : false,
            processData : false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                location.href='/article/art_list.html'
            }
        });
    }

})