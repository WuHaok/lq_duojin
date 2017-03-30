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
    <link rel="stylesheet" type="text/css" href="/resources/css/wap/instalment/submit.css"> 
</head>
<body>
<input type="hidden" name="" id="order_uuid" value="">
<p class="list">账单编号：<span id="bill_id">00000000000000000</span></p>
<div id="page">
<script type="text/html" id="List">
    <p class="list li {{uuid}}">
        <span class="pull-left">第{{index}}期</span>
        <span class="pull-left marl-35">¥<span class="pic">{{pic}}</span></span>
        <span class="pull-right">还款期限：{{data}}</span>
    </p>
</script>
</div>
<div class="text-center huankuan-box {{uuid}}">
    <p class="huankuan-t">还款金额</p>
    <p class="huankuan">¥  <span id="huankuan"></span></p>
</div>
</div>

<div class="frame">
        <h4 class="title">支付方式</h4>
    </div>
    <ul class="pay-style span-10">
        <li class="check" data-pay-style="wx"><img
            src="/resources/images/wap/icon_tanchu_wechatpay.png"> <span>微信支付</span>
        </li>
        <!--   <li data-pay-style="ali">
            <img src="/resources/images/wap/icon_tanchu_zhifubao.png">
            <span>支付宝</span>
        </li>
        <li data-pay-style="union">
            <img src="/resources/images/wap/icon_tanchu_unionpay.png">
            <span>银联支付</span>
        </li> -->
    </ul>
</div>

<div class="footer">
    <div class="weui-row weui-no-gutter">
        <div class="weui-col-100 bg-black">
            <a onclick="submit()" class="block">支付</a>
        </div>
    </div>
</div>

    <jsp:include page="/wap/js_file.jsp" />
    <script src="/resources/js/weixinpay.js"></script>
    <script type="text/javascript" src="http://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
    <script src="/resources/js/fn/template.js"></script>
    <script type="text/javascript" src='/resources/js/wap/instalment/plan.js'></script>
<script type="text/javascript">
// 页面加载部分
 var data = {
    bill_uuid:GetQueryString('id')
    ,member_uuid:'${c_m.uuid}'
 }
 query(data)
 function query(data){
    $.post('/adapter/wap/instalment/getBillDetailList',JSON.stringify(data),function(ds){
        var detail = ds.result.detail_list
        $('#bill_id').text(ds.result.bill_id)
        $('#order_uuid').val(ds.result.order_uuid)
        for (var i = 0; i< detail.length; i++) {
           var listdata = {
                status : detail[i].status-0 == 0 ? 'billing' : detail[i].status == 1 ? '' :'billed'
                ,index : detail[i].num
                ,data : detail[i].expire_date
                ,uuid: detail[i].uuid
                ,pic : ds.result.amount_per
            }
            var html = template('List',listdata)
            $('#page').append(html) 
        }
        $('.li').hide()
        var period = localStorage.getItem('period').split(",") 
        var huankuan = 0;
        for(var i=0;i<period.length;i++){
            $('.'+period[i]).show()
            huankuan += ($('.'+period[i] +' .pic').text()-0)
        }
        $('#huankuan').text(huankuan)
    })
}
function submit(){
    var period = localStorage.getItem('period')
    alert(period)
    $.post("/wap/order/initPay?instalment_uuid="+period, function(data) {
        if (data.status == "0") {
            startWXPay(data);
            order_uuid = data.order_uuid;
        } else {
            $.alert(data.message)
        }
    });
}

function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
</script>

</body>
</html>