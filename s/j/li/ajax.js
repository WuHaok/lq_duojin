//异步
function post(url,data,callback) {
    $.ajax({
        type: 'POST',
        url: line+url,
        data: data,
        dataType:'json',
        success: callback,
        headers:{
            'token':user.token
        }
    });
}
//同步
function postasync(url,data,callback) {
    $.ajax({
        type: 'POST',
        url: line+url,
        data: data,
        dataType:'json',
        async: false,
        success: callback,
        headers:{
            'token':user.token
        }
    });
}

setTimeout(function () {
    $('#app').css('visibility','inherit')
},1000)