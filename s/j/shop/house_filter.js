$(function () {
	var data  = {
		sort_by : ''
	}
    $('#bodyerNew li').click(function (e) {
    	var $this = $(this)
    	var sort = $this.attr('data-val')
    	if(sort == 'price_desc'){
    		$('#status').html('<span class="text on">价格</span><span class="icon-jiagetolow" ></span>')
    	}else if(sort =='price_asc'){
    		$('#status').html('<span class="text on">价格</span><span class="icon-jiagetohigh" ></span>')
    	}else if(sort =='hit'){
    		$('#status').html('<span class="text on">人气</span><span class="icon-rqzx" ></span>')
    	}else {
            $('#status').html('<span class="text on">最新</span><span class="icon-rqzx" ></span>')
        }
    	data.sort_by = sort;
    	$.post('/adapter/wap/product/search',JSON.stringify(data),function(ds){
    		if(ds.status == 0){
    		    localStorage.setItem('sort_by',sort)
                if(localStorage.getItem('keyword') == '' || localStorage.getItem('keyword') == null ){
                    window.location.href = '/wap/shop/house?type=1'
                }else{
                    window.location.href = '/wap/shop/house_success'
                }
    		}
    	})
    })
    $(document).on('click','.brank-img',function(e){
        var $this = $(this)
        if($(this).hasClass('on')){
            $(this).removeClass('on')
        }else{
            $(this).addClass('on')
        }
        var len = $('#branks .on').length;
        if(len == 0){
            $('#brankNum').css('display','none')
        }else{
            $('#brankNum').css('display','inline-block')
            $('#brankNum').text(len)
        }
    })
    $(document).on('click','.classify',function(e){ 
        var $this = $(this)
        if($(this).hasClass('on')){
            $(this).removeClass('on')
        }else{
            $(this).addClass('on')
        }
        var len = $('#categories .on').length;
        if(len == 0){
            $('#classifyNum').css('display','none')
        }else{
            $('#classifyNum').css('display','inline-block')
            $('#classifyNum').text(len)
        }
    })
    
    $(document).on('click','#qualities .btnon',function(e){
        var $this = $(this)
        if($(this).hasClass('on')){
            $(this).removeClass('on')
        }else{
            $(this).addClass('on')
        }
        $('#filterNum').text($('#qualities .on').length) 
        $('#filterNum').css('display','inline-block') 
    })

    $(document).on('click','#fit_people .people',function(e){
        var $this = $(this)
        $('#fit_people .people').removeClass('on')
        $this.addClass('on')
        $('#filterNum').text($('#qualities .on').length)
        $('#filterNum').css('display','inline-block')   
    })

    $(document).on('click','#pics .pic ',function(e){
        var $this = $(this)
        if($('#pics .pic').hasClass('on')){
            $('#pics .pic ').removeClass('on')
            $this.addClass('on')
        }else{
            $this.addClass('on')
            $('#filterNum').text($('#qualities .on').length) 
            $('#filterNum').css('display','inline-block')  
        }
    })


    $('#submit').click(function(){
        var brand_uuids = []
        $('#branks .on').each(function(){
            brand_uuids.push($(this).attr('data-id'))
        })
        var category_uuids = []
        $('#categories .on').each(function(){
            category_uuids.push($(this).attr('data-id'))
        })
        var quality_uuids =[]
        $('#quality_uuids .on').each(function(){
            quality_uuids.push($(this).attr('data-id'))
        })
        var price_low = $('#pics .on').attr('data-vl')
        var price_high = $('#pics .on').attr('data-vt')
        var fit_people = $('#fit_people .on').attr('data-id')
        localStorage.setItem('brand_uuids',JSON.stringify(brand_uuids))
        localStorage.setItem('category_uuids',JSON.stringify(category_uuids))
        localStorage.setItem('quality_uuids',JSON.stringify(quality_uuids))
        localStorage.setItem('price_low',price_low)
        localStorage.setItem('price_high',price_high)
        localStorage.setItem('fit_people',fit_people)
        localStorage.setItem('brankNum',$('#brankNum').text())
        localStorage.setItem('classifyNum',$('#classifyNum').text())
        localStorage.setItem('filterNum',$('#filterNum').text())
        if(localStorage.getItem('keyword') == '' || localStorage.getItem('keyword') == null ){
            window.location.href = '/wap/shop/house?type=1'
        }else{
            window.location.href = '/wap/shop/house_success'
        }
    })

    $('#clear').click(function(){
        var page = $('#nav .on').closest('li').attr('id')
        if(page == 'brank'){
            $('#brankNum').text(0)
            $('#brankNum').css('display','none')
            $('#branks .clearJs').removeClass('on')
            localStorage.removeItem('brand_uuids')
            localStorage.setItem('brankNum','0')
        }else if(page =='classify'){
            $('#classifyNum').text(0)
            $('#classifyNum').css('display','none')
            $('#classifyBOX .clearJs').removeClass('on')
            localStorage.removeItem('category_uuids')
            localStorage.setItem('classifyNum','0')
        }else if(page == 'filter'){
            $('#filterNum').text(0)
            $('#filterNum').css('display','none')
            $('#filterBOX .clearJs').removeClass('on')
            localStorage.removeItem('quality_uuids')
            localStorage.removeItem('price_low')
            localStorage.removeItem('price_high')
            localStorage.removeItem('fit_people')
            localStorage.setItem('filterNum','0')
        }

    })

})