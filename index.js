var main = document.getElementById("main");
var oLis = document.querySelectorAll("#main>ul>li");
var desW = 640;
/*设计稿的宽*/
var desH = 960;
/*设计稿的高*/
var winW = document.documentElement.clientWidth;
var winH = document.documentElement.clientHeight;
if (winW / winH < desW / desH) {
    //缩放的时候,要么按照winW/desW缩放,要么按照winH/desH来缩放
    //设备宽高比例<设计稿的宽高比例,就按照winH/desH 来缩放
    //设备宽高比例>设计稿的宽高比例,就按照winW/desW 来缩放
    main.style.webkitTransform = "scale(" + winH / desH + ")";
} else {
    main.style.webkitTransform = "scale(" + winW / desW + ")";
}

var audioDemo = document.querySelector("#audioDemo"), musicBtn = document.querySelector("#musicBtn");
//->1s后在开始播放音乐加载音频文件,在此期间我们先加载其他的内容
window.setTimeout(function () {
    audioDemo.play();//->开始播放:此时需要先加载音频文件
    audioDemo.addEventListener("canplay", function () {
        //->canplay:当前可以播放音乐了
        musicBtn.style.display = "block";
        musicBtn.className = "musicMove";
    }, false);

    //->这一块应该写一个完正的单击行为,我此时先用touchend代替(不是正常的写法)
    musicBtn.addEventListener("touchend", function () {
        if (audioDemo.paused) {//->当前处于暂停状态
            audioDemo.play();
            musicBtn.className = "musicMove";
            return;
        }
        audioDemo.pause();
        musicBtn.className = "";
    }, false);
}, 1000);

//给每个li绑定触摸事件(touchstart,touchmove,touchend)
[].forEach.call(oLis, function () {
    var oLi = arguments[0];
    oLi.index = arguments[1];
    oLi.addEventListener("touchstart", start, false);
    oLi.addEventListener("touchmove", move, false);
    oLi.addEventListener("touchend", end, false);
})

window.setTimeout(function(){
    oLis[0].lastElementChild.id="a0";
},1000);
function start(e) {
    //获得初始触摸点坐标
    this.startY = e.touches[0].pageY;
    this.startX = e.touches[0].pageX;
}
function move(e) {
    e.preventDefault();/*阻止默认的滚动行为*/
    this.flag = true;/*表示滑动而不是点击*/
    //记录下移动的时候的触摸点的坐标
    var moveY = e.touches[0].pageY;
    var moveX = e.touches[0].pageX;
    //记录移动的距离 可以知道滑动的方向
    var movePos = moveY - this.startY;
    if(Math.abs(moveX-this.startX)>Math.abs(movePos)){
        this.flag = false;
        return;

    }

    var index = this.index;
    var lastItem = oLis.length - 1;
    [].forEach.call(oLis,function(){
        //除了自己其他所有的所隐藏(通过索引来判断当前这张是不是自己)
        if(index != arguments[1]){
            arguments[0].style.display = "none";
        }
        arguments[0].className = "";
        arguments[0].firstElementChild.id = "";
    })
    if (movePos > 0) {//下滑动
        //获得上一张的索引(通过当前这张的索引知道上一张的索引)
        this.prevsIndex = index == 0 ? lastItem : index - 1;
        //往下滑动处理的逻辑
        //1.当往下滑的时候,上一张在最上面(上一张增加类名zIndex),并且只有当前这张和上一张显示,其他的都隐藏
        //2.一开始滑动的实话,上一张首先到元素高度的一半的区域(往上移动了一半),然后跟随着鼠标往下滑动背景图也往下移动(背景图移动的距离 = 滑动的距离)

        var duration = -480+movePos;
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+duration+"px)";


    } else if (movePos < 0) {//上滑动
        //获得下一张的索引(通过当前这张的索引知道下一张的索引)
        this.prevsIndex = index == lastItem?0:index+1;
        //下一张往下移动元素的一半
        var duration = 480+movePos;
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,"+duration+"px)";
    }

    oLis[this.prevsIndex].className ="zIndex";
    oLis[this.prevsIndex].style.display = "block";
    //处理当前这张的效果
    //1.缩放值 = 移动的距离/设备的高度 2.移动的距离 = 滑动的距离
    //往上滑动时负的值,刚好是往上移动
    //往下滑动时是正的值,刚好是往下移动
    //scale是0-1之间的数
    this.style.webkitTransform = "scale("+(1-Math.abs(movePos/winH)*1/2)+") translate(0,"+movePos+"px)";

}
function end(e) {
    if(this.flag){
        //让上一张或者下一张都回到0,0的位置
        oLis[this.prevsIndex].style.webkitTransform = "translate(0,0)";
        oLis[this.prevsIndex].style.webkitTransition = "0.5s";
        oLis[this.prevsIndex].addEventListener("webkitTransitionEnd",function(){
            this.style.webkitTransition = "";
            //增加执行动画的id名
            this.firstElementChild.id = "a"+this.index

        },false)
        this.flag = false;
    }
}
//调试用的
document.addEventListener("touchmove",function(e){

})