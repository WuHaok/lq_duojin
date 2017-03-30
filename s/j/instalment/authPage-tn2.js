/**
 * Created by ydz on 17/1/17.
 */
// 点击下一步
$('#confirm').on('click',function(){
    var data = {
        order_uuid : GetQueryString('order_id')
        //order_uuid : "8aadab1959ae40e70159af6072980053"
        ,profession: $('#workIng').val()   //职业类型
        ,unit_name:$('#work_name').val()     //单位名称
        ,unit_province:$('#shengJi').val()  //单位地址
        ,unit_city:$('#shiJi').val()
        ,unit_area:$('#xianji').val()
        ,unit_detail:$('#work_detail').val()        //单位详细地址
        ,unit_tel:$('#work_mobile').val()          //单位电话
        ,job:$('#work_wei').val()              //单位职位
        ,income_per_month:$('#work_mony').val()            //月收入
        ,work_month:$('#work_time').val()            //工作时间
    }
    var uuitDetail=$('#work_mobile').val()
    if(data.unit_name==''){
        $.alert('请填写单位名称')
    }else if(data.unit_province == '00 请选择'){
        $.alert('请选择所在区域')
    }else if(data.unit_detail == ''){
        $.alert('请填写详细地址')
    }else if(data.unit_tel=='' ){
        $.alert('请输入单位电话')
    }else if(uuitDetail.indexOf('-')>0 &&(!(uuitDetail.split("-")[0].length==3 && uuitDetail.split("-")[1].length==8)  && !(uuitDetail.split("-")[0].length==4 && uuitDetail.split("-")[1].length==7) ) ){
                $.alert('单位电话格式错误，请输入“区号－固定号码”。示例：010-57197690')
    }else if(uuitDetail.indexOf('0')==0 &&(!(uuitDetail.split("-")[0].length==3 && uuitDetail.split("-")[1].length==8)  && !(uuitDetail.split("-")[0].length==4 && uuitDetail.split("-")[1].length==7) ) ){
        $.alert('单位电话格式错误，请输入“区号－固定号码”。示例：010-57197690')
    }else if(uuitDetail.indexOf('-')<0 &&(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(uuitDetail))){
                $.alert('单位电话格式错误，请重新输入')
    }else if(data.profession == '' || data.profession == '0'){
        $.alert('请选择职业类型')
    }else if(data.job == ''){
        $.alert('请填写职位信息')
    }else if(data.income_per_month == ''){
        $.alert('请填写月均收入')
    }else if(data.work_month == ''){
        $.alert('请填写现单位工作时间')
    }else{
        console.log(data)
        post('/adapter/wap/order/authTNStep2',JSON.stringify(data),function(ds){
            console.log(ds)
            if(ds.status == 0){
                window.location.href = 'authPage-tn3.html?order_id='+data.order_uuid
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
//页面加载
$(function(){
    // $("#work_addr").cityPicker({
    //     title: "请选择单位地址"
    // })
    $('#workIng').val(0);
    init()
})

function init(){
    var querydata = {
        order_uuid : GetQueryString('order_id')
    }
    post('/adapter/wap/order/getTNAuth',JSON.stringify(querydata),function(ds){
        if(ds.status == 0){
            var l = ds.result.base
            $('#workIng').val(l.profession)  //职业类
            $('#work_name').val(l.unit_name)     //单位名称
            $('#work_mobile').val(l.unit_tel)
            $('#work_wei').val(l.job)              //单位职位
            $('#work_mony').val(l.income_per_month)            //月收入
            $('#work_time').val(l.work_month)            //工作时间

            if(l.unit_province!=""){
                $('#shengJi').val(l.unit_province)
                xianShiJi();
            }
            if(l.unit_city!=""){
                $('#shiJi').val(l.unit_city)
                xianxianJi();
            }
            $('#xianji').val(l.unit_area)
            $('#work_detail').val(l.unit_detail)
        }else if(ds.status == 600 ){
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