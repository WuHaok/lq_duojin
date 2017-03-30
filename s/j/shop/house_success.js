$(function () {
    $('#scroll_wait').css('display','block') 
    $('#nav li').click(function(e){
        localStorage.setItem('nav',$(this).attr('id'))
        window.location.href = '/wap/shop/house_filter' 
    })
	$('#goods_list p').remove()
	$('#goods_list div').remove()
    var search = GetQueryString('search') || ''
    if(search == 'shop'){
        $('#sub').val('2')
    }

	var data = {
		page :1
		,rows:10
	}

	data.brand_uuids = eval(localStorage.getItem('brand_uuids'))
	data.category_uuids = eval(localStorage.getItem('category_uuids'))
	data.quality_uuids = eval(localStorage.getItem('quality_uuids'))
	data.fit_people = localStorage.getItem('fit_people')== "undefined"? '' : localStorage.getItem('fit_people')
	data.price_low = localStorage.getItem('price_low')  == "undefined"? '' : localStorage.getItem('price_low')
	data.price_high = localStorage.getItem('price_high') == "undefined"? '' : localStorage.getItem('price_high')
	data.keyword = localStorage.getItem('keyword') == null ? '':  localStorage.getItem('keyword')
	data.sort_by = localStorage.getItem('sort_by')



    queryData(data)
	function queryData(data){
       $.post('/adapter/wap/product/search',JSON.stringify(data),function(data){
            if(data.status == 0){
                console.log(data)
                var list = []
                var basePath = data.result.pro_list
                for(var i = 0 ; i < basePath.length ; i++){
                    var obj= {
                        product_url : '/wap/shop/detail?uuid='+basePath[i].uuid,
                        image : eval(basePath[i].imgs)[0],
                        product_name : basePath[i].brand_info.brand_name,
                        quality_name : basePath[i].quality_info.name,
                        price : basePath[i].price,
                        old_price : basePath[i].ori_price,
                        status: basePath[i].status
                    }
                    var html = template('page',obj)
                    $('#goods_list').append(html)        
                }
                $('#scroll_wait').css('display','none')
                if(data.result.pageInfo.totalReco == 0){
                    $('.no').css('display','block')
                }else{
                    $('.no').css('display','none')
                    if(data.result.pageInfo.currentPage == data.result.pageInfo.totalPage){
                        $('#scroll_over').css('display','block')
                    }  
                }
                $('.status-js').each(function(i){
                    var dataId = $(this).attr('data-id')
                    if(dataId == 5){
                        $(this).find('a').append('<img src="/resources/images/wap/icon-yishou-liebiao.png" class="saleoff" >')
                    }
                }) 
            }
       })
    }
    if(data.keyword != null && data.keyword != "" ){
    	$('.text-center').text(data.keyword)
    }
    var brankNum = localStorage.getItem('brankNum')
    var classifyNum = localStorage.getItem('classifyNum')
    var filterNum = localStorage.getItem('filterNum')
    if(brankNum != 0 && brankNum != "null" ){
    	$('#brankNum').css('display','inline-block')
    	$('#brankNum').text(brankNum)
    }
    if(classifyNum != "0" && classifyNum != "null" ){
    	$('#classifyNum').css('display','inline-block')
    	$('#classifyNum').text(classifyNum)
    }
    if(filterNum != "0" && filterNum != "null" ){
    	$('#filterNum').css('display','inline-block')
    	$('#filterNum').text(filterNum)
    }
    var sort_by = localStorage.getItem('sort_by')
    if(sort_by == ''){
    	$('#status').html('<span class="text on">最新</span><span class="icon-rqzx" ></span>')
    }else if(sort_by == 'hit'){
    	$('#status').html('<span class="text on">人气</span><span class="icon-rqzx" ></span>')
    }else if(sort_by == 'price_asc'){
    	$('#status').html('<span class="text on">价格</span><span class="icon-jiagetohigh" ></span>')
    }else if(sort_by == 'price_desc'){
    	$('#status').html('<span class="text on">价格</span><span class="icon-jiagetolow" ></span>')
    }

   	$(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            $('#loading').css('display','block');
            $('#scroll_wait').css('display','block')
            data.page = data.page+1
            queryData(data)
        }
    });

   	$('#fanhui').click(function(){
        localStorage.removeItem('brand_uuids')
        localStorage.removeItem('category_uuids')
        localStorage.removeItem('quality_uuids')
        localStorage.removeItem('price_low')
        localStorage.removeItem('price_high')
        localStorage.removeItem('fit_people')
        localStorage.removeItem('keyword')
        localStorage.removeItem('sort_by')
        localStorage.setItem('brankNum','0')
        localStorage.setItem('classifyNum','0')
        localStorage.setItem('filterNum','0')
    	window.location.href = '/wap/shop/house'
   	})
})
function GetQueryString(name){
   var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
   var r = window.location.search.substr(1).match(reg);
   if(r!=null)return  unescape(r[2]); return null;
  }