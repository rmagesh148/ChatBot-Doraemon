var botProcess =  require('./chatBotModel.js');
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);


io.on('connection',function(client){
	console.log('client connected');
	
	client.on('join',function(name){
		client.nickname = name;
	});
	client.on('message',function(data){	
		
		var nickname = client.nickname;
		
		client.emit('message', nickname + ":" + data);
		
		botProcess(data, function(bmessage){
			
			client.emit('message','Doraemon:' + bmessage);
		});
		
		
		
	});
	
	});
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
	});

server.listen(8000,function(){
	console.log('port is listening');
});