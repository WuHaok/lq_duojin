// 下一步
$('#confirm').on('click',function(){
    var data = {
        order_uuid : GetQueryString('order_uuid')
        ,name:$('#name').val()
        ,card_id:$('#card_id').val()
        ,wxid:$('#wxid').val()
        ,mobile:$('#phone').val()
        ,mobile_code:$('#mobile_code').val()
        ,bank_name:$('#bank_name').val()
        ,bank_num:$('#bank_num').val()
        ,card_hand:$('#upXinxi img').attr('src')
        ,home_province:$('#house_addr').val().split(" ")[0]
        ,home_city:$('#house_addr').val().split(" ")[1]
        ,home_area:$('#house_addr').val().split(" ")[2]
        ,home_detail:$('#home_detail').val()
    }
    if(data.name == ''){
        $.alert('请填写名字')
    }else if(data.card_id==''){
        $.alert('请填写身份号码')
    }else if(data.wxid == ''){
        $.alert('请填写微信号')
    }else if(data.mobile == ''){
        $.alert('请填写手机号码')
    }else if(data.mobile_code == ''){
        $.alert('请输入手机验证码')
    }else if(data.bank_name == ''){
        $.alert('请选择银行')
    }else if(data.bank_num == ''){
        $.alert('请输入银行卡号')
    }else if(data.home_province == ''){
        $.alert('请选择家庭住址')
    }else if(data.home_detail == ''){
        $.alert('请输入家庭住址')
    }else if(data.card_hand == ''){
        $.alert('请上传照片')
    }else{
        console.log(data)
        debugger;
        post('/adapter/wap/order/authStep1',JSON.stringify(data),function(ds){
            if(ds.status == 0){
              window.location.href = '../instalment/authPage2.html?order_uuid='+data.order_uuid
            }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else{
                $.alert(ds.message_detail)
            }
        })
    }
}) 
var clearinput = function(){
    $('input').blur()
}
// 页面加载
$(function(){
    $("#house_addr").cityPicker({
        title: "请选择家庭住址"
    });
    $('#bank_name').val(0)
    init()
})

function init(){
    var querydata = {
        order_uuid : GetQueryString('order_uuid')
    }
    post('/adapter/wap/order/getAuth',JSON.stringify(querydata),function(ds){
        if(ds.status == 0){
            var l = ds.result
            $('#name').val(l.name)
            $('#card_id').val(l.card_id)
            $('#wxid').val(l.wxid)
            $('#phone').val(l.mobile)  
            l.bank_name == null ? $('#bank_name').val(0) :$('#bank_name').val(l.bank_name )
            $('#bank_num').val(l.bank_num)
            if(l.card_hand != null ){
                $('#handUp').before("<div class='img-box'><img src='"+l.card_hand+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                $('#handUp').hide()
            }
            var home_province = l.home_province == null ? '' :l.home_province 
            var home_city = l.home_city == null ? '' : l.home_city
            var home_area = l.home_area == null ? '' : l.home_area
            $('#house_addr').val( home_province +' '+home_city + '' + home_area)
            $('#home_detail').val(l.home_detail)
        }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }
    })
}

// function inputaddr(ele){
//    $('input').blur()
// }
// 实例
$('#handIdcard').on('click',function(){
	$("#about").popup();
})
$('#handyinhangka').on('click',function(){
    $("#yinhangka").popup();
})
$('.close-popup').on('click',function(){
	$.closePopup()
})
/* 	图片
	手持照上传
*/
// var imgChange = function(obj){
//     $("#upXinxi").change(function() {
//         $.showLoading("正在加载...");
//          var allreadynum = $("#upXinxi  img").length;
//         var selectnum = $(this).find('input').prop('files').length;
//         if (allreadynum + selectnum <= 1) {
// 	        $(obj).parent().submit();
//             $('#handUp').hide()
//         }else{
//             $('#handUp').show()
//         }
//     })
// }
// var uploadCallback = function(data){
// 	var data = eval("(" + data + ")");
// 	var imgsrc = data.urlList[0].maxurl
// 	$('.hand-img').remove()
// 	$('#handUp').before("<div class='img-box'><img src='"+imgsrc+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
//     $.hideLoading();
// }
function imgChange(obj){
    // var fileExt=obj.value.substr(obj.value.lastIndexOf(".")).toLowerCase();
    // var nf = obj.cloneNode(true);
    // nf.value='';
    // obj.parentNode.replaceChild(nf, obj);
    $("#upXinxi").change(function() {
        $.showLoading("正在加载...");
       var selectnum = $(this).find('input').prop('files').length;
        getbase64(obj, function (dataimg) {
            var allreadynum = $("#upXinxi  img").length;
            if (allreadynum<= 1) {
                $('#upXinxi .img-box').remove()
                $('#handUp').hide()
                $('#handUp').before("<div class='img-box'><img src='" + dataimg + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                $.hideLoading();
            } else {
                $.alert('请您上传一张图片')
                $('#handUp').show()
            }
        })
   })
}
/*yanzhengma
*/
$('#getcode').click(function(){
    var $tel = $('#phone').val()
    if($tel == ''){
        $.alert('请输入手机号码')
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test($tel)){
        $.alert('您输入的号码不存在')
    }else {
        post('/adapter/wap/message/sendMobileCode',JSON.stringify({value1:$tel}),function(data){
            if(data.status == 0 ){
                var $this = $(this)
                var s = 60, t;
                times()
                if(data.result.mobile_code){
                	$.alert(data.result.mobile_code);
                }
                function times(){
                    s--;
                    $('#getcode').attr('disabled','disabled' )
                    $('#getcode').text( s +'s')
                    t = setTimeout(times, 1000);
                    if ( s <= 0 ){
                        s = 60;
                        clearTimeout(t);
                        $('#getcode').removeAttr('disabled' )
                        $('#getcode').text('获取验证码') 
                    }
                }
            }else {
                $.alert(data.message)
            }
        })
    }   
})
// gongju
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function imgDel(e) {
    var $this = $(e)
    $this.closest('div').remove()
    $('#handUp').show()
}