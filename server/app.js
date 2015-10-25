
/*
	-How synchroinzation should be done?
	-Each object has ID. this ID must be assigned by server side. 
	-Client side will maintain dictionary of it's object? 
	-On New Event on client side. Then it will check if that id exists. if not. it mean new object. If yes it mean update. 
	-In Client side we should has silence Update. which mean update without out sync. 
	-
*/
var randomString = require('randomstring'); 
var counter = 1;// this is will be replaces with mongoose  
var prefix = 'Guest_'; 

//TODO: we need a data structure save the presentation for later use. 
//for now we will store it in the memory as an object. 

//deck is a list of slides. each slide has components. 
//and slide id. 

var deck = {    
    id:'', // room id
    slides:{
        //slideid uid will be the property key here. 
    }  
}

var decks = {}; 

function getNewGuestName(){
    return prefix+ randomString.generate(5); 
}
exports.start = function(server,connect,options){
	 var io = require('socket.io').listen(server);
	 setupDynamicRooms(io); 
}

function addAppListners(nsp,socket,room){
        var deck = decks[room]; 
        
        socket.on('deck:load',function(){
          console.log('deck', deck);
          socket.emit('deck:init',deck); 
        });

        socket.on('deck:background',function(background){
          console.log('background update', background);
          socket.broadcast.to(room).emit('deck:background',background); 
        })

        socket.on('deck:surface',function(background){
          console.log('background update', background);
          socket.broadcast.to(room).emit('deck:surface',background); 
        })

        var guestName = getNewGuestName(); 
        socket.profile  = { name:guestName , id:guestName } ; 
        deck.users[socket.profile.name] = socket.profile; 
       
        socket.emit('user:yourname', socket.profile); 
        socket.broadcast.to(room).emit('user:join', socket.profile); 

        socket.on('user:message',function(message){ 
            //TODO: add it to server side
            socket.broadcast.to(room).emit('user:message',{success:true, data:{user:socket.profile, text:message, createdAt:new Date()}});
        });
        socket.on('user:change-name',function(data){

          socket.profile.name = data.name;
           socket.emit('user:yourname',socket.profile);
          socket.broadcast.to(room).emit('user:name-change',{success:true,data:socket.profile}); 
        })


        socket.on('slide:create',function(slide){ 
            slide.id = counter++;
            deck.slides[slide.id] = slide; 
            slide.components = {}; 
            socket.emit('slide:create',{success:true, data:slide}); 
            nsp.to(room).emit('slide:create',{success:true, data:slide});
        });

        socket.on('slide:update',function(slide){ 
            //TODO: add it to server side
          
            console.log('slide update');
            decks[room].slides[slide.id] =  slide;  
            nsp.to(room).emit('slide:update',{success:true, data:slide});
        });

     
        socket.on('slide:delete',function(slide){ 
            
            //TODO
            //remove it from server side too
            delete  decks[room].slides[slide.id]
            socket.broadcast.to(room).emit('slide:delete',{success:true, data:slide});
        });

        

        socket.on('component:create',function(component){ 
          console.log('component' , component);
          
            component.id = counter++;
           
            decks[room].slides[component.slideId].components[component.__uid] = component;  
            socket.broadcast.to(room).emit('component:create',{success:true, data:component});
        });

        socket.on('component:delete',function(component){ 
            delete decks[room].slides[component.slideId].components[component.__uid]
            socket.broadcast.to(room).emit('component:delete',{success:true, data:component});
        });

        socket.on('component:update',function(component){ 
             decks[room].slides[component.slideId].components[component.__uid] = component; 
            socket.broadcast.to(room).emit('component:update',{success:true, data:component});
        });
}

function setupDynamicRooms(io){
    var namespace = io.of('/slider'); 

    var url = require('url');


    // global entry point for new connections
    namespace.on('connection', function (socket) {
      // extract namespace from connected url query param 'ns'
      var query = url.parse(socket.handshake.url, true).query;  
      if(query.room){
          socket.join(query.room); 
          if(!decks[query.room]){ 
             decks[query.room] = {
                id:query.room,
                slides:{
                  
                },
                users:{}
             }
          }
          else{
            //room already exists. we need to send all the deck to the client. 
            //we will wait client to ask for deck.so it has the chance to init everthing before loading the deck from the server. 
            //socket.emit('deck:init',decks[query.room]);
          }
          
          addAppListners(namespace,socket,query.room); 
      }
    });
}


