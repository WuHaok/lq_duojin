// 提交
$('#confirm').on('click', function () {
    // var zhifubaoimg = []
    // var wximg = []
    var bankimg = []
    // $('#zhifubaoUpBox img').each(function (e) {
    //     zhifubaoimg.push($(this).attr('src'))
    // })
    // $('#weixinUpBox img').each(function (e) {
    //     wximg.push($(this).attr('src'))
    // })
    $('#yinhangUpBox img').each(function (e) {
        bankimg.push($(this).attr('src'))
    })
    var data = {
        order_uuid: GetQueryString('order_uuid')
        , contact1_relation: $('#contact1_relation').val()
        , contact1_name: $('#contact1_name').val()
        , contact1_phone: $('#contact1_phone').val()
        , contact2_relation: $('#contact2_relation').val()
        , contact2_name: $('#contact2_name').val()
        , contact2_phone: $('#contact2_phone').val()
        // , alipay_trans: JSON.stringify(zhifubaoimg)
        // , wx_trans: JSON.stringify(wximg)
        , bank_trans: JSON.stringify(bankimg)
    }
    if (!$('#agree').hasClass('weui_icon_success_circle')) {
        $.alert('请您查看并同意个人信息查询授权书')
    } else if (data.contact1_name == '') {
        $.alert('请填写联系人姓名')
    } else if (data.contact1_phone == '') {
        $.alert('请填写联系人电话')
    // } else if (data.alipay_trans == '[]' || data.alipay_trans == undefined) {
    //     $.alert('请上传支付宝截图')
    // } else if (data.wx_trans == '[]' || data.wx_trans == undefined) {
    //     $.alert('请上传微信截图')
    } else if (!/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/i.test(data.contact1_phone)) {
        $.alert('联系人1手机号码输入错误')
    } else {
        post('/adapter/wap/order/authStep3', JSON.stringify(data), function (ds) {
            if (ds.status == 0) {
                if (ds.result.flag == true) {
                    window.location.href = '../order/list.html?order_status=5'
                }
            } else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                window.location.href = '../../../personal/land.html';
            }else {
                $.alert(ds.message)
            }
        })
    }
})

$(function () {

    init()
})
function init() {
    var querydata = {
        order_uuid: GetQueryString('order_uuid')
    }
    post('/adapter/wap/order/getAuth', JSON.stringify(querydata), function (ds) {
        if (ds.status == 0) {
            var l = ds.result
            if (l.contact1_relation == null) {
                $('#contact1_relation').val('直系亲属（如：父母，夫妻）')
            } else {
                $('#contact1_relation').val(l.contact1_relation)
            }


            $('#contact1_name').val(l.contact1_name)
            $('#contact1_phone').val(l.contact1_phone)
            $('#contact2_relation').val(l.contact2_relation)
            $('#contact2_name').val(l.contact2_name)
            $('#contact2_phone').val(l.contact2_phone)
            var zfb = eval(l.alipay_trans)
            var wx = eval(l.wx_trans)
            var bk = eval(l.bank_trans)
            for (var i = 0; i < zfb.length; i++) {
                $('#zhifubaoUp').before("<div class='img-box'><img src='" + zfb[i] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                if (i == 9) {
                    $('#zhifubaoUp').hide()
                }
            }
            for (var j = 0; j < wx.length; j++) {
                $('#weixinUp').before("<div class='img-box'><img src='" + wx[j] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                if (j == 9) {
                    $('#weixinUp').hide()
                }
            }
            for (var k = 0; k < bk.length; k++) {
                $('#yinhangUp').before("<div class='img-box'><img src='" + bk[k] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                if (k == 9) {
                    $('#yinhangUp').hide()
                }
            }
        }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
            window.location.href = '../../../personal/land.html';
        }
    })
}
//页面加载
$('#goback').on('click', function () {
    window.history.back()
})
// 实例
$('#handzhifubao').on('click', function () {
    $("#zhifubaoPage").popup();
})
$('#handweixin').on('click', function () {
    $("#weixinPage").popup();
})
$('#handyinhang').on('click', function () {
    $("#yinhangPage").popup();
})
$('.close-popup').on('click', function () {
    $.closePopup()
})
$('#shouquanshu').on('click', function () {
    $("#shouquanshupage").popup();
})
/* 	图片
 手持照上传
 */


var obj = []
var imgChangezhifubao = function (obj) {
    var allreadynum = $("#zhifubaoUpBox  img").length;
    var selectnum = obj.files.length
    console.log("sss:" + selectnum);
    if (allreadynum + selectnum <= 9) {
        getbase64ES(obj, function (img) {
            for (var i = 0; i < img.length; i++) {
                $('#zhifubaoUp').before("<div class='img-box'><img src='" + img[i] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
            }
        })
        $('#zhifubaoUp').show()
        if (allreadynum + selectnum == 9) {
            $('#zhifubaoUp').hide()
        }
    } else {
        $.alert("最多9张图");
    }
}

var imgChangeweixin = function (obj) {
    $("#weixinUpBox").change(function () {
        var allreadynum = $("#weixinUpBox  img").length;
        var selectnum = $(this).find('input').prop('files').length;
        if (allreadynum + selectnum <= 9) {
            getbase64ES(obj, function (img) {
                for (var i = 0; i < img.length; i++) {
                    $('#weixinUp').before("<div class='img-box'><img src='" + img[i] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
                }
            })
            $('#weixinUp').show()
            if (allreadynum + selectnum == 9) {
                $('#weixinUp').hide()
            }
        } else {
            $.alert("最多9张图");
        }
    });
}

var imgChangeyinhang = function (obj) {

    var allreadynum = $("#yinhangUpBox  img").length;
    var selectnum = $(this).find('input').prop('files').length;
    if (allreadynum + selectnum <= 9) {
        getbase64ES(obj, function (img) {
            for (var i = 0; i < img.length; i++) {
                $('#yinhangUp').before("<div class='img-box'><img src='" + img[i] + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
            }
        })
        $('#yinhangUp').show()
        if (allreadynum + selectnum == 9) {
            $('#yinhangUp').hide()
        }
    } else {
        $.alert("最多9张图");
    }
}
/*图片删除
 */
function imgDel(e) {
    var $this = $(e)
    var vid = $this.closest('.imgbox').find('.upimgs').show()
    $this.closest('.img-box').remove()
}

$(document).on('change','.imgbox',function (e) {
    if($(this).find('img') < 9){
        $(this).find('img-btn').show()
    }
})
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var inputClear = function () {
    $('input').blur()
}