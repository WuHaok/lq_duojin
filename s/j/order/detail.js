window.confirm = function (message) {
    var iframe = document.createElement("IFRAME");
    iframe.style.display = "none";
    iframe.setAttribute("src", 'data:text/plain,');
    document.documentElement.appendChild(iframe);
    var alertFrame = window.frames[0];
    var result = alertFrame.window.confirm(message);
    iframe.parentNode.removeChild(iframe);
    return result;
};
var vd = ''
var paystep

postasync('/adapter/wap/order/get', JSON.stringify({'order_uuid': GetQueryString('id'),'type':0}), function (ds) {
    console.log(ds);
    vd = ds.result.order
    paystep=ds.result.order.pay_step
})

var track = vd.track_list.reverse()
var dtrack = []
for(var i=0 ;i <track.length; i++){
    track[i].wlgs = track[i].delivery_co == null ? '' : track[i].delivery_co
    track[i].wldh = track[i].delivery_num == null ? '' : track[i].delivery_num
    track[i].delivery_co = track[i].delivery_co == null ? '' :'交付方式'+track[i].delivery_co
    track[i].delivery_num = track[i].delivery_num == null ? '' : '物流单号'+track[i].delivery_num
    track[i].curre_route = false
    track[i].lookWuliu = track[i].delivery_co == '' ? false : true
    if( i == track.length-1){
        track[i].curre_route = true
    }
    dtrack.unshift(track[i])
}

var vp = vd.product_list_dto[0] //商品
var vdd = vd.delivery_dto
var vm = new Vue({
    el: '#app'
    , data: {
        status: vd.order_status
        ,is_instalment:vd.is_instalment-0
        ,geex_dto : vd.oi_dto==null?52:vd.oi_dto.status-0==0 || vd.oi_dto.status-0==2? 51 : 52
        , uuid: vd.uuid
        , curre_route: true  //判断页面中是否出现了当前的最后一个状态
        ,delivery_to:vd.delivery_to-0
        ,delivery_status:vd.delivery_status-0
        ,status_delivery:vd.order_status==2?(vd.delivery_to-0==0?true:vd.delivery_status-0==2?true:false):false
        , order: {
            order_status: vd.order_status
            ,
            order_id: vd.order_id
            ,
            create_date: vd.create_date
            ,
            amount: vd.amount
            ,
            interest_amount_per:vd.oi_dto == null ? '':vd.oi_dto.interest_amount_per,
            instalment_amount_per:vd.oi_dto == null ?'':parseFloat(Number(vd.oi_dto.instalment_amount_per)+Number(vd.oi_dto.interest_amount_per)).toFixed(3),
            is_interest:vd.oi_dto == null ? false : true

            ,
            paydown_rate: vd.oi_dto == null ? '' :vd.oi_dto.paydown_rate ||''
            ,
            paydown_amount:vd.oi_dto == null ? '' : vd.oi_dto.paydown_amount || ''
            ,
            stages:vd.oi_dto == null ? '' : vd.oi_dto.stages
            ,
            interest_amount_total:vd.oi_dto == null ? '' : vd.oi_dto.interest_amount_total
            ,
            paydown_amount:vd.oi_dto == null ? '' : vd.oi_dto.paydown_amount

            ,
            coupon_amount: ''
            ,
            finally_amount: vd.finally_amount//实付金额
            ,
            close_date: vd.close_date
            ,
            close_remark: vd.close_remark
            ,
            remark: vd.remark
            ,
            oi_dto: {
                status: vd.oi_dto== null ? "" : vd.oi_dto.status

            }
            ,
            seller: {}
            ,
            delivery_dto: {
                receiver_name: vdd.receiver_name
                , receiver_tel: vdd.receiver_tel
                , provice: vdd.provice
                , city: vdd.city
                , area: vdd.area
                , detail: vdd.detail
                , delivery_num: vdd.delivery_num
            }
        }
        , product_dto: {
            product_main_img: vp.product_main_img
            , brand_name: vp.brand_name
            , quality_name: vp.quality_name
            , product_name: vp.product_name
            , amount: vp.amount
            ,uuid : vp.uuid
        }
        , track_list : dtrack
    }
    , filters: {
        data: function (value) {
            return new Date(parseInt(value) * 1000).toLocaleString().substr(0, 17)
        }
    }
    , methods: {
        buynow: function () {
            //购买
            productData.setuuid(this.product_dto.uuid)
            window.location.href = '../order/payment.html?id=' + this.uuid+'&paystep='+paystep
        }
        , confirm: function () {
            if(confirm("确定您是否收到货？")){
                var data = {
                    member_uuid:user.uuid
                    ,order_uuid:this.uuid
                }
                post('/adapter/wap/order/takeover',JSON.stringify(data),function (ds) {
                    window.location.reload()
                })
            }


        }
        , geex_sub: function () {
            window.location.href = line+'/wap/toAuthPage?order_uuid=' + this.uuid
        }
        , quxiao : function () {
            window.location.href = '../order/cancel.html?id='+this.uuid
        }
        ,wuliu:function (li) {
            var curr = window.location.href
            window.location.href = 'https://m.kuaidi100.com/index_all.html?type='+li.wlgs+'&postid='+li.wldh+'&callbackurl='+window.location.href
        }
        ,fenQi:function(){
            window.location.href = "zhangDetail.html?sell_id=null&order_id="+this.uuid
        }
        ,fenQi1:function(){
            window.location.href = "zhangDetail.html?sell_id=null&huanType=1&order_id="+this.uuid
        }

        ,takegoods: function () {
            var data = {
                member_uuid: uesr.uuid
                , order_uuid: this.order.order_uuid
            }
            post('/adapter/wap/order/takeover', JSON.stringify(data), function (ds) {
                if (ds.status == 0) {

                } else if (ds.status == 600) {

                } else {
                    $.alert(ds.message_detail)
                }
            })
        }
        ,
        cancel: function () {
            window.location.href = '/wap/order/cancel?uuid=' + this.order.order_id
        }
    }

})

