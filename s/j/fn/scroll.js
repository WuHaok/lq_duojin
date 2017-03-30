$(function () {
	// 获取置顶对象
	var obj = document.getElementById('scroll');
	
	// 置顶对象点击事件
	
	obj.onclick = function() {
	
		var timer = setInterval(function() {
		
		window.scrollBy(0, -50);
		
			if (document.body.scrollTop == 0) {
	
				clearInterval(timer);
			};
		}, 2);
	}
	// 窗口滚动检测
	window.onscroll = function() {
	obj.style.display = (document.body.scrollTop >= 600) ? "block" : "none";
	}
})