/**
 * Created by ydz on 17/1/17.
 */
// 点击下一步
$('#confirm').on('click',function(){
    var data = {
        order_uuid : GetQueryString('order_id')   //订单标示
        //order_uuid:"8aadab1959206fc80159217dd2f401f5"
        ,name:$('#name').val()                     //姓名
        ,card_id:$('#card_id').val()                //身份证
        ,wxid:$('#wxid').val()                      //微信号
        ,mobile:$('#phone').val()                   //手机号
        ,bank_name:$('#bank_name').val()            //开户银行
        ,bank_num:$('#bank_num').val()              //银行卡号
        ,card_hand:$('#imgSC img').attr('src')    //照片
        ,card_front:$('#imgZZ img').attr('src')    //照片
        ,card_back:$('#imgFZ img').attr('src')   //照片
        ,email:$('#dzyx').val()                     //电子邮箱
    }
    //判断表单
    if(data.name == ''){
        $.alert('请填写姓名')
    }else if(data.card_id==''){
        $.alert('请填写身份号码')
    }else if(!/^\d{17}(\d|x)$/i.test(data.card_id)){
        $.alert('身份证号格式错误')
    }else if(data.card_hand == '' || data.card_hand == undefined){
        $.alert('请上传手持身份证照片')
    }else if(data.card_front == '' || data.card_front == undefined){
        $.alert('请上传身份证正面照片')
    }else if(data.card_back == '' || data.card_back == undefined){
        $.alert('请上传身份证反面照片')
    }else if(data.bank_name == '' || data.bank_name == '0'){
        $.alert('请选择银行')
    }else if(data.bank_num == ''){
        $.alert('请输入银行卡号')
    }else if(!/^\d{16}|\d{19}$/i.test(data.bank_num)){
        $.alert('银行卡号格式错误')
    }else if(data.mobile == ''){
        $.alert('请填写手机号码')
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(data.mobile)){
        $.alert('手机号格式错误')
    }else if(data.wxid == ''){
        $.alert('请填写微信号')
    }else if(data.email == ''){
        $.alert('请填写电子邮箱')
    }else if(!/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i.test(data.email)){
        $.alert('电子邮箱格式错误')
    }else{
        console.log(data)
        post('/adapter/wap/order/authTNStep1',JSON.stringify(data),function(ds){
            console.log(ds)
            if(ds.status == 0){
                window.location.href = 'authPage-tn2.html?order_id='+data.order_uuid
            }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else {
                $.alert(ds.message)
            }
        })
    }
})
var clearinput = function(){
    $('input').blur();
}
// 页面加载
$(function(){
    $('#bank_name').val(0)
    init()
})
//从服务器获取该订单数据
function init(){
    var querydata = {
        order_uuid : GetQueryString('order_id')
        //order_uuid:"8aadab1959206fc80159217dd2f401f5"
    }
    console.log(JSON.stringify(querydata))
    post('/adapter/wap/order/getTNAuth',JSON.stringify(querydata),function(ds){
        console.log(ds)
        if(ds.status == 0){
            var l = ds.result.base
            $('#name').val(l.name)          //姓名
            $('#card_id').val(l.card_id)    //身份证
            $('#wxid').val(l.wxid)          //微信号
            $('#phone').val(l.mobile)       //手机号
            $('#dzyx').val(l.email)       //电子邮箱
            l.bank_name == null ? $('#bank_name').val(0) :$('#bank_name').val(l.bank_name )// 银行卡类型
            $('#bank_num').val(l.bank_num)          //银行卡号
            if(l.card_hand != null ){               //身份证照片
                $('#imgSC img').remove();//身份证照片
                $('#imgSC').append('<img class="img lookbigimg" src=' + l.card_hand + '-dj4>')
            }
            if(l.card_front != null ){               //身份证照片
                $('#imgZZ img').remove();//身份证照片
                $('#imgZZ').append('<img class="img lookbigimg" src=' + l.card_front + '-dj4>')
            }
            if(l.card_back != null ){
                $('#imgFZ img').remove();//身份证照片
                $('#imgFZ').append('<img class="img lookbigimg" src=' + l.card_back + '-dj4>')
            }
        }else if(ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }
    })
}

// 点击查看样例
$('#handIdcard').on('click',function(){
    $("#about").popup();
})
$('#handIdcard1').on('click',function(){
    $("#about1").popup();
})
$('#handIdcard2').on('click',function(){
    $("#about2").popup();
})
//点击我知道了
$('.close-popup').on('click',function(){
    $.closePopup()
})
//上传图片
function imgChangeFZ(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgFZ img').remove();
        if (dataimg.length == 1) {
            $('#imgFZ').append('<img class="img lookbigimg" src=' + dataimg + '>')
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
function imgChangeSC(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgSC img').remove();
        if (dataimg.length == 1) {
            $('#imgSC').append('<img class="img lookbigimg" src=' + dataimg + '>')
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
function imgChangeZZ(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgZZ img').remove();
        if (dataimg.length == 1) {
            $('#imgZZ').append('<img class="img lookbigimg" src=' + dataimg + '>')
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}

// gongju
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
// function imgDel(e) {
//     var $this = $(e)
//     $this.closest('div').remove()
//     $('#handUp').show()
// }