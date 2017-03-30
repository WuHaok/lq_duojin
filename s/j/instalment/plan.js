//向后台提交商品标示
var data = {
    product_uuid: GetQueryString('id')
};
query(data);
//请求查询用户可选的分期方案接口
function query(data) {
    post('/adapter/wap/product/calculateInstalmentNew', JSON.stringify(data), function (ds) {
        console.log(ds);
        var goodsList = ds.result.product_info;
        //商品信息
        var goddsdata = {
            productUuid: goodsList.uuid   //商品标示
            , main_img: goodsList.main_img   //商品图片
            , product_name: goodsList.product_name  //商品名称
            , quality_info_name: goodsList.quality_info.name   //成色
            , brand_info_brand_name: goodsList.brand_info.brand_name  //品牌名称
            , product_price: goodsList.price   //商品价格
            , auth: ds.result.auth //是否可以通过认证 0否 1是
            , instalment_amount_total: ds.result.instalment_amount_total //可用额度
            , instalment_amount_can: ds.result.instalment_amount_can
        };
        var html = template('goods', goddsdata);
        $('#page').append(html);
        //首付比例
        var paydownList = ds.result.paydown_list;
        for (var i = 0; i < paydownList.length; i++) {
            $('#paydown').append('<option value=' + paydownList[i] + '>' + paydownList[i] + '%</option>')
        }
        //所还期数
        var stageslist = ds.result.stages_list;
        for (var s = 0; s < stageslist.length; s++) {
            $('#stagesed').append('<option value=' + stageslist[s] + '>' + stageslist[s] + '期</option>')
        }
        //分期方案信息
        var piList = ds.result.pi_list;
        for (var j = 0; j < piList.length; j++) {
            var PiData = {
                sf: piList[j].uuid  //服务商标示
                , shoufu: piList[j].paydown_rate         //首付比例
                , shoufu_yuan: piList[j].paydown_amount  //首付金额
                , index: piList[j].stages     //期数
                , yuelixi: piList[j].interest_per    // 每期利息
                , index_yuan: piList[j].ai_per    //每期应还
                , zonglixi: piList[j].interest_total  // 总利息
                , fuwuname: piList[j].name    // 服务商名称
                ,check_desc:piList[j].check_desc == null ? '' : piList[j].check_desc   //审核时间
                ,imgsrc:piList[j].need_trans==0?piList[j].pay_step==0?'../s/img/fenqi1.png':'../s/img/fenqi3.png':piList[j].pay_step==0?'../s/img/fenqi2.png':'../s/img/fenqi4.png'  //审核流程
                ,describe:piList[j].provider_describe==null?"&nbsp;" :piList[j].provider_describe //服务商描述
                ,paystep:piList[j].pay_step
                ,remark:piList[j].remark   //准备材料
            };
            var html = template('fenqi', PiData);
            $('#fenqiPage').append(html)
        }
        console.log(ds);
        init()
    });
    initPage()
}
function initPage() {
    var html2 = template('footerPage');
    $('body').append(html2)
}
//点击加对勾小图片
$(document).on('click', '.stages', function (e) {
    var $this = $(this);
    $('.stages .icon-weixuanzhong').removeClass('icon-xuanzhong');
    $this.find('.icon-weixuanzhong').addClass('icon-xuanzhong');
    $('.shenHe').hide();
    $this.next('.shenHe').show()
});
//点击首付比例进行筛选
$('#paydown').on('change', function (e) {
    var $this = $(this);
    //初始化状态
    $('.stages').hide();
    $('.icon-weixuanzhong').removeClass('icon-xuanzhong');
    $('.shenHe').hide();
    $('.nostages').hide();
    var val = $this.val();
    var sta=$('#stagesed').val();
    //显示符合首付和期数的数据
    $('.'+val+'.'+sta).show();
    //默认第一个为选中项
    $('.'+val+'.'+sta).eq(0).find('.icon-weixuanzhong').addClass('icon-xuanzhong');
    //显示该数据下的审核时间和流程
    $('.'+val+'.'+sta).eq(0).next('.shenHe').show();
});
//点击所还期数进行筛选
$('#stagesed').on('change', function (e) {
    var $this = $(this);
    $('.stages').hide();
    $('.shenHe').hide();
    $('.icon-weixuanzhong').removeClass('icon-xuanzhong');
    $('.nostages').hide();
    var val = $this.val();
    var sta=$('#paydown').val();
    $('.'+val+'.'+sta).show();
    $('.'+val+'.'+sta).eq(0).find('.icon-weixuanzhong').addClass('icon-xuanzhong');
    $('.'+val+'.'+sta).eq(0).next('.shenHe').show();
});
$(document).on('click', '.nostages', function () {
    $.alert('您的可用额度不足，不支持选择')
});
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)return unescape(r[2]);
    return null;
}
var init = function () {
    var paydown = $('#paydown').val();
    var stagesed = $('#stagesed').val();
    $('.stages').hide();
    // 给paydown重新负值
    if ($('.stages').length == 0) {
        paydown = 20;
        stagesed = 2;
        $('.nostages').each(function (i, e) {
            if ($(this).hasClass('20') && $(this).hasClass('2') ) {
                $(this).show()
            } else {
                $(this).hide()
            }
        })
    }
    $('#paydown').val(paydown);
    $('#stagesed').val(stagesed);
    $('.'+paydown+'.'+stagesed).show();
    $('.'+paydown+'.'+stagesed).eq(0).find('.icon-weixuanzhong').addClass('icon-xuanzhong');
    $('.'+paydown+'.'+stagesed).eq(0).next('.shenHe').show();
    $(document).on('click', '#payMent', function () {
        s_instalment.clear();
        window.location.href = '../order/submit.html?id=' + GetQueryString('id')+'&web='+GetQueryString('web')
    });
    $(document).on('click', '#confirm', function () {
        if ($('.icon-xuanzhong').closest('.stages').length == 0) {
            $.alert('请选择分期产品')
        } else {
            $.confirm('分期购买商品您需要准备如下材料，事先准备齐全，购买可以更顺利哦<br>'+$('.icon-xuanzhong #remark').val(), '', '已备齐', '去准备', function () {
            }, function () {
                var ds = $('.icon-xuanzhong').closest('.stages');
                s_instalment.set(ds.attr('data-sf'),ds.attr('data-fuwuname'),ds.attr('data-index'),ds.attr('data-num'),ds.attr('data-shoufuyuan'),ds.attr('data-yuan'))
                window.location.href = '../order/submit.html?id=' + GetQueryString('id')+'&web='+GetQueryString('web')+'&paystep='+ds.attr('data-paystep')
            })
        }

    })
};

