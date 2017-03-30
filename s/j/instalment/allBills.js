/**
 * Created by Administrator on 2016/12/29.
 */
//点击近期或全部变色
$(function() {
    var data={
        type:0,
        member_uuid:user.uuid,
        rows:10,
        page:1
    };
    console.log(data);
    ajaxPost(data)
    function ajaxPost(data) {
        post(
            "/adapter/wap/instalment/getBillList",
            JSON.stringify(data),
            function(ds){
                console.log(ds);
                if(ds.status==0)
                {
                    var goodsList=ds.result.bill_list;
                    if(goodsList.length==0){
                        if(data.type==0){
                            $(".moRen h4").html("您还没有近期待还账单");
                        }
                        else{
                            $(".moRen h4").html("您还没有分期账单");
                        }
                        $(".moRen").show();
                        $("#articleId").hide();
                    }
                    else{
                        $(".moRen").hide();
                        vueage(ds,goodsList);
                        $("#articleId").show();

                    }
                }
                else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
                    window.location.href = '../../../personal/land.html';
                }
                else{
                    alert(ds.message)
                }
                }

        );
    }
    function vueage(ds,goodsList){
        var html="";
        for(var i=0;i<goodsList.length;i++){
            var obj={
                zhangHaoId:goodsList[i].bill_id,
                sell_id:goodsList[i].uuid,
                fenUuid:goodsList[i].product_info.uuid,
                classType:goodsList[i].status==0?"huanKuan":goodsList[i].status==1?"huanQing":"guanBi",
                zhuangTaiStr:goodsList[i].status==0?"还款中":goodsList[i].status==1?"已还清":"关闭",
                imgSrc:goodsList[i].product_info.main_img+"-dj1",
                shopName:goodsList[i].product_info.brand_info.brand_name,
                chengSe:goodsList[i].product_info.quality_info.name,
                shopType:goodsList[i].product_info.product_name,
                jiaGe:goodsList[i].product_info.price
            }
            html=html+template("scriptObj",obj);
        }
        $("#articleId").html(html);
    }
    $('.nav_click').on('click',function(e){
        $('#list div').remove()
        $('.nav_click').removeClass('bianSe')
        $(this).addClass('bianSe')
        data.type = $(this).attr('data-id')
        ajaxPost(data)
    })
})