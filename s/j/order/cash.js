$(function () {
	var data = {
		member_uuid: $('#member_uuid').val()
		,valid:0
		,rows:1000
		,page:1
		,valid:$('#valid').val()
	}
	var price = parseInt(localStorage.getItem('price'))
	queryData()
	function shijianchuo(date){
		date = date.substring(0,19);    
		date = date.replace(/-/g,'/'); 
		return new Date(date).getTime();
	}
	function queryData(){
		$.post('/adapter/wap/coupon/collectedList',JSON.stringify(data),function(data){
			var ds = data.result
			var co = ds.coupon_list || [];
			if( co.length != 0){
				for(var i = 0;i<co.length ;i++){
					if(co[i].is_use == 0){
						var obj = {
							uuid : co[i].uuid
							,amount: Math.floor(co[i].amount)
							,condition_amount: co[i].condition_amount
							,use_date_begin:co[i].use_date_begin.substr(0,10) 
							,use_date_end : co[i].use_date_end.substr(0,10) 
							,is_use:co[i].is_use == 0 ? 'yong': 'no-yong'
							,shiyong : co[i].condition_amount < price ? 'shiyong_yes' : 'shiyong_no'
							,shijian : parseInt(shijianchuo(co[i].use_date_end)) < parseInt(Date.parse(new Date())) ? 'guole':'no-guo' 
							,weidao : parseInt(shijianchuo(co[i].use_date_begin))> parseInt(Date.parse(new Date())) ? 'guole':'no-guo' 
						}
						var html = template('page',obj)
    	        		$('#cash').append(html)
    	        	}else{
    	        		var obj = {
							uuid : co[i].uuid
							,amount: Math.floor(co[i].amount)
							,condition_amount: co[i].condition_amount
							,use_date_begin:co[i].use_date_begin.substr(0,10) 
							,use_date_end : co[i].use_date_end.substr(0,10) 
							,is_use:co[i].is_use == 0 ? 'yong':'no-yong'
							,shiyong : co[i].condition_amount < price ? 'shiyong_yes' : 'shiyong_no'
							,shijian : shijianchuo(co[i].use_date_end) > Date.parse(new Date()) ? 'guole':'no-guo'
						}
						var html = template('page',obj)
    	        		$('#cash').append(html)
    	        	}   
    	        }
			}
			if($('.cash').length == 0 ){
				$('.no-data').css('display','block')
				if(ds.pageInfo.totalReco == 0){
					$('.history').css('display','block')
				}
			}
			$('.shiyong_no').css({'background-color': '#666','-moz-opacity': '0.7' ,'opacity':'0.7'}).addClass('no-cash')
			$('.guole').css({'background-color': '#666','-moz-opacity': '0.7' ,'opacity':'0.7'}).addClass('no-cash')
			$('.yong .ygq').text('已使用')
			$('.no-cash').each(function(){
				$('#cash').append($(this).clone())
				$(this).remove()
			})
				
			
			var $cash = localStorage.getItem('cash') || ' ';
			$('.cash[data-id='+$cash+']').addClass('cash-on')
			$('.cash-on').append('<div class="cash-select"></div>')
			$
		})
	}

})