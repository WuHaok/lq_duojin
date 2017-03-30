//用户常用信息,存储在登陆页面，personal/logo页面
var user = {
    token: localStorage.getItem('dj_token') || ''
    , uuid: localStorage.getItem('dj-user_uuid') || ''
    // , name: localStorage.getItem('dj_user_name')
    // , gender: localStorage.getItem('dj_user_gender')
    // , head_img: localStorage.getItem('dj_user_head_img')
    // , remark: localStorage.getItem('dj_user_remark')
    , set: function (num1, num2) {
        localStorage.setItem('dj_token', num1)
        localStorage.setItem('dj-user_uuid', num2)
    }
}
//地址的存储，用于页面简单跳转，存储信息
var s_href = {
    get: function () {
        return localStorage.getItem('dj_href')
    }
    , set: function (href) {
        localStorage.setItem('dj_href', href)
    }
}

//地址信息
var s_addr = {
    uuid: localStorage.getItem('dj_addr_uuid')
    , receiver_name: localStorage.getItem('dj_addr_receiver_name')
    , receiver_tel: localStorage.getItem('dj_addr_receiver_tel')
    , provice: localStorage.getItem('dj_addr_provice')
    , city: localStorage.getItem('dj_addr_city')
    , area: localStorage.getItem('dj_addr_area')
    , detail: localStorage.getItem('dj_addr_detail')
    , set: function (uuid, receiver_name, receiver_tel, provice, city, area, detail) {
        localStorage.setItem('dj_addr_receiver_name', receiver_name)
        localStorage.setItem('dj_addr_receiver_tel', receiver_tel)
        localStorage.setItem('dj_addr_provice', provice)
        localStorage.setItem('dj_addr_city', city)
        localStorage.setItem('dj_addr_area', area)
        localStorage.setItem('dj_addr_detail', detail)
        localStorage.setItem('dj_addr_uuid', uuid)
    }
    , clear: function () {
        localStorage.setItem('dj_addr_receiver_name', '')
        localStorage.setItem('dj_addr_receiver_tel', '')
        localStorage.setItem('dj_addr_provice', '')
        localStorage.setItem('dj_addr_city', '')
        localStorage.setItem('dj_addr_area', '')
        localStorage.setItem('dj_addr_detail', '')
        localStorage.setItem('dj_addr_uuid', '')
    }
}
var change_addr = {
    set: function (uuid, receiver_name, receiver_tel, provice, city, area, detail, is_main) {
        localStorage.setItem('dj_changeaddr_receiver_name', receiver_name)
        localStorage.setItem('dj_changeaddr_receiver_tel', receiver_tel)
        localStorage.setItem('dj_changeaddr_provice', provice)
        localStorage.setItem('dj_changeaddr_city', city)
        localStorage.setItem('dj_changeaddr_area', area)
        localStorage.setItem('dj_changeaddr_detail', detail)
        localStorage.setItem('dj_changeaddr_uuid', uuid)
        localStorage.setItem('dj_changeaddr_is_main', is_main)
    }
    , get: function () {
        return data = {
            uuid: localStorage.getItem('dj_changeaddr_uuid')
            , receiver_name: localStorage.getItem('dj_changeaddr_receiver_name')
            , receiver_tel: localStorage.getItem('dj_changeaddr_receiver_tel')
            , provice: localStorage.getItem('dj_changeaddr_provice')
            , city: localStorage.getItem('dj_changeaddr_city')
            , area: localStorage.getItem('dj_changeaddr_area')
            , detail: localStorage.getItem('dj_changeaddr_detail')
            , is_main: localStorage.getItem('dj_changeaddr_is_main')
        }
    }
    //在addr/man 页面唯一管理入口  在点击编辑时候调用
    , clear: function () {
        localStorage.setItem('dj_changeaddr_receiver_name', '')
        localStorage.setItem('dj_changeaddr_receiver_tel', '')
        localStorage.setItem('dj_changeaddr_provice', '')
        localStorage.setItem('dj_changeaddr_city', '')
        localStorage.setItem('dj_changeaddr_area', '')
        localStorage.setItem('dj_changeaddr_detail', '')
        localStorage.setItem('dj_changeaddr_uuid', '')
        localStorage.setItem('dj_changeaddr_is_main', '')
    }
}
//分期信息存储
var s_instalment = {
    uuid: localStorage.getItem('dj_instalment_uuid') || '' //分期服务商标识
    , name: localStorage.getItem('dj_instalment_name') || '' //分期服务商名称
    , qishu: localStorage.getItem('dj_instalment_qishu') || '' //期数
    , bili: localStorage.getItem('dj_instalment_bili') || '' //比例
    , shoufu: localStorage.getItem('dj_instalment_shoufu') || '' //分期期数
    , meiqiqianshu: localStorage.getItem('dj_instalment_meiqiqianshu') || '' //首付金额
    , set: function (uuid, name, qishu, bili, shoufu, meiqiqianshu) {
        localStorage.setItem('dj_instalment_uuid', uuid)
        localStorage.setItem('dj_instalment_name', name)
        localStorage.setItem('dj_instalment_qishu', qishu)
        localStorage.setItem('dj_instalment_bili', bili)
        localStorage.setItem('dj_instalment_shoufu', shoufu)
        localStorage.setItem('dj_instalment_meiqiqianshu', meiqiqianshu)
    }
    , clear: function () {
        localStorage.setItem('dj_instalment_uuid', '')
        localStorage.setItem('dj_instalment_name', '')
        localStorage.setItem('dj_instalment_qishu', '')
        localStorage.setItem('dj_instalment_shoufu', '')
        localStorage.setItem('dj_instalment_meiqiqianshu', '')
    }
}

//即将购买的商品存储  在submit order/list order/detail 三个可以支付的页面可以重置 用于order/payment 其他页面不可以使用
//订单信息
var productData = {
    amount: localStorage.getItem('dj_sub_amount') //实付金额
    , amountset: function (amount) {
        localStorage.setItem('dj_sub_amount', amount)
    }
    , fenqifuwu: localStorage.getItem('dj_sub_fenqifuwu')
    , fenqifuwuset: function (fenqifuwu) {
        localStorage.setItem('dj_sub_fenqifuwu', fenqifuwu)
    }
    , uuid: localStorage.getItem('dj_sub_uuid')
    , setuuid: function (uuid) {
        localStorage.setItem('dj_sub_uuid', uuid)
    }
    ,
    set: function (remark, product_uuid, product_name) {
        localStorage.setItem('dj_sub_remark', remark)
        localStorage.setItem('dj_sub_product_uuid', product_uuid)
        localStorage.setItem('dj_sub_product_name', product_name)
    }
    ,
    get: function () {
        return {
            member_buyer_uuid: user.uuid
            , remark: localStorage.getItem('dj_sub_remark') || ''
            , product_list: [{
                product_uuid: localStorage.getItem('dj_sub_product_uuid')
                , product_name: localStorage.getItem('dj_sub_product_name')
            }]
            , delivery_uuid: s_addr.uuid
            , provider_uuid: s_instalment.uuid || '' //分期服务商
            , paydown_rate: s_instalment.pay || ''  //首付比例
            , stages_num: s_instalment.index || ''     //分期期数＝＝＝
        }
    }
}

//用于清除信息
var clear = {
    loc: function () {
        localStorage.clear()
    }
}

//配置变量
var line
function linse() {
    var cuf = window.location.href.split('/')[2]
    if(cuf == "wap.shopuu.com"){
        line = 'http://dj.shopuu.com';
    }else {
        line = 'https://dj-qa.shopuu.com';
    }
    return line
}
var lined
function linsed() {
    var cuf = window.location.href.split('/')[2]
    if(cuf == "wap.shopuu.com"){
        lined = 'http://wap.shopuu.com';
    }else {
        lined = 'https://wap-qa.shopuu.com';
    }
    return lined
}
linse()
linsed()
//判断打开环境
var browser = function () {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/alipay/i) == 'alipay') {
        // alert('我是支付宝')
        return 'zhifubao'
    } else if (ua.match(/micromessenger/i) == 'micromessenger') {
        // alert('我是微信')
        return 'weixin'
    } else if (ua.match(/safari/i) == 'safari') {
        // alert('我是网页')
        return 'liulanqi'
    }
}
//浏览器
var web = {
    set: '&web=' + browser()
    , get: GetQueryString('web')
}
//相当于全局变量
var curr_href = window.location.href

//判断更换浏览器


function page() {
    var cuf = curr_href.split('/')[curr_href.split('/').length - 1]
    var cuff = cuf.split('.')[0]
    var cufff = curr_href.split('/')[curr_href.split('/').length - 2]
    if (web.get != browser()) {
        if ((cuff == 'list' || cuff == 'detail' || cuff == 'payment' || cuff == 'cancel'||cuff=='allBills' ||cuff=='zhangDetail'||cuff=='zhiPayment'|| cuff == 'success') && cufff == 'order') {
        } else if ((cuff == 'authPage1' ||cuff == 'authPage-tn1' ||cuff == 'authPage-tn2' ||cuff == 'authPage-tn3' ||cuff == 'authPage-tn4' || cuff == 'authPage2' || cuff == 'authPage3' || cuff == 'detail' || cuff == 'list' || cuff == 'success' ) && cufff == 'instalment') {

        } else if ((cuff == 'index' || cuff == 'index_filter'||cuff == '_index_filter') && cufff == 'shop') {
        }   else if((cufff =='address' || cufff=='personal')){
        } else if (cuff == 'land') {
        } else {
            window.location.href = '../shop/detail.html?id=' + GetQueryString('id') + web.set
        }
    }
    //页面链接有user.token 或者 user.uuid 页面不需要登陆，获取页面参数，页面进行跳转
    var token = GetQueryString('auth_uuid')
    var uuid = GetQueryString('auth_token')
    var id = GetQueryString('id') //商品 店家 各种外来货色都叫这个吧
    if (token != null || uuid != null) {
        user.set(token, uuid)
        window.location.href = curr_href.split('?')[0] + '?id=' + id + '&web=' + GetQueryString('web')
    }
    //当没有user.token 的时候，进入登陆页面 清除所有的本地存储
    if ((curr_href).split('/')[(curr_href).split('/').length - 2] == 'order' || (curr_href).split('/')[(curr_href).split('/').length - 2]=='instalment') {
        if ((user.token == '' || user.token == '') && (curr_href).split('/')[(curr_href).split('/').length - 1] != 'land.html') {
            clear.loc()
            s_href.set(curr_href)
            window.location.href = '../personal/land.html' + '?web=' + GetQueryString('web')
            return
        }
    }
}
page()


//方法
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}




