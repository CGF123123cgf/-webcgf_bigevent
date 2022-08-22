$(function () {
    let layer = layui.layer
    let form = layui.form
    let laypage = layui.laypage;
    // 定义时间美化过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        let y = padZero(dt.getFullYear())
        let m = padZero(dt.getMonth() + 1)
        let d = padZero(dt.getDate())

        let hh = padZero(dt.getHours())
        let mm = padZero(dt.getMinutes())
        let ss = padZero(dt.getSeconds())
        return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
    }
    //  定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 大思路 发送网路请求，使用模板引擎渲染页面 先做中间列表，因为筛选和分页都是对其的操作
    // 定义查询参数对象 之后每次发请求都是要携带这个对象发送给服务器
    let q = {
        pagenum: 1,//请求数据的页码 默认请求的第一页的数据
        pagesize: 2,//每页显示几条数据，默认显示2条
        cate_id: '',//文章分类的id 用于筛选 默认是空不筛选
        state: ''//文章发布的状态，用于筛选 默认是空不筛选
    }
    initTable()
    initCate()
    // 请求文章列表数据并使用模板引擎渲染出table表格
    function initTable() {
        $.ajax({
            method: "get",
            url: "/my/article/list",
            data: q,

            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                let htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 表格渲染完 ，渲染分页 
                renderPage(res.total)
            }
        });
    }

    // 获取文章分类
    function initCate() {
        $.ajax({
            method: "get",
            url: "/my/article/cates",

            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 获取到数据 进行渲染 为了快速 使用模板引擎
                let htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                // 页面一加载layui.js没有监听到数据 ，我们异步请求插入的元素
                // 也没有监听到。所以我们自己手动让layui 重新渲染一下
                form.render()
            }
        });
    }
    //    实现筛选功能：
    // 1监听submit提交事件 ， 2获取到数据 ， 3维护p  4调用initable 重新获取表格数据
    $('#form-search').submit(function (e) {
        e.preventDefault();
        // 2获取表单选中的值
        let cate_id = $('[name=cate_id]').val()
        let state = $('[name=state]').val()
        // 3更新q
        q.cate_id = cate_id
        q.state = state
        // 4
        initTable()
    });
    // 定义渲染分页的方法
    function renderPage(total) {
        //   total是总条数
        // console.log(total);
        // 分页容器  dom
        laypage.render({
            elem: 'pageBox' //注意，这里的 test1 是 ID，不用加 # 号
            , count: total //数据总数，从服务端得到
            , limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum,//当前页数 高亮
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页器的切换效果
            //  1 点击页码的回调
            //  2 一上来就有 只要调用啦 laypage.render
            jump: function (obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                //可以通过first 来判断 触发方式
                if (!first) {
                    initTable()
                }

            }
        });

    }
    // 通过代理（事件委托）绑定事件
    $('tbody').on('click', '.btn-delete', function () {
        // console.log('delete');
        // 获取当前页面按钮个数
        let len = $('.btn-delete').length
        // 获取文章id  通过自定义属性
        let id = $(this).attr('data-id')
        //询问是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: "get",
                url: '/my/article/delete/' + id,

                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 当删除数据完成时，判断当前页是否还有数据
                    // 删除按钮的个数 有数据 重新请求
                    // 无数据 页码减去1 再做请求
                    if (len === 1) {
                        //如果len等1 ，删除完，页面就无数据了
                        // 应该页码减一再请求
                        // 页码值最小是1
                       if (q.pagenum===1) {
                        q.pagenum===1
                       } else{
                        q.pagenum--
                       }
                        initTable()
                    } else {
                        initTable()
                    }




                }
            });
            layer.close(index);
        });
    });


})