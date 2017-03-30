$(function () {
	// body...
	var data = {
		special_zone_uuid:GetQueryString('id')
		,discount_low:$('#discount_low').val()
		,discount_high:$('#discount_high').val()
		,rows:$('#rows').val()
		,page:1
	}
	queryData(data)
	function queryData(){
		$.post('/adapter/wap/homePage/getSpecialZone',JSON.stringify(data),function(data){
        	if(data.status == 0){
        		//tupian
        		var topImg = data.result.special_zone.main_img
        		$('#top').html('<img src='+topImg+'>')
        		//列表
                $(document).attr("title",data.result.special_zone.name);
        	    var basePath = data.result.special_zone.product_list
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
                        $('#scroll_wait').css('display','none')
                    }  
                }
                $('.status-js').each(function(i){
                    var dataId = $(this).attr('data-id')
                    if(dataId == 4){
                        $(this).find('a').append('<img src="/resources/images/wap/icon-yishou-liebiao.png" class="saleoff" >')
                    }
                }) 
        	}
    	})
	}
	$(window).scroll(function () {
        if ($(document).scrollTop() + $(window).height() >= $(document).height()) {
            $('#scroll_wait').css('display','block');
            data.page = data.page+1
            queryData(data)
        }
    });
    $('.select a').click(function(e){
     	$('#scroll_wait').css('display','block')
    	var $this =$(this)
    	$('.select a').removeClass('on')
    	$this.addClass('on')
    	var val = $this.attr('data-val')-0;
    	switch (val){
    		case 1:
    			data.discount_low=0;
				data.discount_high=1;
    			break;
    		case 2:
    			data.discount_low=1;
				data.discount_high=2;
				break;
    		case 3:
    			data.discount_low=2;
				data.discount_high=3;
    			break;
    		case 0:
    			data.discount_low=0;
				data.discount_high=3;
    			break;
    	}
    	data.page =1;
    	$('#goods_list .house-box').remove() 
    	queryData(data)
    })
    function GetQueryString(name){
         var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
         var r = window.location.search.substr(1).match(reg);
         if(r!=null)return  unescape(r[2]); return null;
    }
})