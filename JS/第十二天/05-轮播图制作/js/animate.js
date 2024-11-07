function animate(obj, target, callback) {
    // callback 参数是一个可选的回调函数。如果传入了回调函数，动画结束时会执行它。
    // 例如，调用时可以传一个空函数：callback = function() {}，然后在动画结束时调用 callback()

    // 先清除之前的定时器，防止多个定时器同时运行，导致动画叠加
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        // 每次定时器执行时，计算当前的步长值
        // 步长值 (step) 表示每次移动的距离，计算方式为 (目标位置 - 当前对象位置) / 10
        // 这样可以让对象移动得越来越慢，模拟“缓动”的效果
        var step = (target - obj.offsetLeft) / 10;
        // 如果 step 是正数，向上取整；如果是负数，向下取整，确保对象能精确到达目标位置
        step = step > 0 ? Math.ceil(step) : Math.floor(step);

        // 如果对象当前位置等于目标位置，停止动画
        if (obj.offsetLeft == target) {
            // 停止定时器，停止动画
            clearInterval(obj.timer);
            // 判断是否传入了回调函数，若传入了则执行 callback
            // 这里使用了短路运算符，如果 callback 存在且为真，才会执行 callback()
            callback && callback(); // 相当于 if (callback) { callback(); }

        }

        // 更新对象的位置，每次移动的距离等于当前的位置加上步长值 step
        obj.style.left = obj.offsetLeft + step + 'px';

    }, 15); // 定时器每隔 15 毫秒执行一次，控制动画的速度
}
