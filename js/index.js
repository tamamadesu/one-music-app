"use strict";

let request = require("request");
let $ =  require("jquery");

var origin = 'http://music.163.com';
const url = `${origin}/api/search/suggest/web`;
let limit = 10;
let type = 10;
let offset = 1;
const option = {
    headers: {
        'Origin': origin,
        'Referer': origin,
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    method:"get",
    proxy: false
};

let search = {
    form:{
        s: '周杰伦',
        limit,type,offset,
        order:0
    },
    method:'post',
    url:url,
};

const album_url = `${origin}/api/album/18905`;
let album = {
    url:album_url
}

let song_id = 186014;
const song_url = `${origin}/api/song/detail?ids=%5B${song_id}%5d`;
let song_p = {
    url:song_url
}

let lrc_url = `${origin}/api/song/lyric?lv=-1&id=${song_id}`;
let lrc_p = {
    url:lrc_url
}

let artict = 6452;
const art_url = `${origin}/api/artist/albums/${artict}?offset=0&limit=20`;
let art_P = {
    url:art_url
};

let playlist =  `${origin}/api/playlist/detail?id=${311785002}`;
let playlist_p = {
    url:playlist
};

// http://music.163.com/api/mv/detail?id=319104&type=mp4


let params = Object.assign(option,search);
// let params = Object.assign(option,album);
// let params = Object.assign(option,song_p);
// let params = Object.assign(option,art_P);
// let params = Object.assign(option,lrc_p);
// let params = Object.assign(option,playlist_p);

request(params, (err, res, body) => {
    if (!err && res.statusCode == 200) {
        // let info = JSON.parse(body).result.albums[1];
        // let info = JSON.parse(body).album.songs[0];
        let info = JSON.parse(body);
        console.log(info);
        $("body").html(JSON.stringify(info,'',2));
    }
});


