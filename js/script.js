
var Audio = {
    audio:null,      // 音频对象
    current_t:0,     // 当前播放时间 
    duration_t:0,    // 时长
    end_sign:false,  // 播放结束标志 
    init:function(id,callback,src){
        this.audio = document.getElementById(id);
        this.audio.addEventListener('canplay', this.canplay,false);
        this.audio.addEventListener('durationchange', this.durationchange,false);
        this.audio.addEventListener('timeupdate', this.timeupdate,false);
        this.audio.addEventListener('progress', this.progress,false);
        this.audio.addEventListener('ended',this.ended, false);
    },
    play:function(src){
        if(src){
            this.audio.src = src;
        }
        Audio.end_sign = false;
        this.audio.play();
    },
    canplay:function(){
        Audio.end_sign = false;
        Audio.duration_t = Audio.audio.duration.toFixed(0);
    },
    pause:function(){
        this.audio.pause();
    },
    mute:function(){
        this.audio.volume = 0;
    },
    // 是否循环 true false
    loop:function(sign){
        this.audio.loop = sign;
    },
    // between 0,1;
    setVolume:function(num){   
        this.audio.volume = num;
    },
    //时间线
    timeupdate:function(callback){
        Audio.current_t = Audio.audio.currentTime.toFixed(0);
    },
    // 缓冲时间
    buffer:function(){
        console.log(1)
    },
    progress:function(){
        var p = Audio.audio.buffered;
    },
    ended:function(){
        Audio.end_sign = true;
        console.log('end');
    }
}

// 切换面板
var Switch_panel = {
    prev:function(){
        $(".bg-cover").fadeOut();
        $(".playpanel").removeClass('bounceOutRight').addClass('bounceInLeft').show();
        $(".playbox").removeClass('bounceInLeft').addClass('bounceOutRight').hide();
    },
    next:function(){
        $(".bg-cover").fadeIn();
        $(".playbox").removeClass('bounceOutRight').addClass('bounceInLeft').show();
        $(".playpanel").removeClass('bounceInLeft').addClass('bounceOutRight').hide();
    }
};

// 统一播放列表结构
var Format_list = function(type,data){
    var obj_list = [],
        len      = data.length;
    switch(type){
        case "xiami":
            for(var i=0;i<len;i++){
                var obj = {},
                    d   = data[i];
                obj.id        = i;
                obj.name      = d.album_name[0].$$;
                obj.cover     = d.album_pic[0].$$;
                obj.artist    = d.artist[0].$$;
                obj.bg_pic    = d.background[0].$$;
                obj.src       = decode(d.location[0].$$.toString());
                obj.pic       = d.pic[0].$$;
                obj.lrc       = d.lyric[0].$$;
                obj.song_id   = d.song_id[0].$$*1;
                obj.title     = d.title[0].$$;
                obj.lyric_url = d.lyric_url[0].$$;
                obj_list.push(obj);
            }
        break;
    }

    return obj_list;
};

// 播放控制
var Control = function(){


    function playHandle(){
        if($(this).hasClass("pause")){
            $(this).removeClass("pause octicon-playback-pause")
            $(this).addClass("play octicon-playback-play")
            Audio.pause();
        }else{
            $(this).addClass("pause octicon-playback-pause")
            $(this).removeClass("play octicon-playback-play")
            Audio.play();
        }
        return false;
    }

    function prevHandle(){
        Xiami.play_index--;
        if(Xiami.play_index <= 0){
            Xiami.play_index = 0;
        }
        Xiami.play();
    }

    function nextHandle(){
        Xiami.play_index++;
        if(Xiami.play_index > Xiami.songs_list.length){
            Xiami.play_index = Xiami.songs_list.length;
        }
        Xiami.play();
    }

    function backPanel(){
        Switch_panel.prev();
        return false;
    }

    function playListHandle(){
        var id = $(this).attr("id").replace("id_","");
        Xiami.play_index = id;
        Xiami.play();
        return false;
    }

    function init(){
        var $playbox = $(".playbox");
        $playbox.find(".pp").click(playHandle);
        $playbox.find(".prev").click(prevHandle);
        $playbox.find(".next").click(nextHandle);
        $playbox.find(".back-panel").click(backPanel);
        $playbox.delegate(".list li","click",playListHandle);
        $(window).keyup(function(e){
            if(e.keyCode == 32){
                $playbox.find(".pp").trigger("click");
            }
        });
    }

    return {
        init:init
    }
}();


var Xiami = {
    songs_list:[],
    play_index:0,
    panel_list:$(".panel-list ul"),
    // 精选集列表结构
    collect_html:function(data){
        return '<li class="list" id="list_'+data.list_id+'">'+
               '    <img src="'+data.logo+'" class="logo" alt="">'+
               '    <h2 class="name">'+data.collect_name+'</h2>'+
               '    <h3>by <span class="author">'+data.user_name+'</span></h3>'+
               '</li>';
    },
    // 栏目类别处理
    getColumnContent:function(){
        var $li  = $(".xiami_panel .column li"),
            type = $(this).att("data-type");
        switch(type){
            case "collect":break;
            case "time":

            break;
        }
        $li.removeClass("current");
        $(this).addClass("current");
    },
    // 获取精选集列表
    getRecommendCollect:function(){
        $.get(Api.xiami.recommend_collect,function(data){
            var html = '';
            $.each(data,function(i,item){
                html += Xiami.collect_html(item)+'\n';
            });
            Xiami.panel_list.html(html);
        },'json');
    },
    // 点击 播放单个精选集 歌曲列表
    getCollectContent:function(){
        var list_id = $(this).attr("id").replace('list_','');
        $.get(Api.xiami.get_collect_list+list_id,function(data){
            data = $.z4x(data);
            data = data.playlist.trackList[0].track;
            data = Format_list("xiami",data);
            Xiami.songs_list = data;
            Switch_panel.next();
            Xiami.play();
            Xiami.fullPlayList();
        },"xml");
    },
    // 填充歌曲列表
    fullPlayList:function(){
        var $list = $(".playbox .list ul"),
            html  = '';
        for(var i=0;i<Xiami.songs_list.length;i++){
            var li = Xiami.songs_list[i];
            html += '<li id="id_'+li.id+'"><span class="n">'+li.title+'</span><span class="a">'+li.artist+'</span></li>';
        }
        $list.html(html);
    },
    // 搜索
    search:function(e){
        var type = $(".xiami_panel .current").attr("data-type"),
            key  = $.trim($(this).val());

        if(e.keyCode !== 13 || !key){return false;}

        switch(type){
            case 'collect':  // 搜索精选集
                $.get(Api.xiami.collect_keyword,{"key":key,'order':'play_count'},function(json){
                    // 组合搜索结果结构
                    var data          = /<body[\s\S]*?body>/.exec(json),
                        $list         = $(data.toString()).find(".block_list ul li"),
                        collects_list = [],
                        html          = '';
                    console.log($list.eq(0).html())

                    for(var i=0;i<$list.length;i++){
                        var $li        = $list.eq(i),
                            collect    = {},
                            name       = $li.find("h3 a").attr("title"),
                            logo       = $li.find(".block_cover img").attr("src"),
                            collect_id = $li.find("h3 a").attr("href").split("/"),
                            author     = $li.find(".collect_info a").text(),
                            times      = $li.find(".collect_info span").eq(1).text();
                            times      = $li.find(".p").text();

                        collect_id = collect_id[collect_id.length - 1];

                        collect.collect_name    = name;
                        collect.logo            = logo;
                        collect.user_name       = author;
                        collect.list_id         = collect_id;
                        collect.play_count      = times;

                        html += Xiami.collect_html(collect) + '\n';
                    }

                    Xiami.panel_list.html(html);

                });
            break;
        }
    },
    //播放计时器
    timer:function(){
        var t = setInterval(function(){
            if(Audio.end_sign){
                clearInterval(t);
                Xiami.play_index++;
                Xiami.play();
            }
        },1000)
        return t;
    },
    //播放
    play:function(){
        var data = Xiami.songs_list[Xiami.play_index];
        Audio.play(data.src);
        var $playbox = $(".playbox"),
            artist   = data.artist+"\/"+data.name;
        $playbox.find(".cover").attr("src",data.pic);
        $playbox.find(".name").html(data.title);
        $playbox.find(".artist").html(artist);
        $(".bg-cover").css("background-image","url("+data.cover+")").fadeIn('slow');
        Notification(data.title,artist);
        // 标记选中
        $(".playbox .list ul li").removeClass("current");
        $("#id_"+Xiami.play_index).addClass("current");
        Xiami.timer();
    },
    init:function(){
        this.getRecommendCollect();
        $(".xiami_panel").delegate(".column li","click",this.getColumnContent);
        $(".xiami_panel").delegate(".list","click",this.getCollectContent);
        $(".xiami_panel .search .type").keyup(this.search);
    }
}



Control.init();
Audio.init("audio");
Xiami.init();



var gui = require('nw.gui');

var option = {
  key : "Ctrl+Shift+A",
  active : function() {
    console.log("Global desktop keyboard shortcut: " + this.key + " active."); 
  },
  failed : function(msg) {
    // :(, fail to register the |key| or couldn't parse the |key|.
    console.log(msg);
  }
};
// Create a shortcut with |option|.
// var shortcut = new gui.Shortcut(option);

// gui.App.registerGlobalHotKey(shortcut);
//type 1 歌曲 , 100 歌手, 10 专辑, 1000 歌单

// http://music.163.com/artist?id=

var  Ajax_163 = function(url,parm,callback,type,dataType){
    $.ajax({
        url:url,
        headers: {"referer":"http://music.163.com/",'Cookie' : 'appver=1.5.2;'},
        data:parm,
        dataType:dataType,
        type: type,
        success:callback
    });
}


Ajax_163("http://music.163.com/api/search/get/web?csrf_token=",{s:"周杰伦",limit:20,offset:0,type:100},function(data){
    console.log(data)
},"post","json")

Ajax_163("http://music.163.com/api/artist/albums/6452",{limit:20,offset:0},function(data){
    console.log(data)
},"get","json");

















