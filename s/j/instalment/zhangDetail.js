/*** Created by Administrator on 2017/1/2.*/
$(function(){
    info();
    var date={
        bill_uuid:GetQueryString("sell_id")!='null'?GetQueryString("sell_id"):null,
        order_uuid:GetQueryString("order_id"),
        member_uuid:user.uuid
    };
    console.log(date);
    post("/adapter/wap/instalment/getBillDetailList",JSON.stringify(date),function(ds){
            if(ds.status==0){
                if(ds.result.status==1){
                    $('#footered').show();
                }else{
                    $('#footer').show();
                }
                console.log(ds);
                var resultObj={
                    fenQiBiao:ds.result.uuid,
                    bianHao:ds.result.bill_id,//账单
                    statuClass:ds.result.status==0?"huanKuan":ds.result.status==1?"huanQing":"guanBi",//样式
                    status:ds.result.status==0?"还款中":ds.result.status==1?"已还清":"关闭",//状态
                    chenSe:ds.result.product_info.quality_info.name,     //成色
                    brand_name:ds.result.product_info.brand_info.brand_name, //品牌名称
                    product_name:ds.result.product_info.product_name, //商品名称
                    main_img:ds.result.product_info.main_img+"-dj1",//商品图片
                    price:ds.result.product_info.price,//商品价格
                    amount_total:ds.result.amount_total,//应还金额
                    amount_per:ds.result.amount_per,//每期余额
                    can_repay:ds.result.provider_dto.can_repay==0?"none":"block",
                    canRepay:ds.result.provider_dto.can_repay,
                    amount_left:ds.result.provider_dto.can_repay==0?"":ds.result.amount_left,          //待还金额
                    type: ds.result.detail_list[0].type,//判断类型
                    repay_desc: ds.result.provider_dto.repay_desc,   //还款渠道
                    repay_name: ds.result.provider_dto.name,//服务商名字
                    //can_repayed:ds.result.provider_dto.name=='同牛分期'?'true':'flase',
                    order_uuid: ds.result.order_uuid,//订单标识
                    begin_repay_date: ds.result.provider_dto.begin_repay_date,//开始还款时间
                    deadline_day: ds.result.provider_dto.deadline_day, //截止日
                    deadline_hour: ds.result.provider_dto.deadline_hour,//截止时
                    deadline_uuid: ds.result.provider_dto.uuid,//服务商标识
                    code:ds.result.provider_dto.code   //服务商代码
                };
                var header=template("scriptObj",resultObj);
                $(".header").append(header);
                var goodList=ds.result.detail_list;
                var qiShu="";
                for(var i=0;i<goodList.length;i++){
                    var resultXun={
                        num:goodList[i].num,   //期数
                        expire_date:goodList[i].expire_date,//还款日期
                        huanZhuang:ds.result.provider_dto.can_repay==0?"weizhi@2x":goodList[i].status==0?"daihuan@2x":goodList[i].status==1||goodList[i].status==4?"yizhifu@2x":goodList[i].status==3?"yuqi@3x":"weizhi",
                        huanImags:ds.result.provider_dto.can_repay==0||goodList[i].status==1||goodList[i].status==4?"wanChen":"weiXuan",
                        amount_per:ds.result.amount_per,
                        penaltyClass: goodList[i].penalty == null || goodList[i].penalty == 0?"none":"block",
                        penaltydaClass: goodList[i].penalty == null || goodList[i].penalty==0?"":"height:1.5rem;margin-top: .6rem;",
                        penalty: goodList[i].penalty,
                        uuid: goodList[i].uuid
                    };
                    qiShu=qiShu+template("scriptData",resultXun);
                }
                $(".qiShu").append(qiShu);
                info();
                for(var i=0;i<$(".select").length;i++){
                    $(".select")[i].ord=i+1;
                    $(".select")[i].onclick=function(){
                        if($('#repay_name').val() == '同牛分期'){
                            $(".select").eq(0).toggleClass('xuanZhong');
                            for(var i=1;i<this.ord;i++){
                                $("#tiShi").show();
                                $(".tiShi_span2").html('请先还完'+$('.select').eq(0).find('.list1').html());
                                $("#tiShi_div").show();
                            }
                        }else{
                            if(!$(this).hasClass("xuanZhong") || $(".xuanZhong").length>(this.ord)){
                                for(var i=0;i<this.ord;i++){
                                    $(".select").eq(i).addClass('xuanZhong');
                                }
                                for(var i=this.ord;i<$(".select").length;i++){
                                    $(".select").eq(i).removeClass('xuanZhong');
                                }
                            }else if($(this).hasClass("xuanZhong")){
                                $(this).removeClass('xuanZhong');
                            }
                        }

                    }
                }
            }
            else if(ds.status==600){
                s_href.set(curr_href);
                window.location.href = '../personal/land.html';
            }else if(ds.message_detail=='用户标示不允许为空'){
                $("#tiShi").show();
                $(".tiShi_span2").html(ds.message_detail);
                $("#tiShi_div").show();
            }
        }
    );
    $(".tiShi_p2").click(function(){
        $("#tiShi_div").hide();
        $("#tiShi").hide();
    });
    $(".tongZhi_span3").click(function(){
        $("#tongZhi_div").hide();
        $("#tiShi").hide();
    });
    $(".tongZhi_span4").click(function(){
        $("#tongZhi_div").hide();
        $("#tiShi").hide();
    });
    $(".chaKan").click(function(){
            window.location.href = 'detail.html?id=' + $('#order_uuid').val()
        }
    );
    function info() {
        $('.xuanZhong').addClass('select');
        $('.weiXuan').addClass('select')
        if($('#repay_name').val()=='同牛分期'){
            $('#meiQiObj').hide();
        }
    }
    $(".liHuan").click(function() {
        if(!GetQueryString('huanType')){
            if ($('#canRepay').val()==1) {
                if ($('#type').val() == 0) {
                    if ($('.xuanZhong').length == 0) {
                        $("#tiShi").show();
                        $(".tiShi_span2").html("请选择还款期数");
                        $("#tiShi_div").show();
                    }
                    else if ($('.select').eq(0).hasClass('xuanZhong')) {
                        // 第一个已经选择
                        var period = [];
                        $('.xuanZhong').each(function (e) {
                            period.push($(this).attr('data-uuid'))
                        });
                        localStorage.setItem('period', period);
                        var liuType=browser();
                        if(liuType=='liulanqi'){
                            window.location.href = 'zhiPayment.html?sell_id=' + $("#fenQiBiao").val()+'&order_id='+GetQueryString("order_id")+"&_dd="+parseInt(Math.random()*1000);

                        }else{
                            window.location.href = 'zhiPayment.html?sell_id=' + $("#fenQiBiao").val()+'&order_id='+GetQueryString("order_id");
                        }
                    } else {
                        // 第一个为选择
                        $("#tiShi").show();
                        $(".tiShi_span2").html("所选期数之前有未还款项，请重新选择");
                        $("#tiShi_div").show();
                    }
                }
                else {
                    $("#tiShi").show();
                    $(".tiShi_span2").html("如您选择“自动扣款”，预计将于每月12日 18:00左右进行扣款，请确保绑定银行卡中余额充足；如您选择“手动还款”，请于每月12日 18:00前进入微信公众号“少铺分期助手”进行【快速还款】。");
                    $("#tiShi_div").show();
                }
            } else {
                var repay_name = $('#repay_name').val();
                var repay_desc = $('#repay_desc').val();
                var begin_repay_date = $('#begin_repay_date').val();
                var deadline_day = $('#deadline_day').val();
                var deadline_hour = $('#deadline_hour').val();
                $("#tiShi").show();
                $(".tongZhi_span2").html('本订单由『' + repay_name + '』提供分期服务，从' + begin_repay_date + '开始，请于每月' + deadline_day + '日' + deadline_hour + '点之前进入『' + repay_desc + '』进行还款。');
                $("#tongZhi_div").show();
            }
        }else{
            $("#tiShi").show();
            $(".tiShi_span2").html("卖家未发货，暂不可还款");
            $("#tiShi_div").show();
        }
    })
});