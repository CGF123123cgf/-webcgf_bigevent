$(function () {
    let layer = layui.layer
    // 初始化裁剪区
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比  正方形
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)
    // 为上传按钮绑定事件   模拟input 点击
    $('#btnChoose').click(function () {
        $('#file').click()

    });

    // 拿到我们选择的图片 替换
    $('#file').change(function (e) {
        let filelist = e.target.files
        console.log(filelist);
        if (filelist.length === 0) {
            return layer.msg('请选择照片')
        }
        // 更换裁剪图片
        let file = e.target.files[0]
        let newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    });
    // 1确定按钮 绑定点击事件   2获取到图片 3调用接口上传到服务器

    $("#btnUpload").click(function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: "post",
            url: "/my/update/avatar",
            data: { avatar: dataURL },

            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更换头像失败')
                }
                layer.msg('更换头像成功')
                window.parent.getUserInfo()
            }

        });

    });
    // base64字符串本身就是一个图片（体积大）小文件可以转成base64  不用再请求图片 
    // 本工具不限制文件大小，但是为了平衡在生产环境中的效率，一般单个图片文件不要超过100K。
// DataURI 允许在HTML文档中嵌入小文件，可以使用 img 标签或 CSS 嵌入转换后的 Base64 编码，减少 HTTP 请求，加快小图像的加载时间。

// 经过Base64 编码后的文件体积一般比源文件大 30% 左右。
})