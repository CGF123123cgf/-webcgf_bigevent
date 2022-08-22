$(function () {
    let layer = layui.layer
    let form = layui.form
    initArtCateList()
    // 获取文章分类数据
    function initArtCateList(params) {
        // 发送网络请求
        $.ajax({
            method: "get",
            url: "/my/article/cates",

            success: function (res) {
                console.log(res);
                // 获取到数据 进行渲染 为了快速 使用模板引擎
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        });
    }
    let indexAdd = null
    // 添加类别 弹出层
    $('#btnAddCate').click(function (e) {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        });
    });
    // 通过代理 的形式 为form-add 表单绑定submit事件
    // 动态添加的
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        // console.log('ok');
        // 发送请求 添加分类
        $.ajax({
            method: "post",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    layer.msg('新增分类失败')
                    return layer.close(indexAdd)
                }
                //    新增分类成功 刷新分类数据
                initArtCateList()
                layer.msg('新增分类成功')
                // 关闭弹出层
                layer.close(indexAdd)
            }

        });
    });
    // 编辑 文章分类（）更新
    // 三步 1.绑定事件 2，渲染页面填充数据 3.更新数据
    let indexeEit = null
    $('tbody').on('click', '.btn-edit', function () {
        // console.log('ok');
        indexeEit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        });
        // 1拿到这行数据的id值，2发送请求获取数据，然后填充

        // 自定义属性 添加id
        // 拿到这行数据的id值
        let id = $(this).attr('data-id');
        console.log(id);
        //    2发送请求获取数据 回传显示
        $.ajax({
            method: "get",
            url: "/my/article/cates/" + id,

            success: function (res) {
                console.log(res);
                form.val('form-edit', res.data)
            }
        });
        //  修改文章分类的功能
        // 分析步骤  1监听submit事件阻止默认行为  2发送 请求   3关闭弹出层   4刷新数据
        // 表单 的submit事件
        // 事件委托
        $('body').on('submit', '#form-edit', function (e) {
            e.preventDefault()
            $.ajax({
                method: "post",
                url: "/my/article/updatecate",
                data: $(this).serialize(),

                success: function (res) {
                    console.log(res);
                    if (res.status !== 0) {
                        return layer.msg('更新数据失败')
                    }
                    layer.msg('更新数据成功')
                    layer.close(indexeEit)
                    initArtCateList()
                }
            });
        });

    });
    // 通过代理形式（事件委托）为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 分析思路：获取id  提示用户是否删除  根据id 发送网络请求删除
        let id = $(this).attr('data-id');
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "get",
                url: "/my/article/deletecate/" + id,

                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败')
                        layer.close(index);
                    }
                    layer.msg('删除分类成功')
                    layer.close(index);
                    initArtCateList()
                }
            });

        });

    });

})