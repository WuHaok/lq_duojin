// 用于分期还款
function startWXPay(data) {
	try {
		var signType = "MD5";
		var payway = localStorage.getItem('payway')
		WeixinJSBridge.invoke('getBrandWCPayRequest', {
			"appId" : data["appId"], // 公众号名称，由商户传入
			"timeStamp" : data["timeStamp"], // 时间戳
			"nonceStr" : data["nonceStr"], // 随机串
			"package" : data["package"],// 扩展包
			"signType" : data["signType"], // 微信签名方式:1.MD5
			"paySign" : data["paySign"]
		// 微信签名
		}, function(res) {  //分期订单
			console.log(res)
			if (res.err_msg == "get_brand_wcpay_request:ok") {  //成功
				// alert(payway)
				window.location.href="allBills.html?sell_id="+GetQueryString("sell_id")
			} else { //失败
				window.location.href="zhangDetail.html?sell_id="+GetQueryString("sell_id")
			}
			// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
			// 因此微信团队建议，当收到ok返回时，向商户后台询问是否收到交易成功的通知，若收到通知，前端展示交易成功的界面；若此时未收到通知，商户后台主动调用查询订单接口，查询订单的当前状态，并反馈给前端展示相应的界面。
		});
	} catch (e) {
		alert(e.message);
		isClickEnable = true;
	}
}
function initWxJSB() {
	// 当微信内置浏览器完成内部初始化后会触发WeixinJSBridgeReady事件。
	document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
	}, false);
}
// 微信支付
$(function() {
	// 初始化微信支付控件
	initWxJSB();
});