
// 页面加载 适配用的东东
(function(win, doc) {
    function change() {
        document.documentElement.style.fontSize = 40 * document.documentElement.clientWidth / 640 + 'px';
    }
    win.addEventListener('resize', change, false);
    doc.addEventListener('DOMContentLoaded', change, false);
    

})(window, document);

(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var aBtn = document.querySelectorAll('#div1 #btn');
        var aBox = document.querySelectorAll('#div1 div');

        for (var i = 0; i < aBtn.length; i++) {
            aBtn[i].index = i;
            aBtn[i].addEventListener('touchstart', function() {
                for (var i = 0; i < aBtn.length; i++) {
                    aBtn[i].classList.remove('active');
                    aBox[i].classList.remove('active');
                }
                this.classList.add('active');
                aBox[this.index].classList.add('active');
            }, false)
        }
    }, false)
})()
