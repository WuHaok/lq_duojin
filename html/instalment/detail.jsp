<%@ page language="java" contentType="text/html; charset=UTF-8" isELIgnored="false"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <jsp:include page="/wap/header.jsp" />
    <title>支付方式</title>
    <link rel="stylesheet" type="text/css" href="/resources/css/wap/instalment/plan.css">  
    <link rel="stylesheet" type="text/css" href="/resources/css/wap/instalment/detail.css"> 
</head>
<body>
<div id="page">
<script id="goods" type="text/html">
    <input type="hidden" name="" id="member_uuid" value="${c_m.uuid}">
    <input type="hidden" name="" id="order_uuid" value="{{order_uuid}}">
    <input type="hidden" name="" id="type" value="{{type}}"> 
    <!-- 分期服务商 -->
    <input type="hidden" name="" id="repay_name" value="{{repay_name}}"> 
    <input type="hidden" name="" id="repay_desc" value="{{repay_desc}}"> 
    <input type="hidden" name="" id="begin_repay_date" value="{{begin_repay_date}}"> 
    <input type="hidden" name="" id="deadline_day" value="{{deadline_day}}"> 
    <input type="hidden" name="" id="deadline_hour" value="{{deadline_hour}}"> 
    <input type="hidden" name="" id="deadline_uuid" value="{{deadline_uuid}}"> 
    <!-- end -->

    <div class="weui-row order-goods-list order-goods">
        <input type="hidden" name="" id="goods_uuid" value="{{productUuid}}">
        <a href="/wap/shop/detail?uuid={{productUuid}}" class="goods">
            <div class="image">
                <img src="{{main_img}}">
            </div>
            <div class="title">
                <span>{{product_name}}</span><br>
                <span class="label label-default">{{quality_info_name}}</span>
                <span>{{brand_info_brand_name}}</span>
            </div>
            <div class="price">￥{{product_price}}</div>
        </a>
    </div>
    <p class="status fs-11">账单状态：{{status}}</p>
    <div class="weui-row fen-table">
        <div class="weui-col-33 text-center "><p class="fs-15 mar-10 fw-800">¥{{amount_total}}</p><p class="fs-11 c999">应还金额</p></div>
        <div class="weui-col-33 text-center "><p class="fs-15 mar-10 fw-800 ccfa">¥{{amount_per}}</p><p   class="fs-11 c999">每期还款</p></div>
        <div class="weui-col-33 text-center "><p class="fs-15 mar-10 fw-800 c719">¥{{amount_left}}</p><p  class="fs-11 c999">待还金额</p></div>
    </div>
</script>
</div>
<div class="page2" id='page2'>
<script id="detailpage" type="text/html">
    <button class="bill {{status}} " data-uuid='{{uuid}}'>
        <div class="fs-13">  
            <span class="inco"></span>
            <span class='bill-text1'>第{{index}}期</span>
            <span class='bill-text'>{{data_text}}：{{data}}</span>
            <span class="bg-inco"></span>         
        </div>
    </button>
</script>
</div>
<div class="footer" id="footer1">
    <div class="weui-row weui-no-gutter">
        <div class="weui-col-40" style="background-color:#fff;">
            <a onclick="wehref()" class="block">查看订单</a>
        </div>
        <div class="weui-col-60 bg-black">
            <a onclick="submit()" class="block">立即还款</a>
        </div>
    </div>
</div>
<div class="footer" id="footer2">
    <div class="weui-row weui-no-gutter">
        <div class="weui-col-100  bg-black">
            <a onclick="wehref()" class="block">查看订单</a>
        </div>
    </div>
</div>


    <jsp:include page="/wap/js_file.jsp" />
    <script src="/resources/js/fn/zepto.js"></script>
    <script type="text/javascript" src="/resources/js/wap/li/jquery-weui-confirm.js"></script>
    <script src="/resources/js/fn/template.js"></script>
    <!-- <script type="text/javascript" src="/resources/js/wap/li/jquery-weui-confirm.js"></script> -->
    <!-- <script type="text/javascript" src='/resources/js/wap/instalment/plan.js'></script> -->
<script type="text/javascript">
// 页面加载部分
    info() 
 var data = {
    bill_uuid:GetQueryString('id')
    ,member_uuid:'${c_m.uuid}'
 }
 query(data)
 function query(data){
    $.post('/adapter/wap/instalment/getBillDetailList',JSON.stringify(data),function(ds){
        console.table(ds)
        var goodsList = ds.result.product_info
        var goddsdata = {
            productUuid:goodsList.uuid
            ,main_img:goodsList.main_img
            ,product_name:goodsList.product_name
            ,quality_info_name:goodsList.quality_info.name
            ,brand_info_brand_name:goodsList.brand_info.brand_name
            ,product_price:goodsList.price
            ,amount_total:ds.result.amount_total
            ,amount_per:ds.result.amount_per
            ,amount_left:ds.result.amount_left
            ,order_uuid:ds.result.order_uuid
            ,type:ds.result.type
            ,status:ds.result.status == 0 ? '还款中' : ds.result.status == 1 ? '已还清' :'已关闭'
            ,repay_desc: ds.result.provider_dto.repay_desc
            ,begin_repay_date: ds.result.provider_dto.begin_repay_date
            ,deadline_day: ds.result.provider_dto.deadline_day
            ,deadline_hour: ds.result.provider_dto.deadline_hour
            ,deadline_uuid: ds.result.provider_dto.uuid
            ,repay_name:ds.result.provider_dto.name
        }
        var html = template('goods',goddsdata)
        $('#page').append(html)  
        var detail = ds.result.detail_list
        for (var i = 0; i< detail.length; i++) {
           var detaildata = {
                status : detail[i].status == 0 ? 'billing' : detail[i].status == 1 ? '' :'billed'
                ,data_text : detail[i].status == 1 ? '还款日期' : '还款期限'
                ,index : detail[i].num
                ,data : detail[i].expire_date
                ,uuid: detail[i].uuid
            }
            console.log(detaildata)
            var html2 = template('detailpage',detaildata)
            $('#page2').append(html2) 
        }
        info() 
    })
 }
$(document).on('click','.billing',function(e){
    var $this = $(this)
    if($(this).hasClass('click')){  // 已经点击
        $(this).removeClass('click')
    }else{                          //没有点击
        $(this).addClass('click')
    }
})
$(document).on('click','.billed',function(e){
    var $this = $(this)
    if($(this).hasClass('click')){  // 已经点击
        $(this).removeClass('click')
    }else{                          //没有点击
        $(this).addClass('click')
    }
})

function info(){
    $('.billing').addClass('select')
    $('.billed').addClass('select')
    if($('.select').length == 0){
        $('#footer2').show()
        $('#footer1').hide()
    }else{
        $('#footer1').show()
        $('#footer2').hide()
    }
}

function submit(){
    if($('#repay_name').val() == '少铺分期'){
        shaopu()
    }else{
        var repay_name = $('#repay_name').val()
        var repay_desc = $('#repay_desc').val()
        var begin_repay_date = $('#begin_repay_date').val()
        var deadline_day = $('#deadline_day').val()
        var deadline_hour = $('#deadline_hour').val()
        $.confirm('本订单由『'+repay_name+'』提供分期服务，从'+begin_repay_date+'开始，请于每月'+deadline_day+'日'+deadline_hour+'点之前进入『'+repay_desc+'』进行还款。','','我知道','稍后还款',function(){
            
            },function(){
            
        })
    }
}

function shaopu(){
    if($('#type').val() == 0){
        if($('.click').length == 0){
            $.alert('请选择还款期数')
        }else if($('.select').eq(0).hasClass('click')){
        // 第一个已经选择
            var period = [] 
            $('.click').each(function(e){
                period.push($(this).attr('data-uuid'))
            })
            localStorage.setItem('period',period)
            window.location.href = '/wap/order/instalment_submit?id='+GetQueryString('id')
        }else{
        // 第一个为选择
            $.alert('所选期数之前有未还款项，请重新选择')
        }
    }else{
        $.alert('如您选择“自动扣款”，预计将于每月12日 18:00左右进行扣款，请确保绑定银行卡中余额充足；如您选择“手动还款”，请于每月12日 18:00前进入微信公众号“少铺分期助手”进行【快速还款】。')
    }
}


function wehref(){
    window.location.href = '/wap/order/detail?uuid=' + $('#order_uuid').val()
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
</script>

</body>
</html>