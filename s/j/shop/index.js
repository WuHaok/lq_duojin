var data = {
    member_seller_uuid:GetQueryString('id')
    ,brand_uuids:''
    ,category_uuids:''
    ,price_low:''
    ,price_high:''
    ,keyword:''
    ,type:1
    ,status:0
    ,rows:10
    ,page:1
    ,sort_by: localStorage.getItem('sort_by')||'price_desc'
};
$(function(){
	// 页面加载
  $('#goods_list div').remove();
	data.brand_uuids = eval(localStorage.getItem('brand_uuids'));
	data.category_uuids = eval(localStorage.getItem('category_uuids'));
	data.quality_uuids = eval(localStorage.getItem('quality_uuids'));
	data.fit_people = localStorage.getItem('fit_people')== "undefined"? '' : localStorage.getItem('fit_people');
	data.price_low = localStorage.getItem('price_low')  == "undefined"? '' : localStorage.getItem('price_low');
	data.price_high = localStorage.getItem('price_high') == "undefined"? '' : localStorage.getItem('price_high');
	data.keyword = localStorage.getItem('keyword') == null ? '':  localStorage.getItem('keyword');
	data.sort_by = localStorage.getItem('sort_by');
    init(data);
	query(data);
	save()
});

function save(){
	var brankNum = localStorage.getItem('brankNum');
    var classifyNum = localStorage.getItem('classifyNum');
    var filterNum = localStorage.getItem('filterNum');
    if(brankNum != 0 && brankNum != null ){
    	$('#brankNum').css('display','inline-block');
    	$('#brankNum').text(brankNum)
    }
    if(classifyNum != "0" && classifyNum != null ){
    	$('#classifyNum').css('display','inline-block');
    	$('#classifyNum').text(classifyNum)
    }
    if(filterNum != "0" && filterNum != null ){
    	$('#filterNum').css('display','inline-block');
    	$('#filterNum').text(filterNum)
    }
    var sort_by = localStorage.getItem('sort_by');
    if(sort_by == ''){
      $('#status').html('<span class="text on">最新</span><span class="icon-rqzx" ></span>')
    }else if(sort_by == 'hit'){
      $('#status').html('<span class="text on">人气</span><span class="icon-rqzx" ></span>')
    }else if(sort_by == 'price_asc'){
      $('#status').html('<span class="text on">价格</span><span class="icon-jiagetohigh" ></span>')
    }else if(sort_by == 'price_desc'){
      $('#status').html('<span class="text on">价格</span><span class="icon-jiagetolow" ></span>')
    }
        // }else if(sort_by == 'price_asc'){
    //   $('#status').html('<span class="text on">价格</span><span class="icon-jiagetohigh" ></span>')
    // }else if(sort_by == 'price_desc'){
    //   $('#status').html('<span class="text on">价格</span><span class="icon-jiagetolow" ></span>')
    // }
}

function init(){
	post('/adapter/wap/product/findBySeller',JSON.stringify(data),function(data){
		var member = data.result.seller_info;
		var obj = {
			topimg : member.head_img ||'../s/img/handimg.png'
			,title : member.nick_name
			,text : member.remark
            // ,goods : data.result.visit_count
            // ,collect : data.result.fav_count  //店铺臭仓
            // ,wantme: data.result.product_count
            // ,zan : data.result.is_fav == 0 ? 'no-zan' : '' //0 是没收藏
		};
		var html = template('toperPage',obj);
        $('#toper').append(html);
      sharedata = {
        title: '悄悄告诉你，这个店铺有惊喜',
        desc: '分享一个好店铺'+ $('#toper .goods-title').text(), // 分享描述
        link: window.location.href, // 分享链接
        imgUrl: $('#toper .goods-img').attr('href')
      }
	})
}
function query(data){
	post('/adapter/wap/product/findBySeller',JSON.stringify(data),function(data){
        $('#totalPage').val(data.result.pageInfo.totalPage);
        $('#currentPage').val(data.result.pageInfo.currentPage);
		var basePath = data.result.pro_list;
        console.log(basePath);
		for(var i = 0 ; i < basePath.length ; i++){
           var obj= {
               product_url : '../shop/detail.html?id='+basePath[i].uuid,
               image : basePath[i].main_img,
               product_name : basePath[i].brand_info.brand_name,
               quality_name : basePath[i].quality_info.name,
               price : basePath[i].price,
               old_price : basePath[i].ori_price,
               status: basePath[i].status,
               storage:basePath[i].storage,
               storage_status: basePath[i].storage == 0-0  ?'icon-shouchu' : '111',
               in_price:basePath[i].can_instalment == 1?'首付'+basePath[i].instalment_amount: '',
               in_status:basePath[i].can_instalment == 1 ? 'icon-fenqi-sanjiao' : ''
           };
           var html = template('page',obj);
           $('#goods_list').append(html)
       }
       $('#scroll_wait').css('display','none');
       if(data.result.pageInfo.totalReco == 0){
           $('.no').css('display','block')
       }else{
           $('.no').css('display','none');
           if(data.result.pageInfo.currentPage == data.result.pageInfo.totalPage){
               $('#scroll_over').css('display','block')
           }
       }
       $('.status-js').each(function(i){
           var dataId = $(this).attr('data-id');
           if(dataId == 4 || dataId == 5){
               $(this).find('a').append('<img src="/resources/images/wap/icon-yishou-liebiao.png" class="saleoff" >')
           }
       	})
   })
}


$(window).scroll(function () {
	if($(document).scrollTop() >= 10 ){
		$('.headbody').css('position',' fixed');
		$('.goods-img').hide();
		$('.goods-text').hide();
		$('.goods-sp').hide();
		$('.goods-cz').hide()
	}
	if($('#toper').offset().top < 40){
		$('.headbody').css('position', 'relative');
		$('.goods-img').show();
		$('.goods-text').show();
		$('.goods-sp').show();
		$('.goods-cz').show()
	}

    if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
        if($('#currentPage').val()<$('#totalPage').val()){
            $('#loading').css('display','block');
            $('#scroll_wait').css('display','block');
            data.page = data.page+1;
            query(data)
        }

    }
});
// nav
$('#nav li').click(function(e){
    localStorage.setItem('nav',$(this).attr('id'));
    window.location.href = '../shop/_index_filter.html?id='+GetQueryString('id')
});

// 方法论
function GetQueryString(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if(r!=null)return  unescape(r[2]); return null;
}


