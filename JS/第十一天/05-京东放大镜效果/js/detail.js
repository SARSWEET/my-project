window.addEventListener('load', function () {
    // 确保所有页面元素加载完毕后再执行JS代码
    var preview_img = document.querySelector('.preview_img'); // 获取小图预览容器
    var mask = document.querySelector('.mask'); // 获取遮罩层
    var big = document.querySelector('.big'); // 获取大图容器

    // 1. 鼠标移入preview_img盒子时，显示遮罩层和大图
    preview_img.addEventListener('mouseover', function () {
        mask.style.display = 'block'; // 显示遮罩层
        big.style.display = 'block'; // 显示大图
    });

    // 鼠标移出preview_img盒子时，隐藏遮罩层和大图
    preview_img.addEventListener('mouseout', function () {
        mask.style.display = 'none'; // 隐藏遮罩层
        big.style.display = 'none'; // 隐藏大图
    });

    // 2. 鼠标在盒子内移动时，计算遮罩层的位置
    preview_img.addEventListener('mousemove', function (e) {
        var x = e.pageX - this.offsetLeft; // 计算鼠标在盒子内的X坐标
        var y = e.pageY - this.offsetTop; // 计算鼠标在盒子内的Y坐标

        // 计算遮罩层的X、Y坐标，并减去遮罩层自身宽度和高度的一半以实现居中
        var maskX = x - mask.offsetWidth / 2;
        var maskY = y - mask.offsetHeight / 2;

        // 遮罩层的最大移动距离（正方形，所以只需计算一次）
        var maskMax = preview_img.offsetWidth - mask.offsetWidth;

        // 限制遮罩层的X坐标范围在0到maskMax之间
        if (maskX <= 0) {
            maskX = 0;
        } else if (maskX > maskMax) {
            maskX = maskMax; // 之前硬编码的96改为maskMax，以保持灵活性
        }

        // 限制遮罩层的Y坐标范围在0到maskMax之间
        if (maskY <= 0) {
            maskY = 0;
        } else if (maskY > maskMax) {
            maskY = maskMax; // 同理将96替换为maskMax
        }

        // 设置遮罩层的位置
        mask.style.left = maskX + 'px';
        mask.style.top = maskY + 'px';

        // 3. 计算大图片的移动距离，使其跟随遮罩层的移动
        var bigImg = document.querySelector('.bigImg'); // 获取大图
        var bigMax = bigImg.offsetWidth - big.offsetWidth; // 大图的最大移动距离

        // 计算大图的X、Y移动距离，公式：遮罩层移动距离 * 大图最大移动距离 / 遮罩层最大移动距离
        var bigX = maskX * bigMax / maskMax;
        var bigY = maskY * bigMax / maskMax;

        // 设置大图的位置，注意需要取负值实现反向移动
        bigImg.style.left = -bigX + 'px';
        bigImg.style.top = -bigY + 'px';
    });
});