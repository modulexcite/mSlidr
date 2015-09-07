
/*
	-How synchroinzation should be done?
	-Each object has ID. this ID must be assigned by server side. 
	-Client side will maintain dictionary of it's object? 
	-On New Event on client side. Then it will check if that id exists. if not. it mean new object. If yes it mean update. 
	-In Client side we should has silence Update. which mean update without out sync. 
	-
*/
var randomString = require('randomstring'); 
var counter = 0;// this is will be replaces with mongoose  
var prefix = 'Guest_'; 

function getNewGuestName(){
    return prefix+ randomString.generate(5); 
}
exports.start = function(server,connect,options){
	 var io = require('socket.io').listen(server);
	 var nsp = io.of('/mslider')
     nsp.on('connection', function(socket) {
        
        var guestName = getNewGuestName(); 
    	socket.username = guestName; 
        socket.emit('user:yourname', guestName); 

        socket.broadcast.emit('user:join', {name:guestName}); 
        socket.on('user:message',function(message){ 
            //TODO: add it to server side
            console.log('new message from ' , socket.username , message);
            socket.broadcast.emit('user:message',{success:true, data:{username:socket.username, text:message, createdAt:new Date()}});
        });


    	socket.on('slide:create',function(slide){ 
            //TODO: add it to server side
    		console.log('slide created');
    		slide.id = counter++;
    	 	nsp.emit('slide:create',{success:true, data:slide});
        });

     
        socket.on('slide:delete',function(slide){ 
            console.log('slide deleted');
            //TODO
            //remove it from server side too
            nsp.emit('slide:delete',{success:true, data:slide});
        });

        

        socket.on('text:create',function(text){ 
        	console.log('text created');
        	text.id = counter++;
    	 	nsp.emit('text:create',{success:true, data:text});
        });

        socket.on('text:delete',function(text){ 
            console.log('text deleted');
            text.id = counter++;
            nsp.emit('text:delete',{success:true, data:text});
        });

        socket.on('text:update',function(text){ 
            console.log('text updated');
            text.id = counter++;
            nsp.emit('text:update',{success:true, data:text});
        });


     });
}