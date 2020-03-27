"use strict";

"undefined" == typeof console && (window.console = {}, console.log = function () {}), nie.define("Func", function () {
    var o = $(".pop-mask"),
        e = { modalShow: function modalShow(e) {
            $(window).scrollTop(0), e.addClass("beshow"), o.addClass("beshow");setTimeout(function () {
                e.addClass("show"), o.addClass("show");
            }, 50);
        }, modalHide: function modalHide(e) {
            e.removeClass("show"), o.removeClass("show"), $("html,body").hasClass("heightControl") && $("html,body").removeClass("heightControl");setTimeout(function () {
                e.removeClass("beshow"), o.removeClass("beshow");
            }, 50);
        }, stopDefault: function stopDefault(o) {
            o && o.preventDefault ? o.preventDefault() : window.event.returnValue = !1;
        }, checkPhone: function checkPhone(o) {
            return (/^(13|14|15|17|18|19)\d{9}$/.test(o)
            );
        }, checkEmail: function checkEmail(o) {
            return (/^[a-zA-Z0-9]+([._\\-]*[a-zA-Z0-9])+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(o)
            );
        }, picPreload: function picPreload(o) {
            var e = new Image();e.onload = function () {}, e.src = o;
        }, getUrlParam: function getUrlParam(o) {
            var e = new RegExp("(^|&)" + o + "=([^&]*)(&|$)"),
                n = window.location.search.substr(1).match(e);return null != n ? n[2] : null;
        } };return { fn: e };
});
;nie.define(function () {
    var FUNC = nie.require("Func");
    var platfromid = FUNC.fn.getUrlParam("platform"),
        channel = FUNC.fn.getUrlParam("channel") ? FUNC.fn.getUrlParam("channel") : '';
    var update_param = '31606,31516';
    if (platfromid == "ios") {
        update_param = '32083';
    }
    if (platfromid == "andnie") {
        update_param = '32081';
    }
    if (platfromid == "andqd") {
        update_param = '32082';
    }
    if (platfromid == "test") {
        update_param = '32084';
    }

    var getNews = function getNews(param, getNum, startNum, cb) {
        $.ajax({
            url: 'https://sixhorse.game.163.com/news/outer/newslist.do',
            type: 'GET',
            data: {
                contentkind: param, //分类ID，多个用逗号分隔
                limit: getNum, //获取条数
                start: startNum
                // beginDate : '2019-5-1', //开始时间，日期格式为'YYYY-MM-DD'
                // endDate : '2020-12-2' //结束时间，同上
            },
            dataType: 'jsonp',
            success: function success(data) {
                //接口调用失败
                if (!data.succ) return alert(data.msg);
                //新闻总条数
                cb(data);
            },
            error: function error() {
                console.log('获取失败');
            }
        });
    };
    getNews(update_param, 1, 1, function (data) {
        // var new_con = data.result.reverse();
        // console.log(data)
        var linkurl = data.result[0].url;

        window.location.href = "https://xy3d.163.com/client/?platform=" + platfromid + "&channel=" + channel + "&url=" + linkurl;
    });
});