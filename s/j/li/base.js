//目前支持单张图片上传  转为base64
//请使用dom方法 暂不支持jquery  方便使用vue 等原生js
//返回一个方法  类似于返回ajax

var getbase64 = function (obj, callback) {
    $.showLoading("正在加载...");
    var file = obj.files[0]
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        var base = e.target.result
        var data = {
            base64_list: [
                {base64: base}
            ]
        }
        post('/adapter/wap/upload/viaBase64', JSON.stringify(data), function (data) {
            $.hideLoading();
            return callback(data.result.img_list)
        })
    }
}
// var getbase64ES = function (obj, callback) {
//     $.showLoading("正在加载...");
//     var files = obj.files
//     var t = files.length;
//     for (var i = 0; i < files.length; i++) {
//         var file = files[i]
//         var c = i;
//         var reader = new FileReader();
//         reader.readAsDataURL(file);
//         reader.onload = function (e) {
//             var base = e.target.result
//             console.log(base)
//             s(t, c, base, callback);
//         }
//     }
// }
// var imgList = []
// var base64_list = []
// function s(t, i, base, callback) {
//     base64_list.push(
//         {base64: base}
//     )
//     console.log(t);
//     console.log(i);
//     if (i == t - 1) {
//         var pdata = {
//             base64_list: base64_list
//         }
//         console.log(base64_list);
//         console.log(pdata);
//         postasync('/adapter/wap/upload/viaBase64', JSON.stringify(pdata), function (data) {
//             $.hideLoading();
//             imgList.push(data.result.img_list)
//         })
//     }
//     console.log(imgList)
//     return callback(imgList);
// }

var cc
var getbase64ES = function (obj, callback) {
    $.showLoading("正在加载...");
    var files = obj.files
    baseList = []
    cc = files.length
    for (var i = 0; i < files.length; i++) {
        console.log("read")
        getfileDate(files[i], i, callback)
    }
}

var baseList = []
var getfileDate = function (file, i, callback) {
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function (e) {
        baseList.push({'base64': e.target.result})
        console.log(cc);
        console.log(i);
        if (cc == i + 1) {
            var pdata = {
                base64_list: baseList
            }
            postasync('/adapter/wap/upload/viaBase64', JSON.stringify(pdata), function (ds) {
                $.hideLoading();
                return callback(ds.result.img_list)
            })
        }
    }
}
