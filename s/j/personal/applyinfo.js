var user = {
    uuid: GetQueryString('auth_uuid')
    ,token : GetQueryString('auth_token')
};
var line;
function linse() {
    var cuf = window.location.href.split('/')[2];
    if(cuf == "wap.shopuu.com"){
        line = 'http://dj.shopuu.com';
    }else {
        line = 'https://dj-qa.shopuu.com';
    }
    return line
}
linse();
function post(url,data,callback) {
    $.ajax({
        type: 'POST',
        url: line+url,
        data: data,
        success: callback,
        beforeSend:function (request) {
            request.setRequestHeader('token',user.token)
        }
    });
}
$("#shop").cityPicker({
    title: "实体店地址"
});
//页面
var box0 = $('#box0');
var box1 = $('#box1');
var box3 = $('#box3');
var box4 = $('#box4');
var box5 = $('#box5');
$('#submit0').on('click',function(){
    box0.hide();
    box1.show();
    $('#imgList').attr('src','../s/img/renZhen2@2x.png')
});
// box0.hide();
//  box1.hide();
//  box3.hide();
// box4.show();
// box5.show();
// $('.navImg').hide()
// $('#submit1').on('click',function(){
//     box1.hide();
//     box3.show();
//     $('#imgList').attr('src','../s/img/renZhen4@2x.png')
// });
// $('#submit3').on('click',function(){
//     box3.hide();
//     box4.show();
//     if($('#shop_type .click').closest('.shop').val() == 1){
//         $('#box4 .yiHao').addClass('clicked');
//         $('#box4 .erHao').addClass('clicked');
//         $('#box4 .sanHao').addClass('click');
//         $('#box4 .sanHao').addClass('clicking')
//     }else if($('#shop_type .click').closest('.shop').val() == 0 && $('#zhanghu_type .click').closest('.shop').val() == 0){
//         $('#box4 .yiHao').addClass('clicked');
//         $('#box4 .erHao').addClass('click');
//         $('#box4 .erHao').addClass('clicking');
//         $('#box4 .sanHao').addClass('clicking')
//     }else{
//         $('#box4 .yiHao').addClass('click');
//         $('#box4 .yiHao').addClass('clicking');
//         $('#box4 .erHao').addClass('clicking');
//         $('#box4 .sanHao').addClass('clicking')
//     }
//     $('#imgList').attr('src','../s/img/renZhen3@2x.png')
// });
// 页面跳转 判断
$('#submit1').on('click', function () {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var $tel = $('#mobile').val();
    var fz = $('#imgFZ img').attr('src');
    var ff = $('#imgFF img').attr('src');
    if ($('#real_name').val() == '') {
        $.alert('请您输入真实姓名')
    } else if (!reg.test($('#card_id').val())) {
        $.alert("请检查身份证号码");
    }else if (fz == '' || fz == undefined) {
        $.alert('请上传身份证照片(正面)')
    } else if (ff == '' || ff == undefined) {
        $.alert('请上传身份证照片(背面)')
    } else if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test($tel)) {
        $.alert('请检查手机号码')
    } else if($("#yanZheng").val()==""){
        $.alert('请输入验证码')
    }else {
        var datastep1 = {
            member_uuid: user.uuid
            , real_name: $('#real_name').val() // 姓名
            , gender: $('#gender .click').closest('.sex').val()  //性别 0女 1男
            , card_id: $('#card_id').val() //身份证号
            , mobile: $('#mobile').val()//手机号
            , card_img_facade: $('#imgFZ img').attr('src')
            , card_img_back: $('#imgFF img').attr('src')
            ,mobile_code:$("#yanZheng").val()
        };
        post('/adapter/wap/member/authApplyStep1', JSON.stringify(datastep1), function (ds) {
            if (ds.status == 0) {
                if (ds.result.flag == true) {
                    $('#apply_uuid').val(ds.result.uuid);
                    box1.hide();
                    box3.show();
                    $('#imgList').attr('src','../s/img/renZhen4@2x.png')
                } else {
                    $.alert(ds.message_detail)
                }
            }
            else{
                $.alert(ds.message_detail)
            }
        })
    }
});
$('#submit3').on('click', function () {
    var yy = $('#imgYY img').attr('src');
    var rz = $('#imgRZ img').attr('src');
    if($('#shop').val().split("0")==""){
        $.alert('请选择实体店地址')
    } else if($('#shop_detail').val()==""){
        $.alert('请选择实体店详细地址')
    }else if ($('#shop_type .click').closest('.shop').val() == 0 && $('#yinye').val()=='') {
        $.alert('营业执照编号不能为空')
    }else if ($('#shop_type .click').closest('.shop').val() == 0 &&(yy == '' || yy == undefined)) {
        $.alert('请上传营业执照照片')
    } else if ($('#shop_type .click').closest('.shop').val() == 0 && $('#zhanghu_type .click').closest('.shop').val() == 1 &&(rz == '' || rz == undefined)) {
        $.alert('请上传开户许可证照片')
    } else {
        var datastep2 = {
            apply_uuid: $('#apply_uuid').val()
            , member_uuid: user.uuid
            , shop_type: $('#shop_type .click').closest('.shop').val() // 0 实体 1 工作室
            , shop_provice: ''
            , shop_city: ''
            , shop_area: ''
            , shop_detail: $('#shop_detail').val()
            ,business_num:$('#yinye').val()
            , business_img: $('#imgYY img').attr('src')//营业执照
            , has_account: $('#zhanghu_type .click').closest('.shop').val()
            , account_img: $('#imgRZ img').attr('src')
        };
        var shop = $('#shop').val().split(" ");
        datastep2.shop_provice = shop[0];
        datastep2.shop_city = shop[1];
        datastep2.shop_area = shop[2];
        post('/adapter/wap/member/authApplyStep2', JSON.stringify(datastep2), function (ds) {
            if (ds.status == 0) {
                if($('#shop_type .click').closest('.shop').val() == 1){
                    $('#box4 .yiHao').addClass('clicked');
                    $('#box4 .erHao').addClass('clicked');
                    $('#box4 .sanHao').addClass('click');
                    $('#box4 .sanHao').addClass('clicking')
                }else if($('#shop_type .click').closest('.shop').val() == 0 && $('#zhanghu_type .click').closest('.shop').val() == 0){
                    $('#box4 .yiHao').addClass('clicked');
                    $('#box4 .erHao').addClass('click');
                    $('#box4 .erHao').addClass('clicking');
                    $('#box4 .sanHao').addClass('clicking')
                }else{
                    $('#box4 .yiHao').addClass('click');
                    $('#box4 .yiHao').addClass('clicking');
                    $('#box4 .erHao').addClass('clicking');
                    $('#box4 .sanHao').addClass('clicking')
                }
                box3.hide();
                box4.show();
                $('#imgList').attr('src','../s/img/renZhen3@2x.png')
            } else {
                $.alert(ds.message_detail)
            }
        })
    }
});
$('#submit4').on('click', function () {
    var wechat_id = $('#wechat_id').val();
    var period_year = $('#period_year').val();
    if (wechat_id == '') {
        $.alert('微信号不能为空')
    } else if (period_year == '') {
        $.alert('从业年限不能为空')
    } else if ($('#duoJin_type .click').closest('.shop').val()=='' || $('#duoJin_type .click').closest('.shop').val()==undefined) {
        $.alert('请选择申请开通的分期服务')
    } else {
        $('.navImg').hide();
        box4.hide();
        box5.show();
        var dWidth = document.getElementById('signature').style.width;
        $("#signature").jSignature({height:265,width:dWidth,lineWidth:"1",signatureLine:false});
    }
});
// var isQian=false;
// $('#signature').on('mousemove',function(){
//     isQian=true
// })
$('#submit5').on('click',function() {
    //将画布内容转换为图片
    var datapair = $("#signature").jSignature("getData", "image");
    var i = new Image();
    i.src = "data:" + datapair[0] + "," + datapair[1];
    $(i).appendTo($("#someelement")); // append the image (SVG) to DOM.
    //上传图片
   // if (!isQian) {
   //     $.alert('请进行手写签名')
 //   }else {
    var imgData = {
        base64_list: [
            {base64: $("#someelement img").attr('src')}
        ]
    };
    post('/adapter/wap/upload/viaBase64', JSON.stringify(imgData), function (ds) {
        $("#someelement img").attr('src', ds.result.img_list);
        var datastep3 = {
            apply_uuid: $('#apply_uuid').val()
            , member_uuid: user.uuid
            , wechat_id: $('#wechat_id').val()
            , period_year: $('#period_year').val() //年限
            , product_type: $('#duoJin_type .click').closest('.shop').val()
            , sale_manager_id: $('#xiaoshou_id').val()
            , sign_img: $("#someelement img").attr('src')
        };
        post('/adapter/wap/member/authApplyStep3', JSON.stringify(datastep3), function (ds) {
            if (ds.status == 0) {
                window.location.href = '/personal/succes.html'
            } else {
                $.alert(ds.message_detail)
            }
        })
    });
//}

})
// 基础操作
$("#reset").click(function(){
    $("#signature").jSignature("reset"); //重置画布，可以进行重新作画.
    $("#someelement").html("");
    // isQian=false;
});
//点击 性别
$('#gender .sex').on('click', function (e) {
    var $this = $(this);
    $('#gender  .inco').removeClass('click');
    $this.children('.inco').addClass('click')
});
//点击签名页面取消
$('.quxiao').on('click',function(){
    $('.navImg').show()
    box5.hide()
    box4.show()
})
// 是否有实体店
$('#shop_type .shop').on('click', function (e) {
    var $this = $(this);
    $('#shop_type  .inco').removeClass('click');
    $this.children('.inco').addClass('click');
    if ($('#shop_type .click').closest('.shop').val() == 0) {
        $('.shopaddr').show();
        $(".yingyeId").show();
        $(".zhangHuaddr").show();
        $(".zhangHuType").show();
        $(".red").show();
        $('.shopchange label').text('实体店地址')
    } else {
        $('.shopaddr').hide();
        $(".yingyeId").hide();
        $(".zhangHuaddr").hide();
        $(".zhangHuType").hide();
        $(".red").hide();
        $('.shopchange label').text('工作室地址')
    }
});
//是否有对公账户
$('#zhanghu_type .shop').on('click', function (e) {
    var $this = $(this)
    $('#zhanghu_type  .inco').removeClass('click');
    $this.children('.inco').addClass('click');
    if ($('#zhanghu_type .click').closest('.shop').val() == 1) {
        $(".zhangHuaddr").show()
    } else {
        $(".zhangHuaddr").hide()
    }
});
//选择朵金分期类型
$('#duoJin_type .shop').on('click', function (e) {
    var $this = $(this)
    if($(this).find('.inco').hasClass('clicking')){
        if($('#duoJin_type  .inco').hasClass('clicked')){
            if($('.clicked').length==2){
                $this.children('.inco').toggleClass('click')
            }else{
                $('#duoJin_type  .inco').removeClass('click');
                $this.children('.inco').addClass('click')
            }
        }else{
            $('#duoJin_type  .inco').removeClass('click');
            $this.children('.inco').addClass('click')
        }
    }

});

//上传身份证正面面照片
function imgChangeFZ(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgFZ img').remove();
        if (dataimg.length == 1) {
            $('#imgFZ').append('<img class="img lookbigimg" src=' + dataimg + '-dj4>')
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
//上传身份证反面照片
function imgChangeFF(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgFF img').remove();
        if (dataimg.length == 1) {

            $('#imgFF').append('<img class="img lookbigimg" src=' + dataimg + '-dj4>');
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
                $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
//营业执照照片
function imgChangeYY(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgYY img').remove();
        if (dataimg.length == 1) {

            $('#imgYY').append('<img class="img lookbigimg" src=' + dataimg + '-dj4>');
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
//上传开户许可证照片
function imgChangeRZ(obj) {
    getbase64(obj, function (dataimg) {
        $.showLoading("正在加载...");
        $('#imgRZ img').remove();
        if (dataimg.length == 1) {

            $('#imgRZ').append('<img class="img lookbigimg" src=' + dataimg + '-dj4>');
            setTimeout(function(){
                $.hideLoading();
            },3000)
        } else {
            $.hideLoading();
            $.alert('请您上传一张图片')
        }
    })
}
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
//获取验证码
$('#getcode').click(function(){
    var $tel = $('#mobile').val();
    if($tel == ''){
        $.alert('请输入手机号码')
    }else if(!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test($tel)){
        $.alert('您输入的号码不存在')
    }else {
        post('/adapter/wap/message/sendMobileCode',JSON.stringify({value1:$tel}),function(data){
            if(data.status == 0 ){
                var $this = $(this);
                var s = 60, t;
                times();
                if(data.result.mobile_code){
                    $.alert(data.result.mobile_code);
                }
                function times(){
                    s--;
                    $('#getcode').attr('disabled','disabled' );
                    $('#getcode').text( s +'s');
                    t = setTimeout(times, 1000);
                    if ( s <= 0 ){
                        s = 60;
                        clearTimeout(t);
                        $('#getcode').removeAttr('disabled' );
                        $('#getcode').text('获取验证码')
                    }
                }
            }else {
                $.alert(data.message)
            }
        })
    }
});