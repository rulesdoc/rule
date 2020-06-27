//var config=require('./config');
var express=require('express');
var app=express();
var http=require('http').Server(app);
var io=require('socket.io').listen(http);

io.on('connection',function(socket){
     socket.on('drop one',function(data){
         socket.broadcast.emit('drop one',data);
     });
});
app.use(express.static(__dirname + '/public'));
app.get('/',function(req,res){
    res.sendFile(__dirname+'/public/index3.html')

});
//http.listen(3000,'192.168.43.44',function() {
    http.listen(3000,function() {
//http.listen(config.post,config.host,function() {
    console.log('listening on *:3000')
})