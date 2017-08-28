
var http = require('http');
var fs = require('fs')
var ws = require('ws').Server; //定义websocket模块

var psy = {
    "socket": [
        { "name": "中国北车", "code": "", "price": "$7.25" },
        { "name": "中国石油", "code": "", "price": "$4.25" },
        { "name": "中国移动", "code": "", "price": "$8.25" },
        { "name": "国家电网", "code": "", "price": "$6.25" },
        { "name": "中船重工", "code": "", "price": "$9.25" },
        { "name": "阿里巴巴", "code": "", "price": "$10.25" },
        { "name": "腾讯", "code": "", "price": "$10.25" },
        { "name": "苹果", "code": "", "price": "$10.25" },
        { "name": "甲骨文", "code": "", "price": "$10.25" },
        { "name": "推特", "code": "", "price": "$10.25" },
        { "name": "百度", "code": "", "price": "$10.25" },
        { "name": "华为", "code": "", "price": "$10.25" }
    ],

}

//生成6位0-9随机数
function getNum(ws) {
    var socket = {}
    var num = ""; //容器
    var price = (Math.random() * 10).toFixed(2);
    for (var i = 0; i < 6; i++) { //循环六次
        num += parseInt(Math.random() * 10); //Math.random();每次生成(0-1)之间的数;

    }
    socket["name"] = "alibaba";
    socket["code"] = num;
    socket["price"] = price;
    ws.send(JSON.stringify(socket));
}

var documentRoot = 'E:/websocket'; //设置本地文件
var server = new ws({ host: "127.0.0.1", port: 8808 });
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

}).listen(8568)
server.on('connection', function(ws) {
    console.log('new connection founded successfully');
    var clientMemUpdater;
    var sendMemUpdates = function(ws) {
        if (ws.readyState == 1) {
            getNum(ws);
        }
    }
    clientMemUpdater = setInterval(function() {
        sendMemUpdates(ws);
    }, 5000);
    ws.on('message', function(data) {
        console.log(data)
        
    });
    ws.on("close", function() {
        if (typeof clientMemUpdater != 'undefined') {
            clearInterval(clientMemUpdater);
        }
    });
   // ws.send(JSON.stringify(psy))
    
    
});