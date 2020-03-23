"use strict";$(function(){//var ServerAddress = "//10.240.169.175:8080";
//var ServerAddress = "//10.240.170.167:8080";
//测试地址
//var ServerAddress = "//10.240.171.7/yiying";
//正式地址
var ServerAddress="//h.tool.netease.com/yiying";var MobileShare=null;var eleType={backGround:"1",//背景
img:"2",//图片
txt:"3",//文本
audio:"4",//音频
video:"5",//弹层视频
slide:"6",//幻灯片
input:"7",//输入框
button:"8",//按钮
tab:"9",//tab
activityContent:"10",//活动内容
frames:"11",//帧动画
shape:"12",//形状
progress:"13",//进度条
richText:"14",//富文本
fullVideo:"15",//全屏视频
anchor:"16",//锚点
randomImg:"26"//随机图片
};var CONST_SHARE={};var NEED_LOADING=false;if($("#hasLoadingPage").length)NEED_LOADING=true;var USER_AGENT=navigator.userAgent;function AudioPlayer(url,isLoop){this._elTpl='<div style="display:none;"><audio src="" preload '+(isLoop?"loop":"")+"></audio></div>",this._elCtl=url?$(this._elTpl).find("audio").attr("src",url)[0]:null;}AudioPlayer.prototype={constructor:AudioPlayer,play:function play(){this._elCtl.play();},pause:function pause(){this._elCtl.pause();},stop:function stop(){this._elCtl.pause();this._elCtl.currentTime=0;},on:function on(eventType,cbk){var that=this;this._elCtl.addEventListener(eventType,function(){cbk.call(that._elCtl,{});});return this;},init:function init(){var that=this;if(this._elCtl){//解决安卓微信平台无法自动播放的问题 微信版本 6.3.13和6.3.18亲测有效
document.addEventListener("WeixinJSBridgeReady",function(){that._elCtl.play();//调用播放函数
},false);//同样方法去试易信，无效
// document.addEventListener("YixinJSBridgeReady", function () {
//    that._elCtl.play();;//调用播放函数
// }, false);
that._elCtl.play();$("body").one("touchstart",function(){that._elCtl.play();//return false;
});}return this;}};var bgAudioUrl=$(".music").data("audio"),firstPageAudioUrl=$(".firstPageAudio").attr("href"),bgAudio,firstPageAudio;if(firstPageAudioUrl){//播放首屏音效
firstPageAudio=new AudioPlayer(firstPageAudioUrl,false);}if(bgAudioUrl){//背景音乐
bgAudio=new AudioPlayer(bgAudioUrl,true);}//处理iphone不会自动播放音效的问题
if(USER_AGENT.toLowerCase().indexOf("iphone")>-1){/*
     * 有首屏音效则优先播放，不然播放背景音乐
     */if(firstPageAudio){firstPageAudio.init();}else if(bgAudio){bgAudio.init();}}var pageTransition=function(){function Touch($el,isLongPage){// CONSTANTS
this._MOVE_THRESHOLD=20;this._TAP_TIME=150;var that=this;this._el=$el;this._scrollEl=this._el.find(".innerWrap");this.direction="";this._viewHeight=$("body").height();this._moveTop=0;this._moveBottom=-(this._el.find(".innerWrap").height()-$("body").height());this._isBoundary=false;// 长页面是否碰触到 边界阈值
this._threshold=80;this._disArr=[{},{}];this._isLongPage=!!isLongPage;this._qBefore={left:null,right:null,top:null,bottom:null};this._q={left:[],right:[],top:[],bottom:[],tap:[]};this._qAfter={left:null,right:null,top:null,bottom:null};this._el.bind("touchstart",function(e){// Handle swipe events
that._beginPos=that._getTouchPos(e);that._scrollElTop=that._getY(that._scrollEl);that._endPos=that._getTouchPos(e);that.timer&&clearTimeout(that.timer);that._scrollTimer&&clearTimeout(that._scrollTimer);// Handle tap events
that._isTap=true;that._disArr=[{time:new Date().getTime(),Y:that._beginPos.y},{time:new Date().getTime(),Y:that._beginPos.y}];setTimeout(function(){that._isTap=false;},that._TAP_TIME);}).bind("touchmove",function(e){// Handle swipe events
that._endPos=that._getTouchPos(e);that._dispatchTouchmove(e,this);var offset=that._endPos.y-that._beginPos.y;if(isLongPage){offset=that._scrollElTop*1+offset;if(offset>that._moveTop){//划过顶部
offset=offset/(offset/that._viewHeight+1);}else if(offset<that._moveBottom){//滑动底部
offset-=that._moveBottom;offset=offset/(Math.abs(offset)/that._viewHeight+1)+that._moveBottom;}that._setY(that._scrollEl,offset);that._disArr.push({time:new Date().getTime(),Y:that._endPos.y});that._scrollTimer&&clearTimeout(that._scrollTimer);that._scrollTimer=setTimeout(function(){that._scrollEnd();},200);}// Handle tap events
that._isTap=false;return false;}).bind("touchend",function(e){that._scrollTimer&&clearTimeout(that._scrollTimer);if(isLongPage){that._scrollEnd();}// Handle tap events
that._dispatchTap(e,this);});}Touch.prototype={_triggerQueue:function _triggerQueue(name,e,context){var queue=this._q[name];if(queue){for(var i=queue.length;i--;){if(this._isLongPage&&(name=="top"||name=="bottom")){if(this._isBoundary){queue[i]&&queue[i].call(context,e);this._isBoundary=false;//重置属性
}}else{queue[i]&&queue[i].call(context,e);}}}return this;},_getY:function _getY(el){var cssTransform=el.css("-webkit-transform");var reg=/[-]?\d+([.]?\d+)?/g;if(typeof cssTransform!=="string"||cssTransform==""||cssTransform=="none"){return 0;}var numArr=cssTransform.match(reg);return numArr[2];},_setY:function _setY(el,y){el.css({"-webkit-transform":"translate3d(0,"+y+"px,0)"});},//惯性滑动
_scrollEnd:function _scrollEnd(){var distance,//超出边缘需要修正的长度
offset,//当前偏移值
now,//当前时间
dist;//实际移动距离
distance=0;var that=this;offset=that._getY(that._scrollEl);if(offset>that._moveTop){distance=-offset;if(offset>that._threshold){that._isBoundary=true;}}else if(offset<that._moveBottom){distance=that._moveBottom-offset;if(distance>that._threshold){that._isBoundary=true;}}else{now=new Date().getTime();while(that._disArr[0]&&now-that._disArr[0].time>200){that._disArr.shift();}if(that._disArr[0]&&that._disArr[0].Y){time=now-that._disArr[0].time;dist=that._endPos.y-that._disArr[0].Y;if(Math.abs(dist)>10){distance=(2-time/500)*2*dist;}}}that._scroll(distance);},_scroll:function _scroll(distance){var offset,m=40,finalOffset,_distance,dtime,fx,callback,distance;_distance=0;offset=parseInt(this._getY(this._scrollEl));finalOffset=offset+distance;if(finalOffset>0){if(finalOffset>m){distance=m-offset;_distance=-m;}else{_distance=-finalOffset;}}else if(finalOffset<this._moveBottom){if(finalOffset<this._moveBottom-m){distance=this._moveBottom-m-offset;_distance=m;}else{_distance=this._moveBottom-finalOffset;}}dtime=400*Math.abs(distance)/(Math.abs(distance)+Math.abs(_distance));if(distance>400){dtime=Math.abs(distance)/(Math.abs(distance)-400)*dtime;}else if(distance<400){dtime=dtime*1.8;}if(dtime>800)dtime=800;var that=this;callback=function callback(){that.slide(_distance,400-dtime,"ease-in-out");};this.slide(distance,dtime,fx,callback);},slide:function slide(distance,during,fx,callback){var _this=this,_callback=callback||new Function(),_init=parseInt(_this._getY(_this._scrollEl)),//初始值
_change=distance,//变化量
_stime=0,//初始时间
_during=during||400,//动画时间
_fx=fx||"ease-out";//缓动效果
//缓动效果计算公式
function animate(t,b,c,d,fx){var re;switch(fx){case"ease-in-out":if((t/=d/2)<1)re=c/2*t*t*t+b;else re=c/2*((t-=2)*t*t+2)+b;break;default:re=-c*((t=t/d-1)*t*t*t-1)+b;break;}return re;}function run(){if(distance&&_stime<_during){_stime+=10;_this._setY(_this._scrollEl,animate(_stime,_init,_change,_during,_fx));_this.timer=setTimeout(run,10);}else{_this.during=false;_this._setY(_this._scrollEl,_init+distance);_callback.call(_this,null);}}this.during=true;clearTimeout(this.timer);run();},_getTouchPos:function _getTouchPos(e){e=e.originalEvent?e.originalEvent:e;return{x:e.touches[0].pageX,y:e.touches[0].pageY};},_getAngle:function _getAngle(dx,dy){return Math.atan2(dy,dx)*180/Math.PI;},_dispatchTouchmove:function _dispatchTouchmove(e,context){var diffX=this._endPos.x-this._beginPos.x,diffY=this._endPos.y-this._beginPos.y;angle=this._getAngle(diffX,diffY);if(Math.abs(diffX)<this._MOVE_THRESHOLD&&Math.abs(diffY)<this._MOVE_THRESHOLD){return this;}if(angle>=-45&&angle<45){this.direction="right";}else if(angle>=45&&angle<135){this.direction="bottom";}else if(angle>=-135&&angle<-45){this.direction="top";}else if(angle>=135&&angle<=180||angle>=-180&&angle<-135){this.direction="left";}return this;},_dispatchTap:function _dispatchTap(e,context){switch(this.direction){case"right":this._triggerQueue("right",e,context);break;case"left":this._triggerQueue("left",e,context);break;case"top":this._triggerQueue("top",e,context);break;case"bottom":this._triggerQueue("bottom",e,context);break;default:return this;}this.direction="";return this;},destroy:function destroy(){this._el.unbind("touchstart touchmove");this._el=null;this._q=null;return this;},// Accept  'tap' | 'left' | 'right' | 'up' | 'down'
on:function on(eventType,callback){this._q[eventType]&&this._q[eventType].push(callback);return this;}};var imgLoader={_srcs:[],_onLoaded:null,_onLoading:null,load:function load(){var srcs=this._srcs,l=srcs.length,loadCount=0,that=this,tmp,i;function onImgLoad(){if(++loadCount===l){that._onLoading&&that._onLoading(Math.floor(loadCount/l*100));that._onLoaded&&that._onLoaded();}else{that._onLoading&&that._onLoading(Math.floor(loadCount/l*100));}}if(!l){that._onLoaded&&that._onLoaded();return this;}for(i=l;i--;){tmp=new Image();tmp.src=srcs[i];tmp.onload=onImgLoad;tmp.onerror=onImgLoad;}return this;},init:function init(arrSrcs,onLoaded,onLoading){this._srcs=arrSrcs.slice(0);this._onLoaded=onLoaded;this._onLoading=onLoading;return this;}};//视频
var video={_elTpl:'<div style="display:none;position:fixed;z-index:999999;-webkit-box-orient:horizontal;-webkit-box-align:center;'+'width: 100%; left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,0.75);">'+'<video src="" style="float:left;width:100%;display:block;height:auto !important; max-height: 90%; object-fit:fill;"'+'controls="controls" x-webkit-airplay="true" webkit-playsinline playsinline x5-playsinline></video>'+"</div>",_popEl:null,_videoEl:null,_videoCtl:null,open:function open(url){//this._popEl.show();
this._popEl.css({display:"-webkit-box"});this._videoEl.attr("src",url);this._videoCtl.play();return this;},close:function close(){this._videoCtl.pause();this._popEl.hide();this._videoEl.attr("src","");return this;},init:function init(){var that=this,height;this._popEl=$(this._elTpl);this._videoEl=this._popEl.find("video");this._videoCtl=this._videoEl[0];height=$(window).width()*9/16;// this._videoEl.css({
//     height: height,
//     marginTop: height / -2
// });
this._videoEl.bind("touchstart",function(e){e.stopPropagation();});this._popEl.bind("touchstart",function(){if($(".music").length>0){pages._playProjectBgAudio();}that.close();return false;});$("body").append(this._popEl);return this;}};//音频
var audio={_elTpl:'<div style="display:none;"><audio src="" preload autoplay loop></audio></div>',_elCtl:null,play:function play(){this._elCtl.play();return this;},pause:function pause(){this._elCtl.pause();return this;},init:function init(url){var that=this;if(url){this._elCtl=$(this._elTpl).find("audio").attr("src",url)[0];$(function(){//解决安卓微信平台无法自动播放的问题 微信版本 6.3.13和6.3.18亲测有效
document.addEventListener("WeixinJSBridgeReady",function(){that._elCtl.play();//调用播放函数
},false);//同样方法去试易信，无效
// document.addEventListener("YixinJSBridgeReady", function () {
//    that._elCtl.play();;//调用播放函数
// }, false);
that._elCtl.play();});$("body").one("touchstart",function(){that._elCtl.play();return false;});}return this;}};var myAudio={_elTpl:'<div style="display:none;"><audio  class="myAudio" src="" preload></audio></div>',_elCtl:null,_isPlay:false,play:function play(){this._elCtl.play();this._isPlay=true;return this;},pause:function pause(){this._elCtl.pause();return this;this._isPlay=false;},init:function init(url){var that=this;if(url){this._elCtl=$(this._elTpl).find("audio").attr("src",url)[0];}$("body").append(this._elCtl);$(".myAudio")[0].addEventListener("ended",function(){that._isPlay=false;});}};//帧动画构造函数（针对安卓系统，播放视频帧动画）
function AnimPlayer(imgEle,frameList,time,audio,endCbk){this._startTime=null;//帧动画播放开始的时间，是为了之后调整帧数的
this._currentIndex=0;//当前播放的帧索引
this._frame=frameList;//帧动画序列
this._imgEle=imgEle;//元素容器
this._frameCount=frameList.length||0;//总的帧数
this._totalTime=time;//总的播放时间
this._perTime=time*1000/this._frame.length;//每一帧需要的时间 (毫秒)
this._bgAudio=audio;this._endCbk=endCbk;this._isPlay=false;//是否正在播放
this._setFrame(0);}AnimPlayer.prototype={constructor:AnimPlayer,//设置某一帧
_setFrame:function _setFrame(frameIndex){this._currentIndex=frameIndex;this._imgEle.attr("src",this._frame[frameIndex]);},//停止播放
stop:function stop(){this._isPlay=false;this._setFrame(0);this._bgAudio.stop();},//播放帧动画
play:function play(){var that=this;//循环播放帧动画
function renderLoop(){var nowTime=new Date();//通过当前时间和初始时间，推算出当前播放的帧索引
var currentIndex=Math.floor((nowTime-that._startTime)/that._perTime);if(currentIndex>that._currentIndex&&that._isPlay){currentIndex=currentIndex>that._frameCount-1?that._frameCount-1:currentIndex;that._setFrame(currentIndex);if(currentIndex==that._frameCount-1){//帧动画播放完毕
//关闭对应的音频
that._bgAudio.stop();//执行结束回调
that._endCbk&&that._endCbk();}}if(that._currentIndex<that._frameCount-1&&that._isPlay){requestAnimationFrame(renderLoop);}}//设置播放视频帧动画时的起始时间
this._startTime=new Date();that._setFrame(0);that._isPlay=true;renderLoop();return this;}};var util={addCSSRule:function addCSSRule(sheet,selector,rules,index){index=index||0;if("insertRule"in sheet){sheet.insertRule(selector+"{"+rules+"}",index);}else if("addRule"in sheet){sheet.addRule(selector,rules,index);}},isAndroid:function isAndroid(){return USER_AGENT.indexOf("Android")>-1;},isIOS:function isIOS(){return USER_AGENT.toLowerCase().indexOf("iphone")>-1||USER_AGENT.toLowerCase().indexOf("ipad")>-1;},isSafari:function isSafari(){return USER_AGENT.indexOf("Safari")>-1&&ua.indexOf("Chrome")<1;},isWeChat:function isWeChat(){var ua=USER_AGENT.toLowerCase();return /micromessenger/.test(ua)?true:false;},isYixin:function isYixin(){return /yixin/i.test(USER_AGENT);},isComicApp:function isComicApp(){return USER_AGENT.indexOf("NeteaseComic")!=-1;},isXiaomi:function isXiaomi(){return /XiaoMi/i.test(USER_AGENT);},isiPad:function isiPad(){return USER_AGENT.indexOf("iPad")>-1;},isYueduApp:function isYueduApp(){return USER_AGENT.indexOf("PRIS")!=-1;},isSnail:function isSnail(){return /NeteaseSnailReader/i.test(USER_AGENT);},isMusic:function isMusic(){return /NeteaseMusic\/([\d\.]+)\b/i.test(USER_AGENT);},isLofter:function isLofter(){return /lofter/i.test(USER_AGENT);},isWMApp:function isWMApp(){return this.isLofter()||this.isYueduApp()||this.isComicApp()||this.isSnail()||this.isMusic()||this.isYixin();},isNewsApp:function isNewsApp(){return /newsapp/i.test(USER_AGENT);},isiPlayApp:function isiPlayApp(){return /iPlay/i.test(USER_AGENT);},isCainApp:function isCainApp(){return /cain/i.test(USER_AGENT);},isGameChannelApp:function isGameChannelApp(){return this.isiPlayApp()||this.isCainApp();},isQQ:function isQQ(){return USER_AGENT.indexOf("QQ/")!==-1;},isUpIos9:function isUpIos9(){return /OS [9|10|11|12|13]/i.test(USER_AGENT);},isWeibo:function isWeibo(){return /weibo/i.test(USER_AGENT);},initGetScript:function initGetScript(){if($.getScript)return;var _getScript=function _getScript(url,callback){var head=document.getElementsByTagName("head")[0],js=document.createElement("script");js.setAttribute("type","text/javascript");js.setAttribute("src",url);head.appendChild(js);//执行回调
var callbackFn=function callbackFn(){if(typeof callback==="function"){callback();}};if(document.all){//IE
js.onreadystatechange=function(){if(js.readyState=="loaded"||js.readyState=="complete"){callbackFn();}};}else{js.onload=function(){callbackFn();};}};$.getScript=_getScript;},toAbsolutePath:function toAbsolutePath(rPath){if(!rPath||rPath.indexOf("://")>-1)return rPath||"";if(!location.search.length)return location.href.split("index.html")[0]+rPath;return location.href.split("?")[0].split("index.html")[0]+rPath;}};function scroll(ele,scrollTo,time){var top=Touch.prototype._getY(ele);var scrollFrom=parseInt(top),i=0,runEvery=5;scrollTo=parseInt(scrollTo);if(0===time){Touch.prototype._setY(ele,0);return;}time/=runEvery;var interval=setInterval(function(){i++;top=(scrollTo-scrollFrom)/time*i+scrollFrom;Touch.prototype._setY(ele,top);if(i>=time){clearInterval(interval);}},runEvery);}var findJumpUrl=function findJumpUrl(actionList){var jumpData=actionList.find(function(item){return item.actionType=="JumpUrl";});jumpData=!jumpData||jumpData.url;return jumpData;};//触发器 管理
var triggerManager={triggerActionList:function triggerActionList(triggerData,eventType,cbk){if(triggerData&&triggerData!=="undefined"){var eventAction=this.getTriggerActionList(triggerData,eventType);this.trigger(eventAction.actionList||[],eventType,cbk);}},//根据事件类型获取交互内容
getTriggerActionList:function getTriggerActionList(triggerData,evenType){var action={};for(var i in triggerData){if(triggerData[i].eventType==evenType){action=triggerData[i];break;}}return action;},trigger:function trigger(actionList,eventType,cbk){var i=0,count=actionList&&actionList.length||0,action;for(i;i<count;i++){action=actionList[i];if(action.actionType=="Statistics"){action.url=findJumpUrl(actionList);}this.triggerAction(action,eventType,i);}//回调
cbk&&cbk();},//触发单个行为
triggerAction:function triggerAction(param,eventType,actionIndex){var actionType=param.actionType;return this[actionType]&&this[actionType](param,eventType,actionIndex);},//显示元素
ShowEle:function ShowEle(param){var targetEleList=param.targetEleList||[];var $page=$(".page-current").length?$(".page-current"):$(".page-init");for(var index in targetEleList){//var $targetEle = $("#"+targetEleList[index]).parent(".elementWrap");
var $targetEle=$page.find('[data-id$="'+targetEleList[index]+'"]').parent(".elementWrap");$targetEle.removeClass("hide").addClass("show");if($targetEle.hasClass("invisible")){$targetEle.removeClass("invisible");}}},//隐藏元素
HideEle:function HideEle(param){var targetEleList=param.targetEleList||[];for(var index in targetEleList){$("#"+targetEleList[index]).parent(".elementWrap").removeClass("show").addClass("hide");}},//跳转页面
JumpPage:function JumpPage(param){pages.initRandomImg();//跳转页面时随机切换图片
pages.initRandomVar();//跳转页面时切换随机数
var jumpPage=param.jumpPage,type=jumpPage.type,pageIndexList=jumpPage.pageIndexList,len=pageIndexList.length,i,pageIndex;if(type!=3){if(type==0){//跳转到指定页
pageIndex=jumpPage.pageIndex;}else if(type==1){//范围页内随机跳转页面
var startIndex=jumpPage.pageRangeStart,endIndex=jumpPage.pageRangeEnd;if(startIndex>endIndex){startIndex=jumpPage.pageRangeEnd;endIndex=jumpPage.pageRangeStart;}pageIndex=startIndex+Math.round((endIndex-startIndex)*Math.random());}else if(type==2){//指定页面集中随机跳转页面
i=Math.floor(len*Math.random());pageIndex=pageIndexList[i];}if(pageIndex>-1){pages.jumpToPage(pageIndex);}}else if(type==3){if(!$(".var-value").length)return;var logicTypeS=jumpPage.logicTypeS,logicTypeM=jumpPage.logicTypeM,logicTypeE=jumpPage.logicTypeE,logicValueS=jumpPage.logicValueS,logicValueE=jumpPage.logicValueE,logicPageIndex=jumpPage.logicPageIndex,value=$(".var-value").eq(0).html();if(logicPageIndex<0)return;var logicUtil={"1":function _(v1,v2){return v1>v2;},"2":function _(v1,v2){return v1<v2;},"3":function _(v1,v2){return v1==v2;},"4":function _(v1,v2){return v1>=v2;},"5":function _(v1,v2){return v1<=v2;},"6":function _(v1,v2){return v1!=v2;}};if(logicTypeM==1){logicUtil[logicTypeS].call(null,parseInt(value),parseInt(logicValueS))&&logicUtil[logicTypeE].call(null,parseInt(value),parseInt(logicValueE))&&pages.jumpToPage(logicPageIndex);}else if(logicTypeM==2){(logicUtil[logicTypeS].call(null,parseInt(value),parseInt(logicValueS))||logicUtil[logicTypeE].call(null,parseInt(value),parseInt(logicValueE)))&&pages.jumpToPage(logicPageIndex);}}},//跳转链接
JumpUrl:function JumpUrl(param){var url=param.url;//延时一段时间，先处理其他动作然后再跳转
setTimeout(function(){window.location.href=url;},50);},//下载链接
Download:function Download(param){var url="";if(util.isIOS()){url=param.iosUrl;if($.trim(url)==""){return false;}_paq.push(["trackLink",param.iosUrl,"download"]);}else{url=param.andUrl;if($.trim(url)==""){return false;}_paq.push(["trackLink",param.andUrl,"download"]);}//console.log( url );
setTimeout(function(){window.location.href=url;},50);},//回到顶部
BackTop:function BackTop(param){if($(event.target)&&$(event.target).closest(".innerWrap").length)scroll($(event.target).closest(".innerWrap").eq(0),0,0);},//文本提示
ShowTips:function ShowTips(param){var tips=param.tips;//alert(tips);
Toast.show(tips);},//播放动画
PlayAnim:function PlayAnim(param,eventType,actionIndex){var eleAnimList=param.eleAnimList;for(var i in eleAnimList){var anim=eleAnimList[i].animList;var eleId=eleAnimList[i].eleId;pages._playAnim($("#"+eleId),anim,0,eventType+"_"+actionIndex);}},//设置分享相关
// SetShare : function(param){
//     var share = param.share,
//         type = share.type,
//         title = share.title,
//         circleTitle = share.circleTitle,
//         content = share.content;
//
//     if(type == 0){
//         //使用默认分享设置
//         MobileShare.updateShare({
//             title: $("#share_title").html() || document.title,
//             desc: $("#share_desc").html() || $("#description").html(),
//             circleTitle:$("#share_circle_title").html() || $("#share_title").html() || document.title
//         });
//     }else if(type == 1){
//         //使用自定义分享设置
//         MobileShare.updateShare({
//             title: title || $("#share_title").html() || document.title,
//             desc: content || $("#share_desc").html() || $("#description").html(),
//             circleTitle: circleTitle || $("#share_circle_title").html() || $("#share_title").html() || document.title
//         });
//     }else if(type == 2){
//         //分享引导弹层
//         MobileShare.showShare();
//     }
// },
SetShare:function SetShare(param){superHybrid.share(param);},//显示子页面
ShowSubPage:function ShowSubPage(param){var sceneIndex=param.sceneIndex,sceneLayout=param.sceneLayout;pages._layoutScene(sceneIndex,sceneLayout);pages._showScene(sceneIndex);},//隐藏子页面
HideSubPage:function HideSubPage(param){var closeSceneIndex=param.closeSceneIndex;pages._closeScene(closeSceneIndex);},//播放弹层视频
PlayPopVideo:function PlayPopVideo(param){var videoUrl=param.videoUrl;//若有背景音乐，则先关闭背景音乐
if(videoUrl){if($(".music").length>0){pages._stopProjectBgAudio();}pages._playVideo(videoUrl);}},//拨打电话
MakeCall:function MakeCall(param){var telNo=param.telNo;window.location.href="tel:"+telNo;},//切换幻灯片
NavSlide:function NavSlide(param){var slide=param.slide,eleId=slide.eleId,operation=slide.operation;if(eleId){if(!operation||operation==="prev"){pages.slideSet[eleId].slidePrev();}else if(operation==="next"){pages.slideSet[eleId].slideNext();}}},//查看图片
ViewImg:function ViewImg(param){var viewImg=param.viewImg,id=viewImg.id+"_viewImg",url=viewImg.url,width=viewImg.width,height=viewImg.height;if(url){if($("#"+id).length>0){$("#"+id).show();}else{//此处宽高都是750标准 所以要除以/2
// var widthToRem = width/2 * 7.5 /document.documentElement.clientWidth;
// var heightToRem = height/2 * 7.5/document.documentElement.clientWidth;
var $wrap=$("<div></div>").attr("id",id);var $img=$("<img />").attr("src",url);$img.css({position:"absolute",left:"50%",top:"50%",maxWidth:"100%",maxHeight:"100%",// width : widthToRem + "rem",
// height : heightToRem + "rem",
"-webkit-transform":"translate(-50%, -50%)"});$wrap.css({position:"fixed",left:0,right:0,top:0,bottom:0,zIndex:99999,backgroundColor:"rgba(0, 0, 0, 0.7)"});$wrap.append($img);$("body").append($wrap);$wrap.bind("click",function(){$(this).hide();});$wrap.bind("touchmove",function(){return false;});}}},//点击统计
Statistics:function Statistics(param){var actionName=param.actionName;if(actionName){if((actionName=="download"||actionName=="下载")&&param.url){_paq.push(["trackLink",param.url,"download"]);}else{_paq.push(["trackEvent","clickEvent",actionName]);}}},SubmitForm:function SubmitForm(param){var target=$(event.target);var submitFormName=param.submitFormName;target.data("name",submitFormName);pages.submitForm(target);},SetValue:function SetValue(param){if(param&&param.changeVariableType=="1"){$(".var-value").html(+$(".var-value").html()+ +param.variable);}else if(param&&param.changeVariableType=="-1"){$(".var-value").html(+$(".var-value").html()-+param.variable);}else if(param&&param.changeVariableType==="0"){$(".var-value").html(param.variable);}},//设置字符变量
SetStringValue:function SetStringValue(param){var value=$("#"+param.bindEle).val();value=value.slice(0,6);$(".string-var-value").text(value);},//播放音频
PlayAudio:function PlayAudio(param){var url=param.audioUrl;pages._stopAllAudio();$(".myAudio").remove();myAudio.init(url);myAudio.play();}};var $pages=$(".page"),currentIndex=0,isAnimating=false,endCurrPage=true,endNextPage=true,// isPlayVideo = util.isIOS() && util.isWeChat();  //微信已不支持视频自动播放
isPlayVideo=false;var superHybrid={initShare:function initShare(){if(util.isWMApp()){util.initGetScript();// $.getScript('./js/lib/Share.min.js', function(){
//     Share && Share.setOrUpdate && Share.setOrUpdate({
//          'title': CONST_SHARE.SHARE_TITLE,
//          'description': CONST_SHARE.SHARE_DESC,
//          'activityId': (new Date().getTime())+'',
//          'picurl': util.toAbsolutePath(CONST_SHARE.SHARE_IMG),
//          'text': CONST_SHARE.SHARE_DESC
//      });
// });
//  http://easyread.nosdn.127.net/web/trunk/1514366545830/share-dist.js
//  https://easyread.nosdn.127.net/components/nw_share/share-dist.js
$.getScript("https://easyread.nosdn.127.net/components/nw_share/share-dist.js?"+new Date().getTime(),function(){Share&&Share.setOrUpdate&&Share.setOrUpdate({title:CONST_SHARE.SHARE_TITLE,description:CONST_SHARE.SHARE_DESC,activityId:new Date().getTime()+"",picurl:util.toAbsolutePath(CONST_SHARE.SHARE_IMG),text:CONST_SHARE.SHARE_DESC});});}else if(util.isNewsApp()){util.initGetScript();$.getScript("./js/lib/NewsAppClient.min.js",function(){var $newsAppShareHtml=$('<div style="display:none" id="__newsShareInfo"></div>');$newsAppShareHtml.html('<div id="__newsapp_sharetext">'+CONST_SHARE.SHARE_TITLE+"</div>"+'<div id="__newsapp_sharephotourl">'+util.toAbsolutePath(CONST_SHARE.SHARE_IMG)+"</div>"+'<div id="__newsapp_sharewxtitle">'+CONST_SHARE.SHARE_TITLE+"</div>"+'<div id="__newsapp_sharewxtext">'+CONST_SHARE.SHARE_DESC+"</div>"+'<div id="__newsapp_sharewxurl">'+location.href+"</div>"+'<div id="__newsapp_sharewxthumburl">'+util.toAbsolutePath(CONST_SHARE.SHARE_IMG)+"</div>");$("body").append($newsAppShareHtml);});}else if(util.isGameChannelApp()){util.initGetScript();$.getScript("./js/lib/iPlayAppClient.min.js",function(){iPlayAppClient&&iPlayAppClient.setShareInfo&&iPlayAppClient.setShareInfo(CONST_SHARE.SHARE_TITLE,CONST_SHARE.SHARE_DESC,util.toAbsolutePath(CONST_SHARE.SHARE_IMG),window.location.href);});}else{(function(){var wxShareStart=function wxShareStart(timestamp,nonceStr,signature){window.share_config={share:{imgUrl:CONST_SHARE.SHARE_IMG,desc:CONST_SHARE.SHARE_DESC,title:CONST_SHARE.SHARE_TITLE,link:window.location.href,success:function success(){},cancel:function cancel(){}},shareTimeline:{imgUrl:CONST_SHARE.SHARE_IMG,desc:CONST_SHARE.SHARE_DESC,title:CONST_SHARE.SHARE_CIRCLE_TITLE,link:window.location.href,success:function success(){},cancel:function cancel(){}}};wx.config({debug:false,// 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
appId:"wxf3008aef7a8c2546",// 必填，公众号的唯一标识
timestamp:timestamp||"",// 必填，生成签名的时间戳
nonceStr:nonceStr||"",// 必填，生成签名的随机串
signature:signature||"",// 必填，签名，见附录1
jsApiList:["onMenuShareTimeline","onMenuShareAppMessage"]// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});wx.ready(function(){wx.onMenuShareAppMessage(share_config.share);//分享给好友
wx.onMenuShareTimeline(share_config.shareTimeline);//分享到朋友圈
wx.onMenuShareQQ(share_config.share);//分享给手机QQ
});};// return;
// var GLOBAL_imgUrl = CONST_SHARE.SHARE_IMG;
// var GLOBAL_lineLink = window.location.href;
// var GLOBAL_descContent = CONST_SHARE.SHARE_DESC;
// var GLOBAL_shareTitle = CONST_SHARE.SHARE_TITLE;
// var GLOBAL_appid = '';
//
// MobileShare && MobileShare.init && MobileShare.init({
//     title: CONST_SHARE.SHARE_TITLE,//分享给朋友的分享标题
//     desc: CONST_SHARE.SHARE_DESC,//分享给朋友的分享描述
//     url: location.href,//分享地址,若不指定，默认以当前页面地址作为分享地址
//     imgurl: CONST_SHARE.SHARE_IMG,//分享图片
//     circleTitle: CONST_SHARE.SHARE_CIRCLE_TITLE,//分享到朋友圈的标题。不填则与title一致
//     guideText: CONST_SHARE.SHARE_GUIDE_TEXT,//微信中点分享按钮（参数button）显示的分享引导语
//     qrcodeIcon: CONST_SHARE.SHARE_IMG,//二维码图标
//     shareCallback: function(res) {//微信易信分享回调res=｛type:0,res:[微信返回的提示]｝res.type：0表示取消，-1：分享失败，1：分享到朋友圈，2：分享给好友，3：QQ，4：微博。易信只返回1或2两种情况。
//     },
//     wxSdkCallback:function(){//微信sdk加载完成后回调，可在此回调中调用微信JS-SDK的其他API,如上传图片等。
//     }
// });
util.initGetScript();$.getScript("./js/lib/jweixin-1.4.0.js",function(){$.ajax({url:ServerAddress+"/depend/getsign",dataType:"jsonp",data:{url:location.href},success:function success(res){//console.log(res);
var d=$.parseJSON(res.data);//console.log(333, d);
if(res&&res.status==100){wxShareStart(d.timestamp,d.nonceStr,d.signature);}},error:function error(res){console&&console.log(res);}});});})();}},share:function share(param){var share=param.share||{},type=share.type||"",title=share.title||"",circleTitle=share.circleTitle||"",content=share.content||"";if(type==0){if(util.isWMApp()){Share&&Share.setOrUpdate&&Share.setOrUpdate({title:CONST_SHARE.SHARE_TITLE,description:CONST_SHARE.SHARE_DESC,activityId:new Date().getTime()+"",picurl:util.toAbsolutePath(CONST_SHARE.SHARE_IMG),text:CONST_SHARE.SHARE_DESC});}else if(util.isNewsApp()){$("#__newsapp_sharetext").html(CONST_SHARE.SHARE_TITLE);$("#__newsapp_sharewxtitle").html(CONST_SHARE.SHARE_TITLE);$("#__newsapp_sharewxtext").html(CONST_SHARE.SHARE_DESC);}else if(util.isGameChannelApp()){iPlayAppClient&&iPlayAppClient.setShareInfo&&iPlayAppClient.setShareInfo(CONST_SHARE.SHARE_TITLE,CONST_SHARE.SHARE_DESC,util.toAbsolutePath(CONST_SHARE.SHARE_IMG),window.location.href);}else{// MobileShare && MobileShare.updateShare({
//     title: CONST_SHARE.SHARE_TITLE,
//     desc: CONST_SHARE.SHARE_DESC,
//     circleTitle: CONST_SHARE.SHARE_CIRCLE_TITLE,
//     shareCallback: function(res) {
//     },
//     wxSdkCallback:function(){
//     }
// });
wx.onMenuShareAppMessage(share_config.share);//分享给好友
wx.onMenuShareTimeline(share_config.shareTimeline);//分享到朋友圈
wx.onMenuShareQQ(share_config.share);//分享给手机QQ
}Toast.show("分享内容设置成功！");}else if(type==1){if(util.isWMApp()){Share&&Share.setOrUpdate&&Share.setOrUpdate({title:title||CONST_SHARE.SHARE_TITLE,description:content||CONST_SHARE.SHARE_DESC,activityId:new Date().getTime()+"",picurl:util.toAbsolutePath(CONST_SHARE.SHARE_IMG),text:content||CONST_SHARE.SHARE_DESC});}else if(util.isNewsApp()){$("#__newsapp_sharetext").html(title||CONST_SHARE.SHARE_TITLE);$("#__newsapp_sharewxtitle").html(title||CONST_SHARE.SHARE_TITLE);$("#__newsapp_sharewxtext").html(content||CONST_SHARE.SHARE_DESC);}else if(util.isGameChannelApp()){iPlayAppClient&&iPlayAppClient.setShareInfo&&iPlayAppClient.setShareInfo(title||CONST_SHARE.SHARE_TITLE,content||CONST_SHARE.SHARE_DESC,util.toAbsolutePath(CONST_SHARE.SHARE_IMG),window.location.href);}else{// MobileShare && MobileShare.updateShare({
//     title: title || CONST_SHARE.SHARE_TITLE,
//     desc: content || CONST_SHARE.SHARE_DESC,
//     circleTitle: circleTitle || CONST_SHARE.SHARE_CIRCLE_TITLE
// });
var shareNew={};$.extend(shareNew,share_config.share);shareNew.title=title||CONST_SHARE.SHARE_TITLE;shareNew.desc=content||CONST_SHARE.SHARE_DESC;var shareTimelineNew={};$.extend(shareTimelineNew,share_config.shareTimeline);shareTimelineNew.title=circleTitle||CONST_SHARE.SHARE_CIRCLE_TITLE;wx.onMenuShareAppMessage(shareNew);//分享给好友
wx.onMenuShareTimeline(shareTimelineNew);//分享到朋友圈
wx.onMenuShareQQ(shareNew);//分享给手机QQ
}Toast.show("分享内容设置成功！");}else if(type==2){if(util.isWMApp()){if(util.isComicApp()||util.isSnail()||util.isYueduApp()||util.isLofter()){Share&&Share.share&&Share.share();}else{Toast.show("敬请期待！");}}else if(util.isNewsApp()){NewsAppClient&&NewsAppClient.share&&NewsAppClient.share();}else if(util.isGameChannelApp()){iPlayAppClient&&iPlayAppClient.share&&iPlayAppClient.share();}else{if(util.isAndroid()&&$(".page-init .inline-video, .page-current .inline-video").length){setTimeout(function(){$(".page-init .inline-video video, .page-current .inline-video video").hide();},0);setTimeout(function(){$(".page-init .inline-video video, .page-current .inline-video video")[0].pause();},300);$("#NIE-share-m").one("click",function(){setTimeout(function(){$(".page-init .inline-video video, .page-current .inline-video video")[0].play();$(".page-init .inline-video video, .page-current .inline-video video").show();},200);});}//MobileShare && MobileShare.showShare();
//显示分享引导弹层
$("#share-tip p").html(CONST_SHARE.SHARE_GUIDE_TEXT);$("#share-tip").show();}}}};//关闭引导弹窗
$(".closeTip").click(function(e){setTimeout(function(){$("#share-tip").hide();},300);});var preLoader=function(){var _loadCount=0,//已加载的元素个数
_resTotal=0,//总的资源总数
_loadingWrapId="loading_wrap",_loadingBgId="loading_bg",_bgColor="#000",_loadingCoverId="loading_cover",_coverColor="#D82627",SVGPATH="M3.81,59.362c4.914-10.654,13.879-18.791,25.923-23.527l8.315-3.272l-5.484,7.053 c-8.277,10.642-11.22,23.372-7.874,34.06c2.41,7.7,7.817,13.377,14.834,15.567c0.897,0.28,1.824,0.532,2.751,0.743 c1.317,0.302,2.141,1.612,1.842,2.933c-0.26,1.135-1.269,1.902-2.386,1.902c-0.181,0-0.363-0.018-0.548-0.063 c-1.05-0.238-2.101-0.522-3.12-0.843c-8.572-2.678-15.15-9.521-18.048-18.778c-3.035-9.697-1.617-20.771,3.728-30.879 C16.791,48.535,11.51,54.364,8.258,61.412c-0.565,1.229-2.017,1.765-3.25,1.199C3.782,62.042,3.245,60.587,3.81,59.362 M60.953,114.029c-0.218-1.338-1.476-2.251-2.81-2.025c-11.115,1.81-21.698,0.634-31.456-3.496 C11.055,101.887,2.534,86.483,5.481,70.172c0.241-1.326-0.642-2.604-1.973-2.841c-1.326-0.239-2.604,0.642-2.847,1.973 c-3.365,18.616,6.325,36.184,24.117,43.713c7.406,3.139,15.235,4.714,23.378,4.714c3.534-0.002,7.13-0.297,10.775-0.894 C60.266,116.621,61.171,115.362,60.953,114.029 M37.06,100.959c-1.314-0.33-2.638,0.477-2.962,1.789 c-0.324,1.312,0.476,2.636,1.789,2.964c3.217,0.796,6.63,1.194,10.219,1.194c3.455,0,7.07-0.369,10.822-1.107 c22.023-4.318,34.219-17.328,40.078-23.575c0.926-0.985,0.876-2.537-0.112-3.462c-0.986-0.924-2.533-0.874-3.458,0.112 c-5.512,5.875-16.976,18.106-37.449,22.12C49.041,102.354,42.673,102.348,37.06,100.959 M67.451,109.804 c-1.291,0.399-2.011,1.772-1.61,3.066c0.326,1.051,1.296,1.721,2.339,1.721c0.24,0,0.486-0.038,0.728-0.111 c20.514-6.384,38.353-21.873,39.774-34.529c0.543-4.853-1.483-8.868-5.708-11.312c-8.188-4.739-15.886,1.483-24.033,8.076 c-7.666,6.201-16.353,13.226-27.498,13.987c-1.351,0.093-2.368,1.258-2.278,2.609c0.095,1.35,1.257,2.389,2.609,2.275 c12.691-0.868,22.423-8.736,30.244-15.064c8.45-6.833,13.47-10.563,18.504-7.648c2.543,1.472,3.62,3.612,3.292,6.534 C102.768,88.756,87.577,103.541,67.451,109.804 M118.184,73.116c-1.349,0.102-2.356,1.278-2.256,2.626 c0.532,7.034-2.956,15.151-9.821,22.854c-12.703,14.25-33.172,23.596-53.417,24.391c-1.352,0.049-2.403,1.189-2.352,2.538 c0.053,1.317,1.139,2.354,2.447,2.354c0.032,0,0.063,0,0.096-0.003c21.53-0.842,43.323-10.814,56.878-26.021 c7.762-8.705,11.688-18.112,11.053-26.481C120.706,74.024,119.561,73.02,118.184,73.116 M155.635,6.069 c-11.11,9.629-24.017,10.082-36.277,9.72c-1.313-0.066-2.479,1.022-2.522,2.375c-0.038,1.351,1.025,2.478,2.38,2.519 c10.571,0.317,21.608,0.04,31.96-5.578c-8.125,13.001-21.137,12.316-38.178,11.42c-14.067-0.745-30.015-1.586-45.781,6.124 c-18.351,8.974-26.21,22.177-25.748,30.646c0.247,4.474,2.728,7.881,6.816,9.355c1.234,0.441,2.421,0.645,3.574,0.645 c5.025,0,9.412-3.838,14.346-8.153c5.466-4.783,12.273-10.735,22.523-14.532c4.912-1.821,6.572-5.978,5.675-9.148 c-0.818-2.886-3.996-5.532-9.046-4.524c-3.737,0.748-7.559,2.103-11.405,4.043c-0.769,0.389-4.662,2.568-7.881,4.747 c-2.915,1.971-8.311,6.978-9.086,7.756c-1.109,1.113-2.173,2.256-3.19,3.424c-0.884,1.02-0.777,2.567,0.243,3.451 c0.463,0.406,1.036,0.604,1.605,0.604c0.684,0,1.362-0.283,1.849-0.841c1.554-1.788,3.235-3.516,5.017-5.163 c0.653-0.602,4.036-3.667,9.602-7.339c4.742-3.128,9.613-4.963,14.206-5.882c1.766-0.348,3.094,0.062,3.374,1.058 c0.286,1.006-0.538,2.434-2.663,3.221C75.929,50.13,68.748,56.41,62.98,61.455c-6.002,5.255-9.306,7.934-13.037,6.588 c-2.242-0.804-3.449-2.494-3.586-5.014c-0.387-7.126,7.389-18.344,23.008-25.979c14.627-7.152,29.897-6.343,43.374-5.635 c19.575,1.034,38.063,2.006,46.805-22.678L162.642,0L155.635,6.069z M104.831,52.178c-9.535,1.983-18.539,3.857-29.992,13.876 C58.57,80.297,49.55,82.932,40.37,76.132c-4.084-3.023-6.122-9.104-5.316-15.859c0.774-6.53,5.545-22.981,32.969-34.595 c14.141-5.99,27.637-5.971,41.37-5.388c1.388,0.083,2.492-0.995,2.549-2.345c0.058-1.351-0.993-2.492-2.344-2.549 c-14.312-0.603-28.407-0.612-43.484,5.775C36.328,33.786,31.069,52.314,30.189,59.695C29.18,68.192,31.963,76,37.455,80.067 c4.213,3.116,8.393,4.505,12.633,4.505c8.794,0,17.85-5.968,27.975-14.83c10.485-9.174,18.493-10.84,27.765-12.769 c8.287-1.728,17.481-3.641,29.356-11.432c-6.409,10.7-14.584,15.898-20.879,18.414c-1.257,0.503-1.867,1.928-1.364,3.186 c0.504,1.255,1.928,1.864,3.18,1.363c8.711-3.482,20.615-11.5,27.89-29.901l3.419-8.652l-7.234,5.851 C125.167,47.947,114.829,50.097,104.831,52.178 M15.224,77.763c-0.185-1.336-1.421-2.264-2.759-2.089 c-1.34,0.187-2.276,1.422-2.091,2.763c1.001,7.259,5.666,17.186,15.758,23.278c0.396,0.24,0.831,0.352,1.264,0.352 c0.829,0,1.638-0.418,2.098-1.182c0.699-1.158,0.327-2.661-0.83-3.361C20.037,92.316,16.034,83.626,15.224,77.763",_options={resList:[],// [{type:"image" : list ; []},{type:"script" : list ; []}]
loadedCbk:null,defaultAnimation:true,customLoadingFn:null};var ww=window.innerWidth,lw=165,lh=130;_loadWrapWidth=lw;_loadWrapHeight=lh;function init(){var resList=_options.resList,count=0;for(var index in resList){var res=resList[index];count+=res&&res.list&&res.list.length||0;}_resTotal=count;if(_options.defaultAnimation){_createLoadingWrap();show();}}function load(options){for(var i in options){_options[i]=options[i];}init();var i=0,res=_options.resList,typeLen=res.length,resItemList=[];for(i;i<typeLen;i++){resItemList=res[i];//加载资源
_loadingResList(resItemList.type,resItemList.list);}}//加载资源
function _loadingResList(type,resList){var i=0,l=resList.length,tmp;for(i;i<l;i++){switch(type){case"image"://加载图片
tmp=new Image();tmp.src=resList[i];tmp.onload=onLoad;tmp.onerror=onLoad;break;case"script"://加载scirpt
var tmp=document.createElement("script");tmp.src=resList[i];tmp.onload=onLoad;tmp.onerror=onLoad;document.body.appendChild(tmp);break;default:break;}}function onLoad(){if(++_loadCount==_resTotal){setTimeout(function(){hide();},450);}else{var per=_loadCount/_resTotal;if(per>1){per=1;}if(typeof _options.customLoadingFn=="function"){_options.customLoadingFn(per);}if(_options.defaultAnimation){document.getElementById(_loadingCoverId).style.clip="rect("+(_loadWrapHeight-_loadWrapHeight*per)+"px,"+_loadWrapWidth+"px,"+_loadWrapHeight+"px,0)";}}}}function hide(){function callbackFun(){_options.loadedCbk&&_options.loadedCbk();}if(_options.defaultAnimation){var loadId_ele=document.getElementById(_loadingWrapId);loadId_ele.style.webkitTransition="all 300ms linear";loadId_ele.style.transition="all 300ms linear";loadId_ele.style.opacity="0";setTimeout(function(){document.body.removeChild(loadId_ele);callbackFun();},300);}else{callbackFun();}}function show(){var cover=document.getElementById(_loadingCoverId);cover.style.height=lh+"px";cover.style.clip="rect(130px 165px 130px 0)";}//构造loading容器
function _createLoadingWrap(){var loadingWrap=document.createElement("div");loadingWrap.id=_loadingWrapId;loadingWrap.style.cssText="position:fixed;z-index:9999;left:0;top:0;width:100%;height:100%;background:"+_bgColor+";overflow:hidden;margin:0;padding:0;";loadingWrap.innerHTML='<svg xmlns="https://www.w3.org/2000/svg" id="'+_loadingBgId+'" style="position:absolute;width:165px;height:130px;left:50%;top:50%;margin-left:-82px;margin-top:-75px;">'+"<g>"+'<path fill="#aaaaaa" d="'+SVGPATH+'" />'+"</g>"+"</svg>"+'<svg xmlns="https://www.w3.org/2000/svg" id="'+_loadingCoverId+'" style="position:absolute;width:165px;height:0;left:50%;top:50%;margin-left:-82px;margin-top:-75px;">'+"<g>"+'<path fill="'+_coverColor+'" d="'+SVGPATH+'" />'+"</g>"+"</svg>";document.body.appendChild(loadingWrap);}return{load:load};}();var pages={//tab是否是在执行事件中
isTabing:false,//当前显示的弹层
currentSceneIndex:-1,//有背景音效的页面Id集合
pageAudioSet:[],//幻灯片对象集合
slideSet:{},//预加载音频资源
preloadAudio:function preloadAudio(){var $audio=$(".pageAudio").not(".firstPageAudio"),that=this;$audio.each(function(){var id=$(this).data("id"),url=$(this).attr("href");that.pageAudioSet.push(id);that[id]=new AudioPlayer(url,false);});},//向前一页滑动
prevPage:function prevPage(curPageCbk){var self=this;var prevPageIndex=currentIndex-1;this.jumpToPage(prevPageIndex,curPageCbk);},//向后滑动
nextPage:function nextPage(curPageCbk){var self=this;var nextPageIndex=currentIndex+1;this.jumpToPage(nextPageIndex,curPageCbk);},//滑动到指定页面
jumpToPage:function jumpToPage(pageIndex,curPageCbk){//边界判断
if(pageIndex>-1&&pageIndex<$pages.length){var self=this;//正在执行动画 或者 跳转到当前页 则不执行
if(isAnimating||pageIndex==currentIndex){return false;}//是向前滑动还是向后滑动
var isPrev=pageIndex<currentIndex;var $currentPage=$pages.eq(currentIndex);isAnimating=true;endCurrPage=false;endNextPage=false;var $jumpPage=$pages.eq(pageIndex);var transition=$currentPage.data("transition");if(isPrev){//滑动至前一页
currentPageOutTransiotn=transition&&transition.prevTransition&&transition.prevTransition.currentOutTransition||"none";jumpPageInTransition=transition&&transition.prevTransition&&transition.prevTransition.jumpInTransition||"none";}else{//滑动至下一页
currentPageOutTransiotn=transition&&transition.nextTransition&&transition.nextTransition.currentOutTransition||"none";jumpPageInTransition=transition&&transition.nextTransition&&transition.nextTransition.jumpInTransition||"none";}//没有设置动画
if(currentPageOutTransiotn=="none"&&jumpPageInTransition=="none"){endCurrPage=true;endNextPage=true;self._stopFullVideo($currentPage);self.stopInlineVideo($currentPage);self.playInlineVideo($jumpPage);self._playPageAudio($jumpPage);self._playFullVideo($jumpPage);self.eventBindEles($jumpPage);self.resetEle($currentPage);self.resetPage($currentPage,$jumpPage);//执行当前页面回调
if($currentPage.find(".innerWrap").length>0){scroll($currentPage.find(".innerWrap"),0,500);}curPageCbk&&curPageCbk();}else{self._stopFullVideo($currentPage);setTimeout(function(){self.stopInlineVideo($currentPage);self.playInlineVideo($jumpPage);self._playFullVideo($jumpPage);self._playPageAudio($jumpPage);},1000);//当前页执行动画
if(currentPageOutTransiotn!="none"){if(jumpPageInTransition=="none"){endNextPage=true;$jumpPage.removeClass("page-hide").addClass("page-current down-page");}$currentPage.addClass(currentPageOutTransiotn).bind("webkitAnimationEnd",function(){$(this).unbind("webkitAnimationEnd");endCurrPage=true;//动画都执行完或者下一页没有动画重置
if(endCurrPage&&endNextPage){//执行完之后重置本页所有元素
self.resetEle($currentPage);self.eventBindEles($jumpPage);self.resetPage($currentPage,$jumpPage);//执行当前页面回调
if($currentPage.find(".innerWrap").length>0){scroll($currentPage.find(".innerWrap"),0,500);}curPageCbk&&curPageCbk();}});}//下一页执行动画
if(jumpPageInTransition!="none"){$jumpPage.removeClass("page-hide");if(currentPageOutTransiotn=="none"){endCurrPage=true;$currentPage.addClass("down-page");}setTimeout(function(){$jumpPage.addClass("page-current "+jumpPageInTransition).bind("webkitAnimationEnd",function(){$(this).unbind("webkitAnimationEnd");endNextPage=true;//动画都执行完或者下一页没有动画重置
if(endNextPage&&endCurrPage){//执行完之后重置本页所有元素
self.resetEle($currentPage);self.eventBindEles($jumpPage);self.resetPage($currentPage,$jumpPage);//执行当前页面回调
if($currentPage.find(".innerWrap").length>0){scroll($currentPage.find(".innerWrap"),0,500);}curPageCbk&&curPageCbk();}});},0);}}currentIndex=pageIndex;//html转图片的页面
if($jumpPage.hasClass("html2img")){setTimeout(function(){$(".myCanvas").remove();pages.initHtml2Img();},200);}}else{console.log("跳转的页面pageIndex超出了范围");return false;}},//重置页面属性
resetPage:function resetPage($outPage,$inPage){isAnimating=false;$inPage.attr("class",$inPage.data("originClass")+" page-current");$outPage.attr("class",$outPage.data("originClass")+" page-hide");},//播放当前页面所有元素动画
eventBindEles:function eventBindEles($page){var self=this;self.initTabState($page);var $ele=$page.find(".element").not(".swiper-container").not(".fullvideo");$ele.each(function(index,ele){var animData=$(ele).data("anim");var clickData=$(ele).data("click");//序列帧图片
if($(ele).data("eletype")==eleType.frames){$(ele).find(".frames").addClass("play");}//弹层视频
if($(ele).data("eletype")==eleType.video){var videoData=$(ele).data("video");$(ele).unbind("click").bind("click",function(){if($(".music").length>0){self._stopProjectBgAudio();}self._playVideo(videoData.videoUrl);});}if(animData&&animData.length>0){$(ele).parent(".elementWrap").removeClass("invisible");}self._playAnim($(ele),animData,0,"ele");//等触发器全部整改完以后 需要删除...
if(clickData){switch(clickData.type){//跳转内页
case 0:// $(ele).unbind("click").bind("click", function() {
//     if(self.currentSceneIndex > -1){
//         self._closeScene(self.currentSceneIndex);
//     }
//     self.jumpToPage(clickData.pageIndex);
// });
break;//跳转链接
case 1:// $(ele).unbind("click").bind("click", function() {
//     window.location.href = clickData.jumpUrl;
// });
break;//分享
case 2:// $(ele).unbind("click").bind("click", function() {
//     MobileShare.showShare();
// });
break;//播放视频
case 4:// $(ele).unbind("click").bind("click", function() {
//     if ($(".music").length > 0) {
//         self._stopProjectBgAudio();
//     }
//     self._playVideo(clickData.videoUrl);
// });
break;//显示弹窗
case 5:// self._layoutScene(clickData.sceneIndex, clickData.sceneLayout);
// $(ele).unbind("click").bind("click", function() {
//     self.currentSceneIndex = clickData.sceneIndex;
//     self._showScene(clickData.sceneIndex)
// });
break;//关闭弹窗
case 6:// $(ele).unbind("click").bind("click", function() {
//     self._closeScene(clickData.sceneIndex);
// });
break;//文字提示
case 7:// $(ele).unbind("click").bind("click", function(){
//     alert(clickData.tips || "敬请期待！");
// });
break;//返回顶部
case 8:$(ele).unbind("click").bind("click",function(){scroll($(ele).parents(".innerWrap").eq(0),0,0);});break;default:}}var triggerData=$(ele).data("trigger");if(triggerData&&triggerData!=="undefined"){$(ele).unbind("click").bind("click",function(e){e.preventDefault();e.stopPropagation();triggerManager.triggerActionList(triggerData,"click");});}});},//停止当前页面元素动画效果
resetEle:function resetEle($page){var self=this;var $ele=$page.find(".element").not(".swiper-container");$ele.each(function(index,ele){$(ele).attr("class",$(ele).data("originClass")||$ele.data("class"));//重置序列帧元素
if($(ele).data("eletype")==eleType.frames){$(ele).find(".frames").removeClass("play");}//重置锚点trigger标记
if($(ele).data("eletype")==eleType.anchor){$(ele).data("triggerFlag",false);}//重置父元素类
var $parentEle=$(ele).parent();var parentClass=$parentEle.attr("class"),originParentClass=$parentEle.data("originClass");if(parentClass!==originParentClass){$parentEle.attr("class",originParentClass);}});//重置pageTABContent内容
$page.find(".activity-content .isolatedPage").removeClass("showContent");},//播放动画
_playAnim:function _playAnim($ele,animData,currentIndex,label){var self=this;if(animData&&animData.length>0&&currentIndex<animData.length){self._replayAnim($ele,animData,currentIndex,label);}},_replayAnim:function _replayAnim($ele,animData,currentIndex,label){var self=this;var anim=animData[currentIndex];var animCount=anim.animCount||0;if(animCount>0){var eleAnimClass=$ele.attr("id")+"_"+currentIndex+"_"+label;if(currentIndex==animData.length-1){currentIndex++;// $ele.parent(".elementWrap").removeClass('invisible');
var elementClass=$ele.attr("class");$ele.attr("class",elementClass+" "+anim.animName+" "+eleAnimClass).one("webkitAnimationEnd",function(){//$ele.attr("class", $ele.data("originClass") || $ele.data("class"));
});return false;}$ele.addClass(anim.animName+" "+eleAnimClass).one("webkitAnimationEnd",function(){$ele.attr("class",$ele.data("originClass")||$ele.data("class"));currentIndex++;setTimeout(function(){self._playAnim($ele,animData,currentIndex,label);},0);});}else{currentIndex++;self._playAnim($ele,animData,currentIndex,label);}},//播放视频
_playVideo:function _playVideo(url){video.open(url);},//播放页面级音效
_playPageAudio:function _playPageAudio($page){var self=this,pageId=$page.attr("id"),hasFullVideo=$page.find(".fullvideo").length>0,audioUrl=$page.data("audio");firstPageAudio&&firstPageAudio.stop();for(var index in this.pageAudioSet){var id=this.pageAudioSet[index];this[id].stop();}// myAudio && myAudio.pause();
if(audioUrl){this._stopProjectBgAudio();if($page.find(".firstPageAudio").length==1){firstPageAudio&&firstPageAudio.play();}else{self[pageId].init();}}else if($page.find(".fullvideo").length==0){this._playProjectBgAudio();}},//停止项目级背景音乐
_stopProjectBgAudio:function _stopProjectBgAudio(){bgAudio&&bgAudio.pause()&$(".music").hide();},//停止所有音乐播放
_stopAllAudio:function _stopAllAudio(){if(audio._elCtl){audio.pause();}bgAudio&&bgAudio.pause()&$(".music").hide();firstPageAudio&&firstPageAudio.stop();for(var index in this.pageAudioSet){var id=this.pageAudioSet[index];this[id].stop();}},//播放项目级背景音乐
_playProjectBgAudio:function _playProjectBgAudio(){if(bgAudio){$(".music").show();if($(".music").attr("class")=="music on"){bgAudio.play();}}},//播放全屏视频
_playFullVideo:function _playFullVideo($page){var $video=$page.find(".fullvideo");if($video.length>0){//播放视频时，停止播放背景音乐
this._stopProjectBgAudio();var triggerData=$video.data("trigger");var isPlay=false;if(isPlayVideo){$video.find("video").bind("timeupdate",function(){//PC模拟器不触发canplaythrough事件
if(!isPlay&&this.currentTime<0.5){isPlay=true;triggerManager.triggerActionList(triggerData,"videoStart");}}).bind("canplaythrough",function(){if(!isPlay){isPlay=true;triggerManager.triggerActionList(triggerData,"videoStart");}}).bind("ended",function(){triggerManager.triggerActionList(triggerData,"videoEnd");});// document.addEventListener("WeixinJSBridgeReady", function () {      //部分不支持自动播放的机型在微信浏览器的兼容
//     $video.find("video").get(0).play();
// }, false);
$video.find("video").addClass("play");$video.find("video").get(0).play();}else if(util.isIOS()){var id=$video.data("id");// window["audioPlayer_" + id].on("canplaythrough", function(){     //微信浏览器不支持视频自动播放，所以不需要载入资源
if(!isPlay){isPlay=true;window["animPlayer_"+id].play();triggerManager.triggerActionList(triggerData,"videoStart");}// });
window["audioPlayer_"+id].play();}else{var id=$video.data("id");window["animPlayer_"+id].play();window["audioPlayer_"+id].play();triggerManager.triggerActionList(triggerData,"videoStart");}}},//停止播放全屏视频
_stopFullVideo:function _stopFullVideo($page){var $video=$page.find(".fullvideo");if($video.length>0){if(isPlayVideo){var fullVideo=$video.find("video").get(0);fullVideo.pause();setTimeout(function(){//解决iphone6s, iphone6 plus 视频播放结束后，立马渲染首帧，出现一闪的bug
fullVideo.currentTime=0;},0);}else{var id=$video.data("id");window["animPlayer_"+id].stop();}}},//幻灯片绑定
sliderBind:function sliderBind(){var that=this;if($(".swiper-container").length){util.initGetScript();$.getScript("./js/lib/swiper-3.3.1.jquery.min.js",function(){$pages.each(function(index,page){if($(page).find(".swiper-container").length>0){$(page).find(".swiper-container").each(function(i,swiper){var id=$(swiper).data("id"),swiperAttr=$(swiper).data("swiperattr"),len=$(swiper).find(".swiper-slide").length,triggerList=$(swiper).find(".swiper-wrapper").data("trigger"),pagination=swiperAttr.pagination,width=$(swiper).width(),height=$(swiper).height();$(swiper).css({width:width+"px",height:height+"px"});if(swiperAttr.effect==="fade"){//fade效果单独处理，增加对应参数
that.slideSet[id]=new Swiper("#"+id,{direction:swiperAttr.direction,loop:true,autoplayDisableOnInteraction:false,autoplay:+swiperAttr.autoplay*1000,speed:+swiperAttr.speed,effect:swiperAttr.effect||"slide",pagination:pagination==="show"?".swiper-pagination":"",onClick:function onClick(swiper){var activeIndex=(swiper.activeIndex+len-1)%len;var triggerAttr=triggerList[activeIndex]&&triggerList[activeIndex].triggerAttr||{};triggerManager.triggerActionList(triggerAttr,"click");},fade:{crossFade:true}});}else{that.slideSet[id]=new Swiper("#"+id,{direction:swiperAttr.direction,loop:true,autoplayDisableOnInteraction:false,autoplay:+swiperAttr.autoplay*1000,speed:+swiperAttr.speed,effect:swiperAttr.effect||"slide",pagination:pagination==="show"?".swiper-pagination":"",onClick:function onClick(swiper){var activeIndex=(swiper.activeIndex+len-1)%len;var triggerAttr=triggerList[activeIndex]&&triggerList[activeIndex].triggerAttr||{};triggerManager.triggerActionList(triggerAttr,"click");}});}});}});});}},//背景音乐播放绑定
bgAudioBind:function bgAudioBind(){if(firstPageAudio){if(util.isAndroid()){//首屏有页面级音效
firstPageAudio.init();}if($(".music").length>0){$(".music").hide();$(".music").bind("click",function(){if($(this).hasClass("on")){$(this).removeClass("on");$(this).addClass("off");bgAudio.pause();}else{$(this).removeClass("off");$(this).addClass("on");bgAudio.play();}});}}else if($(".music").length>0){if(util.isAndroid()){bgAudio.init();}$(".music").bind("click",function(){if($(this).hasClass("on")){$(this).removeClass("on");$(this).addClass("off");bgAudio.pause();}else{$(this).removeClass("off");$(this).addClass("on");bgAudio.play();}});}},//绑定页面 滑动事件
eventBindPage:function eventBindPage(){var self=this;var bodyHeight=$("body").height();$pages.each(function(){var transition=$(this).data("transition"),prevSwipe=transition&&transition.prevTransition&&transition.prevTransition.swipe||"bottom",nextSwipe=transition&&transition.nextTransition&&transition.nextTransition.swipe||"top";var $page=$(this);var isLongPage=$page.data("islongpage")||false,pageHeight=$page.height(),innerHeight=0,offsetHeight=0;if(isLongPage){// innerHeight = $page.find(".innerWrap").height();
// offsetHeight = pageHeight - innerHeight;
// var myScroll = new IScroll($page.get(0), {probeType : 3,click : true, bounceTime : 500}).on("scroll",function(e){
//     var that = this;
//     $page.find(".anchor").each(function(){
//         var top = $(this).parent().position().top;
//         var centerLine = Math.abs(that.y) + pageHeight/2;
//         var triggerData = $(this).data("trigger");
//         var isTrigger = $(this).data("triggerFlag") || false;
//         if( Math.abs(top - centerLine) < 20 && !isTrigger){
//             //标记已触发
//             $(this).data("triggerFlag", true);
//             triggerManager.triggerActionList(triggerData, "anchorHit");
//         }
//     });
//
//     function backTop(){
//         //返回顶部
//         that.scrollTo(0,0);
//     }
//
//     //当下拉，使得边界超出时，如果手指从屏幕移开，则会触发该事件
//     if(Math.abs(this.distY) > 180 ){
//         if(Math.abs(this.y - offsetHeight) < 1 ){
//             if(nextSwipe == "top"){
//                 if(endCurrPage && endNextPage){
//                     self.nextPage(backTop);
//                     return true;
//                 }
//             }else{
//                 if(endCurrPage && endNextPage){
//                     self.nextPage(backTop);
//                     return true;
//                 }
//             }
//         }else if(Math.abs(this.y) < 1){
//             if(prevSwipe == "bottom"){
//                 if(endCurrPage && endNextPage){
//                     self.prevPage(backTop);
//                 }
//             }else{
//                 if(endCurrPage && endNextPage){
//                     self.prevPage(backTop);
//                 }
//             }
//         }
//     }
// });
innerHeight=$page.find(".innerWrap").height();offsetHeight=innerHeight-pageHeight;new Touch($page,true).on(nextSwipe,function(){if(nextSwipe=="top"){if(endCurrPage&&endNextPage){self.nextPage();return true;}}else{if(endCurrPage&&endNextPage){self.nextPage();return true;}}}).on(prevSwipe,function(){if(prevSwipe=="bottom"){if(endCurrPage&&endNextPage){self.prevPage();}}else{if(endCurrPage&&endNextPage){self.prevPage();}}});}else{new Touch($(this),false).on(nextSwipe,function(){if(endCurrPage&&endNextPage){self.nextPage();}}).on(prevSwipe,function(){if(endCurrPage&&endNextPage){self.prevPage();}});}});},//场景定位
_layoutScene:function _layoutScene(index,layout){var $scenePage=$(".isolatedPage").eq(index);var width=parseFloat($scenePage.css("width"));var height=parseFloat($scenePage.css("height"));switch(layout){case"tl":$scenePage.css({left:0,top:0});break;case"tc":$scenePage.css({left:"50%",top:0,"margin-left":-1*width/2+"rem"});break;case"tr":$scenePage.css({right:0,top:0});break;case"cl":$scenePage.css({left:0,top:"50%","margin-top":-1*height/2+"rem"});break;case"cc":$scenePage.css({left:"50%",top:"50%","margin-left":-1*width/2+"rem","margin-top":-1*height/2+"rem"});break;case"cr":$scenePage.css({right:0,top:"50%","margin-top":-1*height/2+"rem"});break;case"bl":$scenePage.css({left:0,bottom:0});break;case"bc":$scenePage.css({left:"50%",bottom:0,"margin-left":-1*width/2+"rem"});break;case"br":$scenePage.css({right:0,bottom:0});break;default:$scenePage.css({left:"50%",top:"50%","margin-left":-1*width/2+"rem","margin-top":-1*height/2+"rem"});}},//显示弹窗
_showScene:function _showScene(index){var that=this;$(".fade-div").show();var $scenePage=$(".isolatedPage").eq(index);var transition=$scenePage.data("transition");if(transition.sceneInTransition&&transition.sceneInTransition!=="none"){$scenePage.addClass("showPop "+transition.sceneInTransition).one("webkitAnimationEnd",function(){$scenePage.removeClass(transition.sceneInTransition);});}else{$scenePage.addClass("showPop");}this.eventBindEles($scenePage);//若使用click事件，点击元素显示弹层，则会自动执行弹层的click事件；
$(".fade-div").unbind("touchstart").bind("touchstart",function(){that._closeScene(index);});},//关闭弹窗
_closeScene:function _closeScene(index){var $scenePage=$(".isolatedPage").eq(index);var transition=$scenePage.data("transition");if($scenePage){if(transition.sceneOutTransition&&transition.sceneOutTransition!=="none"){$scenePage.addClass(transition.sceneOutTransition).one("webkitAnimationEnd",function(){$scenePage.removeClass(transition.sceneOutTransition);$scenePage.removeClass("showPop");$(".fade-div").hide();});}else{$scenePage.removeClass("showPop");$(".fade-div").hide();}}},//点击遮罩关闭弹窗
eventBindFade:function eventBindFade(){$(".fade-div").bind("click",function(){$(".isolatedPage").removeClass("showPop");$(".fade-div").hide();});},submitForm:function submitForm(item){var postUrl=ServerAddress+"/form/submit";var Reg=[/.*/,/^1[3|4|5|7|8]\d{9}$/,/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,/\d+/],msg=["","请输入正确的电话号码！","请输入正确的邮箱！","请输入正确的数字！"];var submitFlag=true;var submitBtn=item;var formPage=submitBtn.parents(".page").length?submitBtn.parents(".page"):submitBtn.parents(".isolatedPage");if(formPage.length==0){formPage=submitBtn.parents(".fixedPage");}var inputs=formPage.eq(0).find(".form-input");var selects=formPage.eq(0).find(".form-select");var data=[];var formTitle=submitBtn.data("name");var formId=submitBtn.data("id");var projectId=$("#projectType").data("projectid");inputs.each(function(index,item){var validate=$(item).data("validate");var name=$(item).data("name");var value=$(item).val();var type=validate.inputType;var id=$(item).data("id");if(!submitFlag){return;}//验证输入框
if(!Reg[type].test(value)){//alert(msg[type]);
Toast.show(msg[type]);submitFlag=false;return;}if(validate.required&&value==""){//alert(name + "为必填项！");
Toast.show(name+"为必填项！");submitFlag=false;return;}data.push({elementId:id,isUnique:false,title:name,data:value});});selects.each(function(index,item){var name=$(item).data("name");var value=$(item).val();var id=$(item).data("id");data.push({elementId:id,isUnique:false,title:name,data:value});});if(!submitFlag){return;}$.ajax({url:postUrl,data:{pid:projectId,form_id:formId,form_title:formTitle,data:JSON.stringify(data)},dataType:"jsonp",success:function success(res){if(100==res.status){//alert("提交成功！");
Toast.show("提交成功！");setTimeout(function(){if(submitBtn.parents(".isolatedPage").length){submitBtn.parents(".isolatedPage").eq(0).removeClass("showPop");$(".fade-div").hide();}inputs.val("");},1000);}else{//alert(res.msg);
Toast.show(res.msg);}}});},//提交按钮
bindSubmitBtn:function bindSubmitBtn(){var that=this;$(".submit-btn").bind("click",function(){that.submitForm($(this));});},//fixed元素绑定
fixedPageBindEles:function fixedPageBindEles(){var that=this;if($(".fixedPage").length>0){$(".fixedPage").find(".element").css({visibility:"visible"});that.eventBindEles($(".fixedPage"));}},//初始化动态活动区
initActivityContent:function initActivityContent(){//遍历插入内容区
$(".activity-content").each(function(index,ele){var sceneList=$(ele).data("scenelist");for(var i=0;i<sceneList.length;i++){var sceneId=sceneList[i].sceneId;var html=$("#"+sceneId);$(ele).append(html);}});},//初始化tab状态,显示对应的tab内容
initTabState:function initTabState($page){var that=this;var $tab=$page.find(".tab-element");if($tab.length>0){if($page.find(".active-tab").length>0){var tabAttr=$page.find(".active-tab").data("tab");var contentAreaId=tabAttr.contentAreaId;var contentPageId=tabAttr.contentPageId;that._contentSceneIn($("#"+contentAreaId).find("#"+contentPageId));}else{var $activeTab=$tab.eq(0);var tabAttr=$activeTab.data("tab");$activeTab.addClass("active-tab").css("background-image","url("+tabAttr.selectedImg+")");var contentAreaId=tabAttr.contentAreaId;var contentPageId=tabAttr.contentPageId;that._contentSceneIn($("#"+contentAreaId).find("#"+contentPageId));}}},//tab元素绑定
eventBindTabEles:function eventBindTabEles(){var that=this;//绑定tab事件
$(".tab-element").bind("click",function(){var self=$(this);//当前是激活状态直接返回
if(self.hasClass("active-tab")||that.isTabing){return;}that.isTabing=true;var tabAttr=self.data("tab");var contentAreaId=tabAttr.contentAreaId;var contentPageId=tabAttr.contentPageId;var groupId=tabAttr.groupId;var activeTab=$("."+groupId+".active-tab");//移除活动tab
if(0!=activeTab.length){activeTab.css("background-image","url("+activeTab.data("tab").unselectedImg+")").removeClass("active-tab");}//添加活动tab
self.addClass("active-tab").css("background-image","url("+tabAttr.selectedImg+")");//当前激活 动态内容区 出场
var $currentContent=$("#"+contentAreaId).find(".showContent");that._contentSceneOut($currentContent);//跳转内容区
var $showContent=$("#"+contentAreaId).find("#"+contentPageId).addClass("showContent");that._contentSceneIn($showContent);//内容区绑定元素事件
that.eventBindEles($showContent);});},richTextBind:function richTextBind(){$(".richText").each(function(item){var ele=$(this);var height=ele.height();var scrollHeight=ele[0].scrollHeight;if(scrollHeight>height){ele.bind("touchstart",function(e){e.stopPropagation();return true;}).bind("touchmove",function(e){e.stopPropagation();return true;}).bind("touchend",function(e){e.stopPropagation();return true;});}});},//内容区场景入场
_contentSceneIn:function _contentSceneIn($scenePage){var transition=$scenePage.data("transition");$scenePage.addClass("showContent");if(transition.sceneInTransition&&transition.sceneInTransition!=="none"){$scenePage.addClass(transition.sceneInTransition).one("webkitAnimationEnd",function(){$scenePage.removeClass(transition.sceneInTransition);});}},//内容区场景出场
_contentSceneOut:function _contentSceneOut($scenePage){var that=this;var transition=$scenePage.data("transition");if($scenePage){if(transition.sceneOutTransition&&transition.sceneOutTransition!=="none"){$scenePage.addClass(transition.sceneOutTransition).one("webkitAnimationEnd",function(){$scenePage.removeClass(transition.sceneOutTransition);$scenePage.removeClass("showContent");that.isTabing=false;});}else{$scenePage.removeClass("showContent");that.isTabing=false;}}else{that.isTabing=false;}},//动画css初始化
animCSSInit:function animCSSInit(){$(".element").each(function(){var eleAnim=$(this).data("anim"),eleTrigger=$(this).data("trigger"),id=$(this).attr("id");var anim,selector,rule;if(eleAnim){//添加元素动画类
for(var i=0,count=eleAnim.length;i<count;i++){anim=eleAnim[i];selector="."+id+"_"+i+"_ele";rule="-webkit-animation-duration:"+anim.animDuration+"s;"+"-webkit-animation-delay:"+anim.animDelay+"s;"+"-webkit-animation-fill-mode:both;";if(i==count-1&&anim.isLoop){rule+="-webkit-animation-iteration-count:infinite;";}else{rule+="-webkit-animation-iteration-count:"+anim.animCount+";";}util.addCSSRule(document.styleSheets[0],selector,rule);}}if(eleTrigger){//添加触发器动画类
for(var index in eleTrigger){var trigger=eleTrigger[index];var eventType=trigger.eventType;for(var actionIndex in trigger.actionList){var action=trigger.actionList[actionIndex];if(action.actionType=="PlayAnim"){for(var k in action.eleAnimList){var eleAnim=action.eleAnimList[k];var eleId=eleAnim.eleId;for(var j=0,count=eleAnim.animList.length;j<count;j++){anim=eleAnim.animList[j];selector="."+eleId+"_"+j+"_"+eventType+"_"+actionIndex;rule="-webkit-animation-duration:"+anim.animDuration+"s;"+"-webkit-animation-delay:"+anim.animDelay+"s;"+"-webkit-animation-fill-mode:both;";if(j==count-1&&anim.isLoop){rule+="-webkit-animation-iteration-count:infinite;";}else{rule+="-webkit-animation-iteration-count:"+anim.animCount+";";}util.addCSSRule(document.styleSheets[0],selector,rule);}}}}}}});},//幻灯片分页器颜色样式
sliderCSSInit:function sliderCSSInit(){$(".swiper-container").each(function(){var sliderAttr=$(this).data("swiperattr"),id=$(this).data("id");var rule,selector;if(sliderAttr.paginationActiveColor){rule="background: "+sliderAttr.paginationActiveColor+";";selector="#"+id+" .swiper-pagination .swiper-pagination-bullet.swiper-pagination-bullet-active";util.addCSSRule(document.styleSheets[0],selector,rule);}if(sliderAttr.paginationColor){rule="background: "+sliderAttr.paginationColor+";";selector="#"+id+" .swiper-pagination .swiper-pagination-bullet";util.addCSSRule(document.styleSheets[0],selector,rule);}});},//小视频Dom初始化
fullVideoDomInit:function fullVideoDomInit(){var isAndroid=util.isAndroid();$(".fullvideo").each(function(){var videoAttr=$(this).data("video");if(isPlayVideo){$(this).append($('<video x-webkit-airplay="true" webkit-playsinline playsinline preload="auto" src="'+videoAttr.fullVideoUrl+'"/>'));}else{$(this).append($('<img width="100%"/>'));}//小视频页面 禁止滑动
$(this).bind("touchmove",function(){return false;});});},stopInlineVideo:function stopInlineVideo($page){var $inlineVideos=$page.find(".inline-video video");if(!$inlineVideos.length)return;$inlineVideos.each(function(index,item){this.pause();});},playInlineVideo:function playInlineVideo($page){var $inlineVideos=$page.find(".inline-video video");if(!$inlineVideos.length)return;$inlineVideos.each(function(index,item){this.play();});},playInlineVideoInit:function playInlineVideoInit($page){var $inlineVideos=$(".inline-video");var $firstPageInlineVideos=$page.find(".inline-video");var that=this;if($firstPageInlineVideos.length){if(util.isWeChat()&&util.isIOS()){document.addEventListener("WeixinJSBridgeReady",function(){play();});}$("body").one("touchstart",function(){play();});if(!util.isWeChat())play();}function play(){setTimeout(function(){playFirstPageInV();},0);}function playFirstPageInV(){$firstPageInlineVideos.each(function(index,item){if(util.isAndroid()&&!$(item).find("video").length){$(item).append(that["videoInline_"+this.id]);$(item).find("video")[0].ontimeupdate=function(){if(that["isPlayV_"+$(this).parent()[0].id])return;if(this.currentTime>0.5)that["isPlayV_"+$(this).parent()[0].id]=true;};}// $(item).find('video')[0].play();   //自动播放不支持
if(!util.isIOS()&&$(item).find(".v-cover").length)$(item).find(".v-cover").remove();});}},initInlineVideoDom:function initInlineVideoDom(){var $pages=$(".page");$pages.each(function(index,item){if(util.isIOS()||!util.isIOS()&&index!=0){$(item).find(".inline-video").each(function(ii,iitem){$(iitem).html('<video controls="controls" loop="loop" width="100%" height="100%" x-webkit-airplay="true" playsinline webkit-playsinline x5-playsinline="true" x-webkit-airplay="allow" preload="auto" src="'+$(iitem).data("video")["inlineVideoUrl"]+'" poster="'+$(iitem).data("video")["inlinevideoImg"]+'" style="object-fit:fill"></video>');});}});var firstPageInlineVideos=$pages.eq(0).find(".inline-video");var that=this;if(firstPageInlineVideos.length&&!util.isIOS()){firstPageInlineVideos.each(function(iii,iiitem){that["videoInline_"+this.id]='<video controls="controls" loop="loop" width="100%" height="100%" x-webkit-airplay="true" playsinline webkit-playsinline x5-playsinline x-webkit-airplay="allow" preload="auto" src="'+$(iiitem).data("video")["inlineVideoUrl"]+'" poster="'+$(iiitem).data("video")["inlinevideoImg"]+'" style="object-fit:fill"></video>';});}},//投票初始化
initVote:function initVote(){var $voteBtns=$(".btn-vote");var voteItems=[];var temp={};for(var i=0,len=$voteBtns.length;i<len;i++){temp={};temp.id=$voteBtns[i].id;if(temp.id){temp.txtId=$voteBtns.eq(i).data("vcountid")||"";temp.name=$voteBtns.eq(i).data("name")||"";}if(temp.id&&temp.txtId){voteItems.push(temp);}else{console.error("投票初始化错误,请返回一休系统修改投票设置，如果还有问题，请联系开发人员!");}}if(!voteItems.length)return false;var projectId=$("#projectType").data("projectid");var voteId=$("#projectType").data("voteid");var clickVoteBtnId="";var renderVoteDom=function renderVoteDom(d){for(var i=0,len=d.length;i<len;i++){$("#"+d[i]["id"]).html(d[i]["count"]+"票");}};var getVoteData=function getVoteData(){$.ajax({url:ServerAddress+"/vote/getVoteData?callback=?&"+"pid="+projectId+"&vote_id="+voteId,dataType:"jsonp",success:function success(data){if(data&&data.data&&data.data.voteItem){renderVoteDom(data.data.voteItem);}else{console.log(data.msg);}},error:function error(data){console.log("服务器异常~"+data);}});};var voteSubmit=function voteSubmit(vTxtId,vName){$.ajax({url:ServerAddress+"/vote/submit?callback=?&"+"pid="+projectId+"&vote_id="+voteId+"&vote_item_id="+vTxtId+"&vote_item_name="+vName,dataType:"jsonp",success:function success(data){if(data&&data.status==100){//alert('恭喜，投票成功！');
Toast.show("恭喜，投票成功！");var voteTxt=$("#"+clickVoteBtnId).html();$("#"+clickVoteBtnId).html(+voteTxt.slice(0,voteTxt.length-1)+1+"票");// if( data && data.data && data.data.voteItem) {
//     renderVoteDom(data.data.voteItem);
// }
}else{//alert(data.msg);
Toast.show(data.msg);}},error:function error(data){console.log("服务器异常~"+data);}});};getVoteData();for(var i=0,len=voteItems.length;i<len;i++){(function(_i){$("#"+voteItems[i].id).on("click",function(){clickVoteBtnId=voteItems[_i].txtId;voteSubmit(voteItems[_i].txtId,voteItems[_i].name);});})(i);}},//SVG初始化
initSvgShape:function initSvgShape(){var $svg=$(".svg-shape");var src=[];var attr=[];for(var i=0,l=$svg.length;i<l;i++){src.push($svg.eq(i).data("svgsrc"));attr.push($svg.eq(i).data("svgitemsattr"));}if(!src.length||!attr.length)return false;var getSvgLeafNodes=function getSvgLeafNodes(svgNode){var nodeList=[];var leafCount=0;function getTreeLeafNodes(Node){if(Node.children.length==0){nodeList.push(Node);}else{for(var i=0,l=Node.children.length;i<l;i++){getTreeLeafNodes(Node.children[i]);}}}getTreeLeafNodes(svgNode);return nodeList;};var svgColorRender=function svgColorRender(svgNode,index){//debugger;
svgNode.setAttribute("width","100%");svgNode.setAttribute("height","100%");if(svgNode.children.length==1&&svgNode.children[0].nodeName=="rect")svgNode.setAttribute("preserveAspectRatio","none");var leafNodeList=getSvgLeafNodes(svgNode);var elementAttr=attr[index];for(var i=0,ll=elementAttr.length;i<ll;i++){var elements=elementAttr[i]["elements"];for(var j=0,lll=elements.length;j<lll;j++){leafNodeList[elements[j]].style.fill=elementAttr[i]["fill"];}}};for(var i=0,len=src.length;i<len;i++){(function(_i){$.ajax({url:src[_i],type:"GET",success:function success(res){$svg.eq(_i).html(res);svgColorRender($svg.eq(_i).find("svg")[0],_i);},error:function error(res){console.log("error"+res);}});})(i);}},initPreviewMsg:function initPreviewMsg(){if(!$("#preview-msg").length)return;setTimeout(function(){$("#preview-msg").remove();},3000);},//初始化随机图片
initRandomImg:function initRandomImg(){var $randomImg=$(".random-img");$randomImg.each(function(index,item){var imgList=$(item).data("imglist");var len=imgList.length;var index=Math.floor(Math.random()*len);$(item).attr("src",imgList[index].imgUrl);});},//初始化二维码
initSQCode:function initSQCode(){// var url = "https://qrcode2.webapp.163.com/l?d=" + encodeURIComponent(window.location.href);
var url=window.location.href;$(".sqcode-img").each(function(index,item){var width=$(item).width();var height=$(item).height();new QRCode($(item)[0],{render:"canvas",text:url,width:width,height:height,correctLevel:QRCode.CorrectLevel.H});});// $('.sqcode-img').attr('src', url);
},//初始化随机变量
initRandomVar:function initRandomVar(){var minNum=parseInt($(".random-var-value").data("minnum"));var maxNum=parseInt($(".random-var-value").data("maxnum"));var fixNum=parseInt($(".random-var-value").data("fixnum"));var value=0;if(fixNum===0){value=Math.floor(Math.random()*(maxNum-minNum)+minNum);}else{value=(Math.random()*(maxNum-minNum)+minNum).toFixed(fixNum);}$(".random-var-value").text(value);},//初始化页面转图片
initHtml2Img:function initHtml2Img(){var $myImg=$(".html2img .myImg");$myImg.each(function(index,item){var canvas2=document.createElement("canvas");var _canvas=document.querySelector(".myImg");var w=parseInt(window.getComputedStyle(_canvas).width);var h=parseInt(window.getComputedStyle(_canvas).height);canvas2.width=w*3;canvas2.height=h*3;canvas2.style.width=w+"px";canvas2.style.height=h+"px";var context=canvas2.getContext("2d");context.scale(2,2);setTimeout(function(){html2canvas($(item)[0],{useCORS:true,canvas:canvas2,logging:false}).then(function(canvas){var context=canvas.getContext("2d");//关闭抗锯齿
context.mozImageSmoothingEnabled=false;context.webkitImageSmoothingEnabled=false;context.msImageSmoothingEnabled=false;context.imageSmoothingEnabled=false;var pageId=$(item).data("id");document.body.appendChild(canvas);$("canvas").last().addClass("myCanvas");$("#"+pageId).find(".result")[0].src=canvas.toDataURL("image/jpeg");});},500);});},initShare:function initShare(){var title=document.title||"";CONST_SHARE.SHARE_TITLE=$("#share_title").html()||title;CONST_SHARE.SHARE_DESC=$("#share_desc").html()||$("#description").html()||title;CONST_SHARE.SHARE_IMG=$("#share_pic").data("src")||"";CONST_SHARE.SHARE_CIRCLE_TITLE=$("#share_circle_title").html()||$("#share_title").html()||title;CONST_SHARE.SHARE_GUIDE_TEXT=$("#share_WxGuide").html().replace(/{br}/g,"<br />")||"不能让我一个人眼瞎！<br />把魔爪伸到朋友圈吧！";superHybrid.initShare();},init:function init(){//动态内容区初始化
this.initActivityContent();//初始化页面和元素属性
$pages.each(function(){$(this).data("originClass",$(this).attr("class"));$(this).find(".element").each(function(ele,index){$(this).data("originClass",$(this).attr("class"));});});var $currentPage=$pages.eq(currentIndex);var projectType=$("#projectType").val();$currentPage.addClass("page-init");//绑定页面所有元素
setTimeout(function(){pages.eventBindEles($currentPage);},100);this.fixedPageBindEles();//绑定页面滑动效果
this.eventBindPage();this.preloadAudio();//富文本事件绑定
this.richTextBind();//背景音乐绑定
this.bgAudioBind();//幻灯片绑定
this.sliderBind();//btn绑定
this.bindSubmitBtn();//tab元素绑定
this.eventBindTabEles();if($(".inline-video").length){this.playInlineVideoInit($currentPage);}//视频绑定
video.init();}};//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
pages.animCSSInit();pages.sliderCSSInit();pages.fullVideoDomInit();pages.initVote();pages.initSvgShape();pages.initPreviewMsg();pages.initInlineVideoDom();pages.initShare();pages.initSQCode();//二维码
pages.initRandomImg();//随机图片
pages.initRandomVar();//随机数
setTimeout(function(){pages.initHtml2Img();//页面转图片
},500);var initShowPage=function initShowPage(){if(!isPlayVideo){$(".fullvideo").each(function(){var videoAttr=$(this).data("video"),videoVars=videoAttr.video_vars,audioUrl=videoAttr.video_audio,time=videoAttr.video_audio_time,id=$(this).data("id");var triggerData=$(this).data("trigger");var _frameSet=[];for(var i in videoVars){_frameSet=_frameSet.concat(window[videoVars[i]]);}window["audioPlayer_"+id]=new AudioPlayer(audioUrl,false);window["animPlayer_"+id]=new AnimPlayer($(this).find("img"),_frameSet,time,window["audioPlayer_"+id],function(){triggerManager.triggerActionList(triggerData,"videoEnd");});});}pages.init();consoleLog();};if(!NEED_LOADING){initShowPage();$(".loadingPage").remove();return false;}var temp_img_list=["https://yixiu.game.163.com/F4D89668CAB384A1/img/btn-vote.png","https://yixiu.game.163.com/F4D89668CAB384A1/img/cover-play.png","https://yixiu.game.163.com/F4D89668CAB384A1/img/icon-play.png","https://yixiu.game.163.com/F4D89668CAB384A1/img/music-off.png","https://yixiu.game.163.com/F4D89668CAB384A1/img/music-on.png"];var img_list=[];temp_img_list.map(function(img){if(img.indexOf("btn-vote.png")==-1&&img.indexOf("cover-play.png")==-1&&img.indexOf("icon-play.png")==-1&&img.indexOf("music-on.png")==-1)img_list.push(img.replace("../../",""));});var resList=[];if(!isPlayVideo){$(".fullvideo").each(function(){var videoAttr=$(this).data("video");var jsList=videoAttr.video_paths;resList.push({type:"script",list:jsList});});}resList.push({type:"image",list:img_list});var isCustomLoading=$(".loadingPage").length>0;if(isCustomLoading){pages.eventBindEles($(".loadingPage"));$(".loadingPage").bind("touchmove",function(){return false;});preLoader.load({resList:resList,defaultAnimation:false,//自定义Loading效果
customLoadingFn:function customLoadingFn(percent){percent=parseInt(percent*100);$(".loadingPage").find(".loading-tips").text(percent+"%");},loadedCbk:function loadedCbk(){initShowPage();var trans=$(".loadingPage").data("transition");$(".loadingPage").bind("webkitAnimationEnd",function(){$(".loadingPage").hide();});if(trans.sceneOutTransition&&trans.sceneOutTransition!="none"){$(".loadingPage").addClass(trans.sceneOutTransition);}else{$(".loadingPage").addClass("fadeOut2");}setTimeout(function(){$(".loadingPage").hide();},1000);}});}else{preLoader.load({resList:resList,loadedCbk:function loadedCbk(){initShowPage();}});}}();var Toast=function(){var $toastDom=$('<div id="toast" class="toast nowrap"></div>');var time=2000,$toast=null,isRun=false;function init(){$("body").append($toastDom);$toast=$toastDom;}function show(text){if(isRun)return;isRun=true;if(!$toast)init();$toast.html(text||"");if(text.length>10)$toast.removeClass("nowrap");$toast.addClass("show");setTimeout(function(){$toast.addClass("fadeIn");},300);setTimeout(function(){$toast.addClass("fadeOut");},time);setTimeout(function(){isRun=false;$toast.removeClass("show");$toast.removeClass("fadeIn fadeOut");},time+300);}return{show:show};}();function _onorientationchange(e){if(window.orientation==90||window.orientation==-90){$("#forhorview").css("display","block");//显示竖屏浏览提示框
}else{//竖屏下恢复默认显示效果
$("#forhorview").css("display","none");}setTimeout(function(){document.documentElement.style.fontSize=document.documentElement.clientWidth/7.5+"px";},300);}window.addEventListener("onorientationchange"in window?"orientationchange":"resize",function(e){_onorientationchange(e);},false);_onorientationchange();function consoleLog(){if(console&&console.clear&&console.log){//console.clear();
console.log("一休(EaseShow)系统，由网易游戏-市场与渠道中心-技术中心，开发并提供技术支持\n一休(EaseShow)系统官网: http://h.tool.netease.com");}}//微信内置浏览器浏览H5页面弹出的键盘遮盖文本框的解决办法
window.addEventListener("resize",function(){if(document.activeElement.tagName=="INPUT"||document.activeElement.tagName=="TEXTAREA"){window.setTimeout(function(){document.activeElement.scrollIntoViewIfNeeded();},0);}});//ios12 微信浏览器键盘收起之后页面不恢复的情况
$(document).on("focusout",function(){$(window).scrollTop(0);});});