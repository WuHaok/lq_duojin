function inputIsVaild(obj){
    var clear = $(obj).next('.form-clear');
    if(obj.value != '' && $(obj).attr('data-icon') != 'false'){
        clear.show();
    }
    $(obj).on('input',function(){
        if(obj.value != ''){
            clear.show();
        }else{
            clear.hide();
        }
    })
}
function inputClear(obj){
    var input = $(obj).prev('input');
    input.val('');
    $(obj).hide();
}
function inputInit(){
    var input = $('[type=text],[type=email],[type=password]');
    for(var i = 0;i < input.length;i++){
        inputIsVaild(input[i]);
    }
}
/**
 * 表单验证：以validform（http://validform.rjboy.cn/）插件为基础增加交互效果
 * param: 
 *      btnSubmit:提交按钮的ID,
 *      success:表单提交服务器返回成功码后执行动作，
 *      error：表单提交服务器返回错误代码后执行动作，
 */      
$.fn.inputVaild = function(conf){
    var def = {
        form: function(form){
            return JSON.stringify($(form).serializeObject())
        },
        success: function(){},
        error: function(){}
    }
    var options = $.extend({},def,conf);
    var vaildForm = this.Validform({
        ajaxPost: true,
        tipSweep: true,
        tiptype:function(msg,o,cssctl){
            if(o.type == 3){ 
                $(o.obj).parent('.form-group').addClass('has-error');
                $.toast(msg,"cancel");
            }
            if(o.type == 2){
                $(o.obj).parent('.form-group').removeClass('has-error');
            }
        },
        beforeSubmit:function(curform){
            $.showLoading("操作执行中");
            vaildForm.config({
                ajaxpost:{
                    data:options.form(curform)
                }
            })
            
        },
        callback:function(data){
            if(data.status == 0){
                $.hideLoading();
                $.toast("操作成功");
                options.success();
            }else{
                $.hideLoading();
                $.toast(data.message_detail,"cancel");
                options.error();
            }
        }
    });
}