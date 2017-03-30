$(function(){ 
    var width = document.body.offsetWidth;
    console.log(width)
    // 轮播
    $.post('/adapter/wap/homePage/getNewIndex',function(ds){
    	var ds = eval("("+ds+")")
    	// 轮播
    	var viwe_l = ds.result.viwepager_list
    	for(var i=0;i<viwe_l.length; i++){
    		var viwe_data = {
    			uuid:viwe_l[i].uuid
    			,main_img:viwe_l[i].main_img
    			,title:viwe_l[i].title
    		}
    		var html = template('swiper',viwe_data)
    		$('#swiperJs').append(html)
    	}
    	var mySwiper = new Swiper('.swiper-container', {
      		autoplay: 3000,//可选选项，自动滑动
      		pagination : '.swiper-pagination',
      	    mousewheelControl:true,
            autoplayDisableOnInteraction:false,
            loop:true,
    	})
        
        var zone = ds.result.special_zone_list
        for(var i = 0;i<zone.length;i++){// 秒杀
            if(zone[i].type == '1'){
                var pro = zone[i].product_list
                addDom(pro,'TodayHtml','TodayPage')
            }
        }

       

        var ToSwiper = new Swiper('.swiper-today', {
            initialSlide :1,
            pagination : '.swiper-pagination',
            // centeredSlides:true,
            slidesPerView:1.1,
            mousewheelControl:true,
            paginationType:'progress',
        })


    })

    function addDom(pro,page,id){
        console.log(id)
        for(var i =0 ;i<pro.length; i++){
            var todayData = {
                uuid: pro[i].uuid
                ,min_img:pro[i].main_img_min
                ,name: pro[i].product_name
                ,title: pro[i].remark
                ,xianjia:pro[i].price
                ,yuanjia:pro[i].ori_price
                ,baozhenxian: true
                ,chengse:pro[i].quality_info.name
            }
            var html = template(page,todayData)
            $('#'+id).append(html)
        }
    }

	
    // zhekou
    var ZheSwiper = new Swiper('.swiper-zhekou', {
        pagination : '.swiper-pagination',
        // centeredSlides:true,
        slidesPerView:3.2,
        mousewheelControl:true,
    })
   $('#zhekou').on('click',function(){
   
   })
    
    
})