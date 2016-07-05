"use strict";

var request = require("request");

var origin = 'http://music.163.com';
const url = `${origin}/api/search/suggest/web`;
let limit = 3;
let type = 1;
let offset = 0;
const option = {
    form:{
        s: '周杰伦',
        limit,type,offset
    },
    method:'post',
    url:url,
    headers: {
        'Origin': origin,
        'Referer': origin,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      proxy: false
};
request(option, (err, res, body) => {
    if (!err && res.statusCode == 200) {
        let info = JSON.parse(body).result.albums[0];
        console.log(JSON.stringify(info,'',2));
    }
});

