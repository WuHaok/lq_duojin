/**
 * Created by ydz on 17/1/18.
 */
var clearinput = function(){
    $('input').blur()
};
//点击下一步
$('#goback').on('click',function(){
    window.history.back()
});
//点击问号
$("#yiwen").click(function(){
    $.alert('首期还款时间为下单后顺延30天，如遇特殊月份，请以每月还款提醒短信为准；用户可以选择在还款期限前主动发起还款操作；也可以在保证还款卡金额充足的前提下，由服务方在还款期限当天自动扣款')
});
$("#qianQu").click(function(){
    $('#qianMin').hide();
    $('#qianMinBox').hide();
});
$('.xuanZe').click(function () {
    $('.xuanZe .icon-weixuanzhong').toggleClass('icon-xuanzhong');
});
//点击编辑
$("#bianji").click(function(){
    $("#phone2").removeAttr("disabled","disabled");
    $("#phone2").removeAttr("style","border:none");
    $("#bank_num").removeAttr("disabled","disabled");
    $("#bank_num").removeAttr("style","border:none");
    $("#bank_name").removeAttr("style","border:none");
    $("#bank_name").removeAttr("disabled","disabled");
    $("#getcode").show();
    $("#bianji").hide()
});
// 页面加载
$(function(){
    $('#bank_name').val(0);
    init()
});
function init(){
    var querydata = {
        order_uuid : GetQueryString('order_id')
    };
    post('/adapter/wap/order/getTNAuth',JSON.stringify(querydata),function(ds){
        if(ds.status == 0){
            var l = ds.result.base;
            var r = ds.result.repayment;
            $('#name').val(l.name);
            $('#card_id').val(l.card_id);
            //若已经绑卡
            if(r.status==1){
                $('#bank_name').val(r.bank_name);
                $('#bank_num').val(r.bank_num);
                $('#phone2').val(r.mobile);
                $("#phone2").attr("disabled","disabled");
                $("#phone2").attr("style","border:none");
                $("#bank_num").attr("disabled","disabled");
                $("#bank_num").attr("style","border:none");
                $("#bank_name").attr("style","border:none");
                $("#bank_name").attr("disabled","disabled");
                $("#getcode").hide();
                $("#bianji").show()
            }
        }else if(ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }
    });
}
//点击安全校验
$('#confirm').click(function(){
    var data = {
        order_uuid : GetQueryString('order_id')
        //order_uuid : "8aadab1958be57b70158cd031dee167b"
        ,bank_name:$('#bank_name').val()
        ,bank_num:$('#bank_num').val()
        ,mobile:$('#phone2').val()
    };
    var moWei=data.mobile.substring(7);
    if(data.bank_name=='' || data.bank_name=='0'){
        $.alert('请选择开户银行')
    }else if(data.bank_num == ''){
        $.alert('请填写银行卡号')
    }else if(data.mobile == ''){
        $.alert('请填写手机号')
    }else if(!/^\d{16}|\d{19}$/i.test(data.bank_num)){
        $.alert('银行卡号格式错误')
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(data.mobile)){
        $.alert('手机号格式错误')
    }else if(!$(".icon-weixuanzhong").hasClass("icon-xuanzhong")){
        $.alert('请勾选同意协议')
    }else{
        //向后台提交数据看数据是否正确
        console.log(data);
        $("#loading").show();
        $("#loadingBox").show();
        post('/adapter/wap/order/tnBindCard',JSON.stringify(data),function(ds){
            console.log(ds);
            if(ds.status == 0){
                if(!ds.result.flag){
                    $("#loading").hide();
                    $("#loadingBox").hide();
                    $("#tn-uuid").val(ds.result.uuid);
                    //如果正确则发送验证码
                    $.prompt('请输入手机尾号'+moWei+'收到的短信验证码','安全效验',
                        function (input) {
                            if(input!=''){
                                $("#loading").show();
                                $("#loadingBox").show();
                                var inputdata={
                                    order_uuid:GetQueryString('order_id'),
                                    tn_repayment_uuid:ds.result.uuid,
                                    mobile_code:input
                                };
                                yanZhen(inputdata)
                            }
                            else if(input==''){
                                $.alert('验证码为空')
                            }
                        },
                        function () {
                            return
                        }
                    );
                }else{
                    signa()
                }
            }else if(ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else{
                $("#loading").hide();
                $("#loadingBox").hide();
                $.alert(ds.message_detail)
            }
        })
    }
});
//验证验证码
function yanZhen(inputdata){
    post('/adapter/wap/order/tnBindCardConfirm',JSON.stringify(inputdata),function(ds){
        if(ds.status == 0){
            if(ds.result.flag){
                $("#phone2").attr("disabled","disabled");
                $("#phone2").attr("style","border:none");
                $("#bank_num").attr("disabled","disabled");
                $("#bank_num").attr("style","border:none");
                $("#bank_name").attr("style","border:none");
                $("#bank_name").attr("disabled","disabled");
                $("#getcode").hide();
                $("#bianji").show();
                //手动签名开始
                signa()
            }
        }else if(ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }else{
            $("#loading").hide();
            $("#loadingBox").hide();
            $.alert(ds.message_detail)
        }
    })
}

function signa(){
    $("#loading").hide();
    $("#loadingBox").hide();
    $('#qianMin').show();
    $('#qianMinBox').show();
    var dWidth = document.getElementById('signature').style.width;
    var $sigdiv = $("#signature");
    $sigdiv.jSignature({height:200,width:dWidth,lineWidth:"1",signatureLine:false});
    //点击重置按钮
    $("#reset").click(function(){
        $sigdiv.jSignature("reset"); //重置画布，可以进行重新作画.
        $("#someelement").html("");
    });
    //点击提交按钮
    $("#yes").click(function(){
        $("#loading").show();
        $("#loadingBox").show();
        //将画布内容转换为图片
        var datapair = $sigdiv.jSignature("getData", "image");
        var i = new Image();
        i.src = "data:" + datapair[0] + "," + datapair[1];
        $(i).appendTo($("#someelement")); // append the image (SVG) to DOM.
        //上传图片
        var imgData={
            base64_list:[
                {base64:$("#someelement img").attr('src')}
            ]
        };
        post('/adapter/wap/upload/viaBase64', JSON.stringify(imgData), function (ds) {
            $("#someelement img").attr('src',ds.result.img_list);
            var qiandata={
                order_uuid:GetQueryString('order_id'),
                sign_img:$("#someelement img").attr('src')
            };
            //调用同牛分期订单提交成功后，传递手签照片的接口
            post('/adapter/wap/order/authTNStep4',JSON.stringify(qiandata),function(ds){
                if(ds.status==0){
                    window.location.href = '../../../order/list.html?order_status=5'
                }else{
                    $("#loading").hide();
                    $("#loadingBox").hide();
                    $('#qianMin').hide();
                    $('#qianMinBox').hide();
                    $.alert(ds.message_detail)
                }
            })
        });
    });
}
//签名功能测试页面
// $('#confirm').click(function(){
//     $.prompt('请输入手机尾号3333收到的短信验证码','安全效验',
//         function (input) {
//             if(input!=''){
//                 signa()
//             }
//             else if(input==''){
//                 $.alert('验证码为空')
//             }
//         },
//         function () {
//             return
//         }
//     );
// });

// gongju
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}