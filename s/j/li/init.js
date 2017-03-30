/**
 * Created by Administrator on 2016/12/29.
 */
//设置页面单位大小的基数
var html = document.documentElement || document.body;
var designWidth = 750;
var deviceWidth = html.clientWidth;
html.style.fontSize = deviceWidth *100/ designWidth +"px";