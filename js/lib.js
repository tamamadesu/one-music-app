$.extend({  
    z4x: function(s) {  
        var dom;  
        if (typeof(s) == "object") {  
            dom = s;  
        } else if (typeof(s) == "string") {  
            if (window.ActiveXObject) {  
                dom = new ActiveXObject("Microsoft.XmlDom");  
                dom.async = "false";  
                dom.loadXML(s);  
            } else {  
                dom = new DOMParser().parseFromString(s, "text/xml");  
            }  
        }  
        var _dig = function(ele) {  
            var oo = {};  
            var alen = (ele.attributes) ? ele.attributes.length: 0;  
            for (var i = 0; i < alen; i++) {  
                oo["$" + ele.attributes[i].name] = ele.attributes[i].value;  
            }  
  
            var elen = ele.childNodes.length;  
            if (elen === 0) return oo;  
  
            var tem;  
            for (i = 0; i < elen; i++) {  
                tem = oo[ele.childNodes[i].nodeName];  
  
                if (typeof(tem) == "undefined") {  
  
                    if (ele.childNodes[i].childNodes.length === 0) {  
  
                        if (ele.childNodes[i].nodeName == "#text" || ele.childNodes[i].nodeName == "#cdata-section") {  
                            oo.$$ = ele.childNodes[i].nodeValue;  
                        } else {  
                            oo[ele.childNodes[i].nodeName] = [_dig(ele.childNodes[i])];  
                        }  
  
                    } else {  
                        oo[ele.childNodes[i].nodeName] = [_dig(ele.childNodes[i])];  
                    }  
                } else {  
                    tem[tem.length] = _dig(ele.childNodes[i]);  
                    oo[ele.childNodes[i].nodeName] = tem;  
                }  
            }  
            return oo;  
        };  
  
        var oo = {};  
        oo[dom.documentElement.nodeName] = _dig(dom.documentElement);  
        return oo;  
    },  
    ref : function(o,sp)  
    {  
        sp = sp?sp:"\n";  
        var tem = [];  
        for(var i in o) tem[tem.length]=i+":"+o[i];  
        return tem.join(sp);  
    }  
});  


var Api = {
    'qq':{
        // perpage=数量&curpage=页数&w=关键字
        'search':'http://open.music.qq.com/fcgi-bin/fcg_weixin_music_search.fcg'
    },
    'xiami':{
        'recommend_collect':'http://www.xiami.com/web/bang-collects?type=recommend&p=1',
        'get_collect_list':"http://www.xiami.com/song/playlist/type/3/id/", // +list_id
        "collect_keyword":"http://www.xiami.com/collect/search/",
        //id  2，年代电台  12，风格电台
        'type':'http://www.xiami.com/kuang/radio/c/id',
        // 搜索
        "search":'http://www.xiami.com/web/search-songs?limit=100&key='

    }

} 

var Notification = function(title,message){
    var Notification = require('node-notifier');
    var notifier = new Notification();
    notifier.notify({
        title:title,
        message:message,
        // icon: "../icon.png",
        "appIcon": "../icon.png",
        "contentImage": "../icon.png",
    });
}

