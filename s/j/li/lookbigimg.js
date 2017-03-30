$(document).on('click','.lookbigimg',function (e) {
	var $this = $(this);
	var $src = $this.attr('src')
	$('body').append('<div class="jumu"><div></div><img src='+$src+' /></div>')
	var w = $(window).width() 
	var h = $(window).height()
	var allh =  document.body.scrollHeight
	// var imgW= $('.jumu img').width();
	// var imgH = $('.jumu img').height();
	$('.jumu').css({
  		'position': 'absolute'	
  		,'top': '0'
  		,'left': '0'
  		,'right': '0'
  		,'bottom': '0'
  		,'height': h+'px'
  		,'background-color': 'rgba(0, 0, 0, 0.6)'
 		,'z-index': '2000'
 		,'line-height':h+'px'
 		,'text-align':'center'
	})
	$('.jumu div').css({
		'height':'20px',
	})
	$('.jumu img').css({
		// 'display':'flex',
		'width' : '200px',
		'height':'200px',
		'z-index':'999',
		'position': 'absolute',
            'top':'50%',
            'left':'50%',
            'margin-left':'-100px',
            'margin-top':'-100px',
            'text-align': 'center'
	})
	// $('body').css('overflow','hidden')
	// var imgW= $('.jumu img').width();
	// var imgH = $('.jumu img').height();
	// var wid = (w-imgW)/2;
	// var hei = (h-imgH)/2 < 0 ? -(h-imgH)/2 : (h-imgH)/2;
	// $('.jumu img').css({
	// 	'top' : hei+'px',
	// 	'left':wid+'px',
	// 	'right':wid+'px'
		// 'margin-top': hei+'px',
		// 'margin-left':wid+'px'
	// })
})

		
$(document).on('click', '.jumu', function(e) {
	// $('body').css('overflow','visible')
	$('.jumu').remove()
})
$(document).on('click', '.jumu img', function(e) {
	// $('body').css('overflow','visible')
	$('.jumu').remove()	
})