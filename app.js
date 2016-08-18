var botProcess =  require('./chatBotModel.js');
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
//var botMessage = null;


io.on('connection',function(client){
	console.log('client connected');
	
	client.on('message',function(data){	
		
		client.emit('message',data);
		
		botProcess(data, function(bmessage){
			//console.log(bmessage);
			client.emit('message',bmessage);
		});
		
		
		
	});
	
	});
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
	});

server.listen(8000,function(){
	console.log('port is listening');
});