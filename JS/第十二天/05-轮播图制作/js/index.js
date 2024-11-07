window.addEventListener('load', function () { // 页面加载完成后执行整个JS逻辑，确保所有资源都已经加载
    // 获取页面中的左右箭头和轮播图盒子
    var arrow_l = document.querySelector('.arrow-l'); // 获取左侧箭头按钮，注意这里的类选择器要带点
    var arrow_r = document.querySelector('.arrow-r'); // 获取右侧箭头按钮
    var focus = document.querySelector('.focus'); // 获取轮播图外部容器

    // 1. 鼠标经过轮播图区域时，显示左右箭头，鼠标离开时隐藏箭头
    focus.addEventListener('mouseenter', function () {
        arrow_l.style.display = 'block'; // 显示左箭头
        arrow_r.style.display = 'block'; // 显示右箭头

        // 鼠标经过时停止自动播放，清除定时器
        clearInterval(timer); // 清除定时器，停止自动播放
        timer = null; // 将定时器变量置为空，方便后续判断
    })
    focus.addEventListener('mouseleave', function () {
        arrow_l.style.display = 'none'; // 隐藏左箭头
        arrow_r.style.display = 'none'; // 隐藏右箭头
        // 鼠标离开时重新开启定时器，继续自动播放
        timer = setInterval(function () {
            arrow_r.click(); // 模拟点击右箭头，实现自动播放下一张图片
        }, 2000); // 每隔2秒切换到下一张图片
    })

    // 2. 根据图片数量动态生成小圆圈，有几张图片就生成几个小圆圈
    var ul = focus.querySelector('ul'); // 从focus容器中获取ul元素，缩小选择范围
    var ol = focus.querySelector('.circle'); // 获取小圆圈容器(ol元素)
    var focusWidth = focus.offsetWidth; // 获取轮播图容器的宽度，用于计算图片滚动的距离

    console.log(focusWidth);
    console.log(focus.style.width); // 注意：通过.style只能获取行内样式，无法获取非行内定义的样式宽度

    console.log(ul.children); // ul.children是一个HTML集合，包含ul中的所有li元素(即每张图片)

    // 遍历ul中的每个li元素，根据图片数量创建对应数量的小圆点，并将其添加到ol中
    for (let i = 0; i < ul.children.length; i++) {
        var li = document.createElement('li'); // 创建一个新的li元素作为小圆点
        ol.appendChild(li); // 将创建的小圆点(li)添加到小圆圈容器(ol)中
        // 在生成小圆点的同时，为每个小圆点设置索引属性(index)，用于后续点击定位图片
        ol.children[i].setAttribute('index', i); // 设置自定义属性'index'，用于标识每个小圆点的位置

        // 为每个小圆点添加点击事件，点击后让对应的图片显示
        li.addEventListener('click', function () {
            // 清除所有小圆点的类名(排他思想)，保证只有当前点击的小圆点是高亮状态
            for (let i = 0; i < ol.children.length; i++) {
                ol.children[i].className = ''; // 清除所有小圆点的类名
            }
            this.className = 'current'; // 为当前点击的小圆点添加'current'类名，使其高亮

            // 3. 点击小圆点切换图片，调用动画函数animate(obj, target, callback)
            // 移动的是图片所在的ul容器，移动距离等于小圆点的索引乘以图片的宽度
            var index = this.getAttribute('index'); // 获取当前点击的小圆点的索引
            num = index; // 同步更新图片索引计数器num，使下一次点击右箭头从当前图片开始
            circle = index; // 同步更新小圆点计数器circle，使下一次点击右箭头从当前小圆点开始
            animate(ul, -index * focusWidth); // 调用动画函数，移动ul到对应位置，负号表示向左移动
        })
    }

    // 默认将第一个小圆点设置为高亮状态
    ol.children[0].className = 'current';

    // 4. 声明一个变量num，用于记录当前显示的图片索引，每次点击右箭头时自增1，实现图片滚动
    var num = 0; // 图片索引计数器
    var circle = 0; // 小圆点索引计数器

    // 5. 克隆ul的第一个子元素(第一张图片)，并将其添加到ul的末尾，实现无缝滚动效果
    var first = ul.children[0].cloneNode(true); // 克隆第一张图片
    ul.appendChild(first); // 将克隆的图片添加到ul的末尾

    var flag = true; // 节流阀，控制点击节奏，防止连续点击导致动画冲突

    // 6. 点击右侧箭头按钮，实现图片的无缝滚动
    arrow_r.addEventListener('click', function () {
        if (flag) {
            flag = false; // 关闭节流阀，防止在动画执行过程中再次触发点击事件
            if (num == ul.children.length - 1) { // 如果当前是最后一张(克隆的第一张)
                ul.style.left = 0; // 直接跳转到真正的第一张图片
                num = 0; // 索引归零，从第一张重新开始
            }
            num++; // 图片索引加1，切换到下一张图片
            animate(ul, -num * focusWidth, function () {
                flag = true; // 动画执行完毕后打开节流阀，允许再次点击
            });

            circle++; // 小圆点索引加1
            if (circle == ol.children.length) { // 如果到达最后一个小圆点，则重置为第一个小圆点
                circle = 0;
            }
            circleChange(); // 调用函数更新小圆点的状态
        }
    });

    // 点击左侧箭头按钮，实现图片的向前滚动
    arrow_l.addEventListener('click', function () {
        if (flag) {
            flag = false; // 关闭节流阀
            if (num == 0) { // 如果当前是第一张图片
                num = ul.children.length - 1; // 跳转到最后一张(克隆的图片)
                ul.style.left = -num * focusWidth + 'px'; // 直接跳转到最后一张图片的位置
            }
            num--; // 图片索引减1，切换到前一张图片
            animate(ul, -num * focusWidth, function () {
                flag = true; // 动画执行完毕后打开节流阀
            });

            circle--; // 小圆点索引减1
            if (circle < 0) { // 如果当前是第一个小圆点，则跳转到最后一个小圆点
                circle = ol.children.length - 1;
            }
            circleChange(); // 调用函数更新小圆点的状态
        }
    });

    // 封装一个函数，用于更新小圆点的状态
    function circleChange() {
        // 清除所有小圆点的高亮状态
        for (let i = 0; i < ol.children.length; i++) {
            ol.children[i].className = '';
        }
        // 为当前索引对应的小圆点添加'current'类名，使其高亮
        ol.children[circle].className = 'current';
    }

    // 自动播放轮播图，使用定时器每隔2秒切换到下一张图片
    var timer = setInterval(function () {
        arrow_r.click(); // 每隔2秒自动调用右箭头的点击事件
    }, 2000);
});
