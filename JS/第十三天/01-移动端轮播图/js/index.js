window.addEventListener('load', function () {//监听窗口 所有其他元素加载完成后再执行以下js操作,避免代码出现错误
    // 一.通过计时器实现图片的连续滚动 每隔两秒向左移动focus宽度的距离
    // 1.获取元素
    var focus = document.querySelector('.focus');//获取焦点框元素 因为是ul的父元素 可以用来获取ul所以要声明
    var ul = focus.children[0];//获取ul 该动画是要移动ul 而ul是focus元素的第一个子元素
    var w = focus.offsetWidth;//获取focus也是图片的宽度
    // 2.利用定时器自动轮播图片
    var index = 0;//声明一个变量用作计数器
    var timer = setInterval(function () {
        index++;//每次开启计时器索引就自加1
        var translate_x = -index * w;//每次移动的距离 实际上是从初始位置计算的 但视觉上是从上次计时器的位置
        ul.style.transition = 'all .3s';//添加过渡效果
        ul.style.transform = ('translateX(' + translate_x + 'px)');//利用translate移动
    }, 2000)

    // 二.实现无缝滚动
    // 由于每次过渡动画都有一个0.3s的时间 因此要等到过渡动画结束之后才能去判断 这里通过监听过渡完成事件 transitionend来完成
    ul.addEventListener('transitionend',function () {//过渡动画完成后执行
        // 通过图片的索引判断是否立刻跳转到初始图片 注意这里只是用来判断是不是最后一张图片 是否直接跳转为第一张 图片滚动效果还是要计时器实现
        

        if (index == 3) {//当图片是第四张(最后一张)时
            index = 0;//将索引调整为第一张的索引
            ul.style.transition = 'none';//去除过渡动画 实现快速跳到目标位置(第一张)
            var translate_x = -index * w;
            ul.style.transform = 'translateX('+ translate_x +')'
        } else if (index < 0) {
            index = 2;
            ul.style.transition = 'none';
            // 利用新的索引号乘以宽度去滚动图片
            var translate_x = -index * w;
            ul.style.transform = 'translateX(' + translate_x + ')'
        }
    })
})
