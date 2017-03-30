<%@ page language="java" contentType="text/html; charset=UTF-8" isELIgnored="false"
    pageEncoding="UTF-8"%>
<%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="utf-8">
    <jsp:include page="/wap/header.jsp" />
    <title>我的分期</title> 
    <style>
        .nav{
            background: #fff;
            margin-bottom: 1px;
        }
        .nav_click{
            display: inline-block;
            width: 49%;
            height: 35px;
            line-height: 35px;
            text-align: center;
            background-color: #fff;
        }
        .frame{
            position: relative;
        }
        .status{
            position: absolute;
            top: 1px;
            right: 10px;
            font-size: 10px;
        }
        .on{
            border-bottom: 1px solid #333;
        }
    </style>
</head>
<body>
<div class="nav">
    <a href="javascript:;" data-id='0' class="nav_click on" >近期待还</a>
    <a href="javascript:;" data-id='1' class="nav_click" >全部还款</a>

</div>
<div id="list">
    <script type="text/html" id="page">
        <div class="span-10">
            <div class="frame order-shop" onclick="window.location.href='/wap/instalment/detail?id={{seller_id}}'">
                        账单编号{{as_id}}<i class="icon-forword"></i>
            </div>
            <div class="frame">
                <div class="weui-row order-goods-list" >
                    <a class="goods" href="/wap/instalment/detail?id={{seller_id}}">
                        <div class="image"><img src="{{product_img}}"></div>
                        <div class="title">
                            <span>{{product_name}}</span><br>
                            <span class="label label-default">{{quality_name}}</span>
                            <span>{{brand_name}}</span>
                        </div>
                        <div class="price">￥{{product_amount}}</div>
                    </a>
                </div>
                <div class="order-time">
                    {{time}}
                </div>
                <p class="status">账单状态：{{status}}</p>
            </div>
        </div>
    </script>
</div>
<div class="no-data" id="no-data" >
    <img src="/resources/images/wap/icon_empty.png">
    <h4>暂时没有分期商品</h4>
    <p>可以去商城挑选心仪的商品</p>
    <a href="/wap/shop/house">继续逛逛</a>
</div>
<div class="weui-infinite-scroll" id="scroll_wait" style=""><div class="infinite-preloader"></div>正在加载...</div>
<div class="weui-infinite-scroll" id="scroll_over" style="display:none"><i class="weui_icon_success_no_circle"></i>全部加载完成</div>
<input type="hidden" id="member_uuid" name="member_uuid" value="${c_m.uuid}">
<jsp:include page="/wap/js_file.jsp" />
<script src="/resources/js/fn/template.js"></script>
<script>

    $(function () {
        var data = {
            type:0
            ,member_uuid: $('#member_uuid').val()
            ,page:1
            ,rows:10
        }
        queryData(data)
        function queryData(){
            $.post('/adapter/wap/instalment/getBillList',JSON.stringify(data),function(data){
                console.log(data)
                if(data.status == 0){
                    $('#scroll_wait').css('display','none')
                    var ds = data.result.bill_list
                    var page_ds = data.result.pageInfo
                    if( page_ds.totalReco == 0){
                        $('#no-data').css('display','block')
                    }else{
                         $('#no-data').css('display','none')
                        if( ds.length == 0){
                            $('#scroll_over').css('display','block')
                        }else{
                            for(var i =0;i < ds.length;i++){
                                var st = ds[i].status-0;
                                var obj = {
                                    seller_id:ds[i].uuid
                                    ,as_id:ds[i].bill_id
                                    ,product_img:ds[i].product_info.main_img_min
                                    ,brand_name:ds[i].product_info.brand_info.brand_name
                                    ,quality_name:ds[i].product_info.quality_info.name
                                    ,product_name:ds[i].product_info.product_name
                                    ,product_amount:ds[i].product_info.price
                                    ,status:ds[i].status == 0 ? '还款中' : ds[i].status == 1 ? '已还清' : '已关闭'
                                }
                                console.log(obj)
                                var html = template('page',obj)
                                $('#list').append(html)
                            }
                        }
                    }
                }
            })
        }
        $(window).scroll(function () {
            if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
                $('#scroll_wait').css('display','block');
                data.page = data.page+1
                queryData(data)
            }
        });
        $('.nav_click').on('click',function(e){
            $('#list div').remove()
            $('.nav_click').removeClass('on')
            $(this).addClass('on')
            data.type = $(this).attr('data-id')
            queryData(data)
        })
    })

</script>
</body>
</html>