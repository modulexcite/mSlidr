
/*
	-How synchroinzation should be done?
	-Each object has ID. this ID must be assigned by server side. 
	-Client side will maintain dictionary of it's object? 
	-On New Event on client side. Then it will check if that id exists. if not. it mean new object. If yes it mean update. 
	-In Client side we should has silence Update. which mean update without out sync. 
	-
*/
var counter = 0;// this is will be replaces with mongoose  

exports.start = function(server,connect,options){
	 var io = require('socket.io').listen(server);
	 var nsp = io.of('/mslider')
     nsp.on('connection', function(socket) {
    	console.log('new connection'); 
    	socket.on('slide:create',function(slide){ 
            //TODO: add it to server side
    		console.log('slide created');
    		slide.id = counter++;
    	 	socket.broadcast.emit('slide:create',{success:true, data:slide});
        })

        socket.on('slide:delete',function(slide){ 
            console.log('slide deleted');
            //TODO
            //remove it from server side too
            socket.broadcast.emit('slide:delete',{success:true, data:slide});
        })

        

        socket.on('text:create',function(text){ 
        	console.log('text created');
        	text.id = counter++;
    	 	socket.broadcast.emit('text:create',{success:true, data:text});
        })
     });
}