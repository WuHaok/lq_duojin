// 提交
$('#confirm').on('click',function(){
	var workid = $('#workIng').val()-0
	switch (workid){
		case 0 ://gongzuo
			var data = {
    		    order_uuid : GetQueryString('order_uuid')
    		    ,unit_type: 0
    		    ,unit_name:$('#work_name').val()
    		    ,unit_province:$('#work_addr').val().split(" ")[0]
    		    ,unit_city:$('#work_addr').val().split(" ")[1]
    		    ,unit_area:$('#work_addr').val().split(" ")[2]
    		    ,unit_detail:$('#work_detail').val()
    		    ,unit_tel:$('#work_mobile').val()
    		}
			break;
		case 1://meigongzuo
			var data = {
				order_uuid : GetQueryString('order_uuid')
    		    ,unit_type: 2
			}
			break;
		case 2: //xuesheng
			var data = {
    		    order_uuid : GetQueryString('order_uuid')
    		    ,unit_type: 1
    		    ,unit_name:$('#school_name').val()
    		    ,unit_province:$('#school_addr').val().split(" ")[0]
    		    ,unit_city:$('#school_addr').val().split(" ")[1]
    		    ,unit_area:$('#school_addr').val().split(" ")[2]
    		    ,unit_detail:$('#school_detail').val()
    		    ,unit_tel:$('#school_mobile').val()
    		    ,chsi_screenshot:$('#studentBox img').attr('src')
    		}
			break;
	}
	if((workid == 2 || workid == 0) && data.unit_name == ''){
		$.alert('请填写单位/学校名')
	}else if((workid == 2 || workid == 0) && data.unit_province == ''){
		$.alert('请选择单位/学校地址')
	}else if((workid == 2 || workid == 0) && data.unit_tel == ''){
		$.alert('请输入单位/学校电话')
	}else if(workid == 2 && (data.chsi_screenshot == '' || data.chsi_screenshot == undefined) ){
		$.alert('请上传学信网截图')
	}else{

		data.car_hand = $('#carUpBox img').attr('src')
   		data.house_hand = $('#houseUpBox img').attr('src')
   		var imgbox =[]
    	$('#otherUpBox img').each(function(e){
    		imgbox.push($(this).attr('src'))
    	})
    	data.fixed_assets =JSON.stringify(imgbox)
    		
    	 post('/adapter/wap/order/authStep2',JSON.stringify(data),function(ds){
    	    if(ds.status == 0){
    	      window.location.href = '../instalment/authPage3.html?order_uuid='+data.order_uuid
    	    }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
				window.location.href = '../../../personal/land.html';
			}else {
				$.alert(ds.message)
			}
    	})
    }
})
$('#goback').on('click',function(){
	window.history.back() 
})
//页面加载
$(function(){
	working()
	$("#work_addr").cityPicker({
        title: "请选择工作住址"
    });
    $('#school_addr').cityPicker({
    	title:"请选择学校地址"
    })
    $('#workIng').val(0);
    init()
})

function init(){
   var querydata = {
        order_uuid : GetQueryString('order_uuid')
    }
    post('/adapter/wap/order/getAuth',JSON.stringify(querydata),function(ds){
        if(ds.status == 0){
        	debugger
            var l = ds.result
           	var unit_province = l.unit_province == null ? '' :l.unit_province 
           	var unit_city = l.unit_city == null ? '' : l.unit_city
           	var unit_area = l.unit_area == null ? '' : l.unit_area
            workid = l.unit_type-0
            switch (workid){
				case 0 ://gongzuo
				$('.work').show()
			$('.student').hide()
    			    $('#workIng').val(0)
    			    $('#work_name').val(l.unit_name)
    			    $('#work_addr').val(unit_province +' '+unit_city + '' + unit_area)
    			    $('#work_detail').val(l.unit_detail)
    			    $('#work_mobile').val(l.unit_tel)
					break;
				case 2://meigongzuo
					$('#workIng').val(1)
					$('.work').hide()
					$('.student').hide()
					break;
				case 1: //xuesheng
					$('.work').hide()
					$('.student').show()
					$('#workIng').val(2)
    			    $('#school_name').val(l.unit_name)
    			    $('#school_addr').val(l.unit_province +' '+l.unit_city + '' + l.unit_area)
    			    $('#school_detail').val(l.unit_detail)
    			    $('#school_mobile').val(l.unit_tel)
    			    if(l.chsi_screenshot == null){
    			    	$('#studentUp').before("<div class='img-box'><img src='"+l.chsi_screenshot+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
						$('#studentUp').hide()
					}
					break;
			}
			if(l.car_hand != null){
   		    	$('#carUp').before("<div class='img-box'><img src='"+l.car_hand+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
   				$('#carUp').hide()
   			}
   			if(l.house_hand != null){
   				$('#houseUp').before("<div class='img-box'><img src='"+l.house_hand+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
   				$('#houseUp').hide()
   			}
   			var orderimg = eval(l.fixed_assets)
   			for(var w = 0 ;w < orderimg.length ; w++){
   				$('#otherUp').before("<div class='img-box'><img src='"+orderimg[w]+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
   				if(w==9){
   					$('#otherUp').hide()
   				}
   			}        
        }else if(ds.status == 501 || ds.status == 502 || ds.status == 600 ){
			window.location.href = '../../../personal/land.html';
		}
    })
}





function inputaddr(ele){
   $('input').blur()
}
$('#workIng').on('change',function(){
	working()
})
var	working = function(){
	var workid = $('#workIng').val()-0
	switch (workid){
		case 0 :
			$('.work').show()
			$('.student').hide()
			break;
		case 1:
			$('.work').hide()
			$('.student').hide()
			break;
		case 2: 
			$('.work').hide()
			$('.student').show()
			break;
	}
}
// 实例
$('#handhouse').on('click',function(){
	$("#handhousePage").popup();
})
$('#handstudent').on('click',function(){
	$("#handstudentPage").popup();
})
$('#handcar').on('click',function(){
	$("#handcarPage").popup();
})
$('.close-popup').on('click',function(){
	$.closePopup()
})
/* 	图片
	手持照上传
*/
// var imgChangecar = function(obj){
// 	$("#carUpBox").change(function() {
//         $.showLoading("正在加载...");
//          var allreadynum = $("#carUpBox  img").length;
//         var selectnum = $(this).find('input').prop('files').length;
//         if (allreadynum + selectnum <= 1) {
// 	        $(obj).parent().submit();
//             $('#carUp').hide()
//         }else{
//             $('#carUp').show()
//         }
//     })
// }
// var uploadCallbackcar = function(data){
// 	var data = eval("(" + data + ")");
// 	var imgsrc = data.urlList[0].maxurl
// 	$('.car-img').remove()
// 	$('#carUp').before("<div class='img-box'><img src='"+imgsrc+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
// 	$.hideLoading();
// }
function imgChangecar(obj){
	$("#carUpBox").change(function() {
		$.showLoading("正在加载...");
		var selectnum = $(this).find('input').prop('files').length;
		getbase64(obj, function (dataimg) {
			var allreadynum = $("#carUpBox  img").length;
			if (allreadynum + selectnum <= 1) {
				$('#carUp').hide()
				$('#carUp').before("<div class='img-box'><img src='" + dataimg + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
				$.hideLoading();
			} else {
				$.alert('请您上传一张图片')
				$('#carUp').show()
			}
		})
	})
}

// var imgChangestudent = function(obj){
// 	$("#studentBox").change(function() {
//         $.showLoading("正在加载...");
//          var allreadynum = $("#studentBox  img").length;
//         var selectnum = $(this).find('input').prop('files').length;
//         if (allreadynum + selectnum <= 1) {
// 	        $(obj).parent().submit();
//             $('#studentUp').hide()
//         }else{
//             $('#studentUp').show()
//         }
//     })
// }
// var uploadCallbackstudent = function(data){
// 	var data = eval("(" + data + ")");
// 	var imgsrc = data.urlList[0].maxurl
// 	$('.student-img').remove()
// 	$('#studentUp').before("<div class='img-box'><img src='"+imgsrc+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
// 	$.hideLoading();
// }


function imgChangestudent(obj){
	$("#studentBox").change(function() {
		$.showLoading("正在加载...");
		var selectnum = $(this).find('input').prop('files').length;
		getbase64(obj, function (dataimg) {
			var allreadynum = $("#studentBox  img").length;
			if (allreadynum + selectnum <= 1) {
				$('#studentUp').hide()
				$('#studentUp').before("<div class='img-box'><img src='" + dataimg + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
				$.hideLoading();
			} else {
				$.alert('请您上传一张图片')
				$('#studentUp').show()
			}
		})
	})
}


// var imgChangehouse = function(obj){
// 	$("#houseUpBox").change(function() {
//         $.showLoading("正在加载...");
//          var allreadynum = $("#houseUpBox  img").length;
//         var selectnum = $(this).find('input').prop('files').length;
//         if (allreadynum + selectnum <= 1) {
// 	        $(obj).parent().submit();
//             $('#houseUp').hide()
//         }else{
//             $('#houseUp').show()
//         }
//     })
// }
// var uploadCallbackhouse = function(data){
// 	var data = eval("(" + data + ")");
// 	var imgsrc = data.urlList[0].maxurl
// 	$('.house-img').remove()
// 	$('#houseUp').before("<div class='img-box'><img src='"+imgsrc+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
// 	$.hideLoading();
// }
function imgChangehouse(obj){
	$("#houseUpBox").change(function() {
		$.showLoading("正在加载...");
		var selectnum = $(this).find('input').prop('files').length;
		getbase64(obj, function (dataimg) {
			var allreadynum = $("#houseUpBox  img").length;
			if (allreadynum + selectnum <= 1) {
				$('#houseUp').hide()
				$('#houseUp').before("<div class='img-box'><img src='" + dataimg + "' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
				$.hideLoading();
			} else {
				$.alert('请您上传一张图片')
				$('#houseUp').show()
			}
		})
	})
}


// var imgChangeother = function(obj){
// 	$.showLoading("正在加载...");
// 	$("#otherUpBox").change(function() {
// 		var allreadynum = $("#otherUpBox  img").length;
// 		var selectnum = $(this).find('input').prop('files').length;
// 		if (allreadynum + selectnum <= 9) {
// 			$(obj).parent().submit();
// 			$('#upimg').css('display', 'inline-block')
// 			if (allreadynum + selectnum == 9) {
// 				$('#upimg').css('display', 'none')
// 			}
// 		} else {
// 			$.alert("最多9张图");
// 		}
// 	});
// }
// var uploadCallbackother = function(data){
// 	var data = eval("(" + data + ")");
// 	var  imgList= data.urlList
// 	// $('.other-img').remove()
// 	for(var i=0 ; i<imgList.length;i++){
// 		var imgsrc = imgList[i].maxurl
// 		$('#otherUp').before("<div class='img-box'><img src='"+imgsrc+"' class='lookbigimg zhifubao-img'/><button class='img-del' onclick='imgDel(this)'></button></div>")
// 	}
// 	$.hideLoading();
// }
function GetQueryString(name){
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
function imgDel(e) {
	var $this = $(e)
	$this.closest('.imgbox').find('.upimgs').show()
	$this.closest('div').remove()
	
}
var clearinput = function(){
    $('input').blur()
}