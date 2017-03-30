var $phone = $('#phone')
var $code = $('#code')
var $getCode = $('#getCode')
var $submit = $('#submit')

$getCode.click(function () {
    var num = $phone.val()
	if(num == ''){
		$.alert('电话号码不能为空')
	} else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(num)){
		$.alert('请检查手机号码是否正确')
	} else{
		$.post('/adapter/wap/mobile/sendMobileCode',JSON.stringify({value1: num}),function(data){
            if(data.status == 0 ){
                var $this = $(this)
                var s = 60, t;
                times()
                if(data.result.mobile_code){
                	alert(data.result.mobile_code);
                }
                function times(){
                    s--;
                    $getCode.attr('disabled','disabled' )
                    $getCode.text( s +'s')
                    t = setTimeout(times, 1000);
                    if ( s <= 0 ){
                        s = 60;
                        clearTimeout(t);
                        $getCode.removeAttr('disabled' )
                        $getCode.text('获取验证码') 
                    }
                }
            }else if(data.status == 501 || data.status == 502 || data.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else {
                $.alert(data.message)
            }
        })
	}
})
$submit.click(function(){
    var num = $phone.val()
    var code = $code.val()
	if(num == ''){
		$.alert('电话号码不能为空')
	}else if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9])\d{8}$/i.test(num)){
		$.alert('请检查手机号码是否正确')
	}else if(code == ''){
		$.alert('验证码不能为空')
	}else if(!/^\d{4}$/ .test(code)){
		$.alert('验证码错误')
	}else{
		var data = {
            mobile:num
            ,mobile_code :code
            ,coupon_uuid: $('#coupon_uuid').val()
        }
        $.post('/adapter/wap/coupon/collect',JSON.stringify(data),function(data){       
            if(data.status == 0 ){
               $.alert('代金劵领取成功')
               $('.get').css('display',"none")
               $('.success').css('display','block')
            }else{
               $.alert(data.message)
            }
        })
	}
})
$('#user').click(function(e){
    e.preventDefault();
    var ua = navigator.userAgent;
    if(ua.match(/iPhone|iPod/i) != null){
        window.location.href ='https://appsto.re/cn/TfVPcb.i'         
    }
    else if(ua.match(/Android/i) != null){
        window.location.href = '/wap/shop/house';
    }
    else if(ua.match(/iPad/i) != null){
            window.location.href ='https://appsto.re/cn/TfVPcb.i'
    }
})
function is_weixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
        return true;
    } else {
        return false;
    }
}
$(function(){
    var ua = navigator.userAgent;
    if(ua.match(/iPhone|iPod/i) != null){
        if(is_weixin()){
            weixin()
        }else{

        } 
    }else if(ua.match(/iPad/i) != null){
        if(is_weixin()){
            weixin()
        }else{

        } 
    }
})

function weixin(){
    var isWeixin = is_weixin();
    var winHeight = typeof window.innerHeight != 'undefined' ? window.innerHeight : document.documentElement.clientHeight;
    var weixinTip = $('<div id="weixinTip"><p><img src="/resources/images/wap/live_weixin.png" alt="微信打开"/></p></div>');
    
    if(isWeixin){
        $("body").append(weixinTip);
    }
    $("#weixinTip").css({
        "position":"fixed",
        "left":"0",
        "top":"0",
        "height":winHeight,
        "width":"100%",
        "z-index":"1000",
        "background-color":"rgba(0,0,0,0.8)",
        "filter":"alpha(opacity=80)",
    });
    $("#weixinTip p").css({
        "text-align":"center",
        "margin-top":"10%",
        "padding-left":"5%",
        "padding-right":"5%",
        "color":"#fff"
    });
    $("#weixinTip img").css({
        'width':'100%'
    });
}

