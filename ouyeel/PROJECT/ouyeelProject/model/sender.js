/**
 * Created by wangyi on 17/8/27.
 */
var http=require('http');
var config = require('../config');


//发送 http Post 请求

function Poster(reqCc,reqData, callback){
    var postData=JSON.stringify(reqData);
    var options={
        hostname:config.host,
        port:config.port,
        path:config.path+reqCc,
        method:'POST',
        headers:{
            "Content-Type": 'application/json',
            'Content-Length':Buffer.byteLength(postData)
        }
    };
    var req=http.request(options, function(res) {
        console.log('Status:',res.statusCode);
        // console.log('headers:',JSON.stringify(res.headers));
        res.setEncoding('utf-8');
        res.on('data',function(chun){
            callback(null, chun);
        });
        res.on('end',function(){
            // console.log('No more data in response.********');
        });
    });
    req.on('error',function(err){
        console.error(err);
        callback(err, null)
    });
    req.write(postData);
    req.end();
}

module.exports = {
    Poster:Poster
};