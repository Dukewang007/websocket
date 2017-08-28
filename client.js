
var express = require('express')
var http = require('http');

var WebSocket = require('ws');

var app = express();

app.use(express.static(__dirname));



var server = http.createServer(app)
var wss = new WebSocket.Server({server})



wss.on('connection',function connection(ws){
  console.log('new connection founded successfully');
  
  ws.on('message',function incoming(data){

    wss.clients.forEach(function each(client){
      client.send(data)
    })
  });
  
  ws.on('close',function(){
    console.log('websocket-server closed...');
  });
});
server.listen(8052,function listening(){
  console.log("server 启动")
})
