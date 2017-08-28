var http = require('http');
var fs = require('fs')
var ws = require('ws').Server; //定义websocket模块
var documentRoot = 'E:/websocket'; //设置本地文件
var server = new ws({ host: "127.0.0.1", port: 9999 });
var http_server = http.createServer(function(req, res) {
    var url = req.url;
    var file = documentRoot + url;
    fs.readFile(file, function(err, data) {
        /*
            一参为文件路径
            二参为回调函数
                回调函数的一参为读取错误返回的信息，返回空就没有错误
                二参为读取成功返回的文本内容
        */
        if (err) {
            res.writeHeader(404, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write('<h1>404错误</h1><p>你要找的页面不存在</p>');
            res.end();
        } else {
            res.writeHeader(200, {
                'content-type': 'text/html;charset="utf-8"'
            });
            res.write(data); //将index.html显示在客户端
            res.end();

        }
    })

}).listen(10000)
server.on('connection', function(ws) {
    console.log('new connection founded successfully');
   
    ws.on('message', function(data) {
        console.log(data)
        
    });
    ws.on("close", function() {
        
    });
   
    
    
});