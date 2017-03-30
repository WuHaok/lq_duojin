//初始化微信JS
$.ajax({
	type : "POST",
	timeout : 50000,
	dataType : "json",
	url : '/wechat/getJsParams',
	success : function(redata) {
		console.log(redata);
		try {
			wx.config({
				debug : false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
				appId : redata.appId, // 必填，公众号的唯一标识
				timestamp : redata.timestamp, // 必填，生成签名的时间戳
				nonceStr : redata.noncestr, // 必填，生成签名的随机串
				signature : redata.signature,// 必填，签名，见附录1
				jsApiList : [ 'openProductSpecificView', 'closeWindow',
						'hideMenuItems', 'onMenuShareTimeline',
						'onMenuShareAppMessage' ]
			// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			});
		} catch (e) {
			console.log(e.message);
		}
	},
	error : function(e) {// 请求失败处理函数
		// showAlert2("请求失败！");
	}
});

wx.ready(function() {
	// config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
	//hideMenu();
	if (sharedata) {
	// 	// 当分享数据不为空的时候初始化分享设置
		initShare(sharedata.title, sharedata.desc, sharedata.imgUrl);
	}
});
wx.error(function(res) {

	// config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
	// alert(JSON.stringify(res));
});
function closeWxPage() {
	wx.closeWindow();
}

function hideMenu() {
	wx.hideMenuItems({
		menuList : [ 'menuItem:copyUrl', 'menuItem:share:QZone',
				'menuItem:share:qq', 'menuItem:openWithSafari',
				'menuItem:share:email' ]
	// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮，所有menu项见附录3
	});
}

/**
 * 初始化分享设置
 * 
 * @param title
 *            分享标题
 * @param desc
 *            描述
 * @param link
 *            分享链接
 * @param imgUrl
 *            分享图标
 * @param callback
 *            确认分享后的回调函数
 */
function initShare(titleStr, descStr, imgUrlStr) {
	var domain = location.protocol + "//" + location.hostname;// window.location.href.match(/http[s]?:\/\/(.*?)([:\/]|$)/);
	if (imgUrlStr) {
		imgUrlStr = domain + imgUrlStr;
	}
	// 分享到朋友圈 初始化
	wx.onMenuShareTimeline({
		title : titleStr, // 分享标题
		link : location.href, // 分享链接
		imgUrl : imgUrlStr, // 分享图标
		success : function() {
			try {
				// 用户确认分享后执行的回调函数
				var data ={
                	third_uuid: GetQueryString('id')
                	,ser:'specialZone'
                	,type:'1'
            	}
            	$.post('/adapter/wap/system/increaseCount',JSON.stringify(data),function(ds){
                	if(ds.status == 0 ){
                   		alert('分享成功')
                	}
            	})
			} catch (e) {
				// alert(e.message);
			}

		},
		cancel : function() {
			// 用户取消分享后执行的回调函数
		}
	});
	// 分享给朋友 初始化
	wx.onMenuShareAppMessage({
		title : titleStr, // 分享标题
		desc : descStr, // 分享描述
		link : location.href, // 分享链接
		imgUrl : imgUrlStr, // 分享图标
		type : '', // 分享类型,music、video或link，不填默认为link
		dataUrl : '', // 如果type是music或video，则要提供数据链接，默认为空
		success : function() {
			// 用户确认分享后执行的回调函数
		try {
			var data ={
                third_uuid: GetQueryString('id')
                ,ser:'specialZone'
                ,type:'1'
            }
            $.post('/adapter/wap/system/increaseCount',JSON.stringify(data),function(ds){
                if(ds.status == 0 ){
                   alert('分享成功')
                }
            })

		} catch (e) {
				alert(e.message);
			}
		},
		cancel : function() {
			// 用户取消分享后执行的回调函数
		}
	});
}
