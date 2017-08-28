var http = require('http');
var fs = require('fs')
var documentRoot = 'E:/websocket'; //设置本地文件
var WebSocketServer = require('ws').Server,
wss = new WebSocketServer({ port: 8181 });
var stocks = {
    "AAPL": 95.0,
    "MSFT": 50.0,
    "AMZN": 300.0,
    "GOOG": 550.0,
    "YHOO": 35.0
}
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

}).listen(8789)

function randomInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var stockUpdater;
var randomStockUpdater = function() {
    for (var symbol in stocks) {
        if(stocks.hasOwnProperty(symbol)) {
            var randomizedChange = randomInterval(-150, 150);
            var floatChange = randomizedChange / 100;
            stocks[symbol] += floatChange;
        }
    }
    var randomMSTime = randomInterval(500, 2500);
    stockUpdater = setTimeout(function() {
        randomStockUpdater();
    }, randomMSTime);
}
randomStockUpdater();
var clientStocks = [];
wss.on('connection', function (ws) {
    var sendStockUpdates = function (ws) {
        if (ws.readyState == 1) {
            var stocksObj = {};
            for (var i = 0; i < clientStocks.length; i++) {
              var symbol = clientStocks[i];
                stocksObj[symbol] = stocks[symbol];
            }
            if (stocksObj.length !== 0) {
                ws.send(JSON.stringify(stocksObj));
                console.log("更新", JSON.stringify(stocksObj));
            }
           
        }
    }
    var clientStockUpdater = setInterval(function () {
        sendStockUpdates(ws);
    }, 3000);
    ws.on('message', function (message) {
        console.log(message)
        var stockRequest = JSON.parse(message);
        console.log("收到消息", stockRequest);
        clientStocks = stockRequest['stocks'];
        sendStockUpdates(ws);
    });
    ws.on('close', function () {
        if (typeof clientStockUpdater !== 'undefined') {
            clearInterval(clientStockUpdater);
        }
    });
});