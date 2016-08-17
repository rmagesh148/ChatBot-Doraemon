var botProcess =  require('./chatBotModel.js');
var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io')(server);
var botMessage;

io.on('connection',function(client){
	console.log('client connected');
	//client.emit('messages',{hello:'world'});
	client.on('message',function(data){	
		//client.broadcast.emit('message',data);
		client.emit('message',data);
		botMessage = botProcess(data);
		client.emit('message','world');
		console.log(data);
	});
	
	});
app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
	});

server.listen(8000,function(){
	console.log('port is listening');
});