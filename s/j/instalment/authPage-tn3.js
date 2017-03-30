/**
 * Created by ydz on 17/1/18.
 */
// 点击下一步
$('#confirm').on('click',function(){
    var data = {
        order_uuid : GetQueryString('order_id')
        //order_uuid : "8aadab1959ae40e70159af6072980053"
        ,marital: $('#hunYin').val()          //婚姻状况
        ,residence:$('#homeType').val()     //住宅类型
        ,home_province:$('#shengJi').val() //现居住地址
        ,home_city:$('#shiJi').val()
        ,home_area:$('#xianji').val()
        // ，home_province:$('#work_addr').val().split(" ")[0]  //现居住地址
        // ,home_city:$('#work_addr').val().split(" ")[1]
        // ,home_area:$('#work_addr').val().split(" ")[2]
        ,home_detail:$('#work_detail').val()        //居住地详细地址
        ,contact1_relation:$('#contact1_relation').val()        //与申请人关系
        ,contact1_name:$('#contact1_name').val()           //第一联系人姓名
        ,contact1_phone:$('#contact1_phone').val()           //第一联系人电话
    }
    if(data.marital == ''||data.marital == '0'){
        $.alert('请选择婚姻状况')
    }else if(data.residence=='' || data.residence == '0'){
        $.alert('请选择住宅类型')
    }else if(data.home_province == '00 请选择'){
        $.alert('请选择所在区域')
    }else if(data.home_detail == ''){
        $.alert('请填写详细地址')
    }else if(data.contact1_relation == '' || data.contact1_relation == '0'){
        $.alert('请填选择与申请人关系')
    }else if(data.contact1_name == ''){
        $.alert('请填写联系人姓名')
    }else if(data.contact1_phone == ''){
        $.alert('请填写联系人手机')
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(data.contact1_phone)){
        $.alert('联系人手机号格式错误')
    }else if(!$(".icon-weixuanzhong").hasClass("icon-xuanzhong")){
        $.alert('请勾选同意协议')
    }else{
        console.log(data)
        post('/adapter/wap/order/authTNStep3',JSON.stringify(data),function(ds){
            console.log(ds)
            if(ds.status == 0){
                window.location.href = 'authPage-tn4.html?order_id='+data.order_uuid
            }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else {
                $.alert(ds.message)
            }
        })
    }
})
//点击上一步
$('#goback').on('click',function(){
    window.history.back()
})
$('.xuanZe').click(function () {
    $('.xuanZe .icon-weixuanzhong').toggleClass('icon-xuanzhong');
});
//页面加载
$(function(){
    $("#work_addr").cityPicker({
        title: "请选择现居住地址"
    })
    $('#contact1_relation').val(0);
    init()
})

function init(){
    var querydata = {
        order_uuid : GetQueryString('order_id')
    }
    post('/adapter/wap/order/getTNAuth',JSON.stringify(querydata),function(ds){
        console.log(ds)
        if(ds.status == 0){
            var l = ds.result.base
            $('#hunYin').val(l.marital)  //婚姻状况
            $('#homeType').val(l.residence)     //住宅类型
            $('#contact1_relation').val(l.contact1_relation)           //与申请人关系
            $('#contact1_name').val(l.contact1_name)              //第一联系人姓名
            $('#contact1_phone').val(l.contact1_phone)            //第一联系人电话


            if(l.home_province!=""){
                $('#shengJi').val(l.home_province)
                xianShiJi();
            }
            if(l.home_city!=""){
                $('#shiJi').val(l.home_city)
                xianxianJi();
            }
            $('#xianji').val(l.home_area)
            // var home_province = l.home_province == null ? '' :l.home_province        //现居住地址
            // var home_city = l.home_city == null ? '' : l.home_city
            // var home_area = l.home_area == null ? '' : l.home_area
            // $('#work_addr').val( home_province +' '+home_city + '' + home_area)
            $('#work_detail').val(l.home_detail)            //居住地详细地址
        }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }
    })
}
function inputaddr(ele){
    $('input').blur()
}
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var clearinput = function(){
    $('input').blur()
}