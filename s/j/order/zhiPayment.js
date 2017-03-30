/*** Created by Administrator on 2017/1/3.*/
$(function(){
    // 页面加载部分
    var data = {
        bill_uuid: GetQueryString("sell_id"),
        member_uuid: user.uuid
    };
    console.log(data);
    post(
        '/adapter/wap/instalment/getBillDetailList',
        JSON.stringify(data),
        function (ds) {
            console.log(ds);
            var detail = ds.result.detail_list;
            var period = localStorage.getItem('period').split(",");
            var html="";
            $('.acctu').text("账单编号:"+ds.result.bill_id);
            $('.hintCopy').html("请输入手机尾号"+ds.result.repayment_bank_mobile+"收到的短信验证码");
            $('#order_uuid').val(ds.result.order_uuid);
            var zhifudata = {
                code:ds.result.provider_dto.name  , //还款类型
                codetypetn:ds.result.provider_dto.name=='同牛分期'?"block":"none",
                codetype:ds.result.provider_dto.name=='同牛分期'?"none":"block",
                repayment_bank_name:ds.result.repayment_bank_name, //银行名称
                repayment_bank_card:ds.result.repayment_bank_card //银行后四位
            };
            var zhifuhtml = template('zhiFutypeList',zhifudata);
            $('.imgClass').append(zhifuhtml);
            for (var i = 0; i < detail.length; i++) {
                for(var j=0;j<period.length;j++){
                    if(detail[i].uuid==period[j]){
                        var listdata = {
                            status: detail[i].status - 0 == 0 ? 'billing' : detail[i].status == 1 ? '' : 'billed',
                            index: detail[i].num,   //期数
                            data: detail[i].expire_date ,   //截止时间
                            uuid: detail[i].uuid,
                            pic: ds.result.amount_per
                            ,penaltyClass: detail[i].penalty==null || detail[i].penalty==0?"none":"block"
                            ,penaltydaClass: detail[i].penalty==null || detail[i].penalty==0?"":"zhiNaBox"
                            ,penalty: detail[i].penalty
                        };
                        html =template('List', listdata);
                         $('.qiShu').append(html)
                    }
                }
            }
            var huankuan = 0;
            for(var i=0;i<$(".jiaGe").length;i++){
                //huankuan= $(".jiaGe").length*$(".jiaGe")[i].innerHTML
                huankuan=huankuan+Number($(".jiaGe")[i].innerHTML)
            }
            $('.jinE').text("￥"+parseFloat(huankuan.toFixed(3)));
            if(liuType=="weixin"){
                $(".imgClass img").attr("src","../s/img/weixin.png");
            }
            else{
                $(".imgClass img").attr("src","../s/img/zhifubao.png");
            }
        });
    $(".tiShi_p2").click(function(){
        $("#tiShi_div").hide();
        $("#tiShi").hide();
    });
        $(".zhiFu").click(function (){
            $("#loading").show();
            $("#loadingBox").show();
                if($("#codeType").val()=="同牛分期"){
                    $("#loading").hide();
                    $("#loadingBox").hide();
                    $(".hintHeader").html("确认支付"+$(".jinE").html()+"元");
                    $("#hintBig").show();
                    $("#hintBox").show()
                }
                else{
                var period = localStorage.getItem('period').split(",");
                var date={
                    instalment_uuids: period,
                    member_uuid: user.uuid,
                    payway :liuType=="weixin"?"wx":"ali",
                    return_url:lined+"/order/allBills.html?sell_id="+GetQueryString("sell_id"),
                    show_url:lined+"/order/zhangDetail.html?sell_id="+GetQueryString("sell_id"),
                    openid:liuType=="weixin"?GetQueryString("openid"):""
                };
                post('/adapter/wap/instalment/initPay', JSON.stringify(date), function (ds) {
                    if(ds.status == 0){
                        if(browser() == 'weixin'){
                            // console.log(ds)
                            $("#loading").hide();
                            $("#loadingBox").hide();
                            startWXPay(ds.result)
                        }else{
                            $("#loading").hide();
                            $("#loadingBox").hide();
                            window.location.href = ds.result.signedUrl
                        }
                    }else{
                        $("#loading").hide();
                        $("#loadingBox").hide();
                        console.log(ds.message_detail);
                        $("#tiShi").show();
                        $(".tiShi_span2").html(ds.message_detail);
                        $("#tiShi_div").show();
                    }
                });
            }
        });
    $("#yanZheng").on('click',function(){

        var data={
            bill_uuid: GetQueryString("sell_id"),
            member_uuid: user.uuid
        };
        post('/adapter/wap/instalment/getTNValiCode',JSON.stringify(data),function(ds){
            if (ds.status == 0) {
                var $this = $(this);
                var s = 60, t;
                times();
                function times(){
                    s--;
                    $('#yanZheng').attr('disabled','disabled' );
                    $('#yanZheng').text( s +'s')
                    t = setTimeout(times, 1000);
                    if ( s <= 0 ){
                        s = 60;
                        clearTimeout(t);
                        $('#yanZheng').removeAttr('disabled' );
                        $('#yanZheng').text('获取验证码')
                    }
                }

            }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else{
                $("#tiShi").show();
                $(".tiShi_span2").html(ds.message);
                $("#tiShi_div").show();

            }
        })
    });
    $("#quxiao").on('click',function(){
        $("#hintBig").hide();
        $("#hintBox").hide()
    });
    $("#queren").on('click',function(){
        $("#loading").show();
        $("#loadingBox").show();
        var period = localStorage.getItem('period');
        localStorage.setItem('payway','instalment');
        if($("#yanzhengtext").val()==""){
            $("#loading").hide();
            $("#loadingBox").hide();
            $("#hintBig").hide();
            $("#hintBox").hide();
            $("#tiShi").show();
            $(".tiShi_span2").html("验证码不允许为空");
            $("#tiShi_div").show();
        }else{
            var data={
                bill_detail_uuid:period
                ,member_uuid:user.uuid
                ,verify:$("#yanzhengtext").val()
            };
            console.log(data);
            post('/adapter/wap/instalment/repayment2TN',JSON.stringify(data),function(ds){
                if (ds.status == 0) {
                    if(ds.result.flag){
                        window.location.href = '../../../order/allBills.html'
                    }
                }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                    window.location.href = '../../../personal/land.html';
                }else{
                    $("#loading").hide();
                    $("#loadingBox").hide();
                    $("#hintBig").hide();
                    $("#hintBox").hide();
                    $("#tiShi").show();
                    $(".tiShi_span2").html(ds.message);
                    $("#tiShi_div").show();
                }
            })
        }

    })
});