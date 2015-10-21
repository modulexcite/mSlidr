define(['socketio','lodash', 'libs/backbone'],
function(socketio,_,Backbone) {
	'use strict';
	var singlton = null;
	function mySinglton(){
		this.init(); 
	}

	mySinglton.prototype.init = function() {
		this.space = {}; 
		this.watcher = {};
		_.extend(this.watcher, Backbone.Events);

		this.loadDeck = function(){
			//send me the deck you have please. 
			window.socket.emit('deck:load'); 
		}

		this.addObject = function(object,silence){
			//we should get objectID. 
			if(!object.get('__uid')){
				object.set('__uid',this._getGUID()); 
				this.space[object.get('__uid')] = object; 
			}
			else{
				//if it has uid then add it directly to the space. 
				this.space[object.get('__uid')] = object; 
			}
			//if obejct doesn't have id then sync it as create.

			if(!object.get('id'))
				object.save();  // call sync
			
		}

		this.removeObject = function(object){
			if( object.get('__uid')){
				delete this.space[object.get('__uid')]; 
				object.destroy();	
			}
		}

		this.subscribe = function(topic,handler,context){
			this.watcher.on(topic,handler,context); 
		}

		this.sendMessage = function(message){
			window.socket.emit('user:message', message);
		}

		this.setBackground = function(allSlides,bg,attr,objectId){

			window.socket.emit('deck:'+attr,{allSlides:allSlides, bg:bg, attr:attr, objectId:objectId}); 
		}

		this.changeName = function(userName){
			window.socket.emit('user:change-name' , {name:userName});
		}


		this.connect= function(url){

			var base=window.location.protocol + "//"+window.location.host +  '/slider'; 
	
			this.socket = socketio.connect(base , {query: 'room='+url}); 

			window.socket = this.socket; 

			window.socket.on('user:yourname',function(res){
				singlton.watcher.trigger('user:yourname',res); 
			}); 

			window.socket.on('user:name-change',function(res){
				singlton.watcher.trigger('user:name-change',res.data); 
			});

		
			window.socket.on('deck:init',function(res){
				/*the init function is different. 
				_.each(res.slides,function(slide,key,obj){
					slide.selected = false; // disable selected!!
					singlton.watcher.trigger('slide:create',slide); 
					debugger;
					_.each(slide.components,function(component,key,obj){
						singlton.watcher.trigger('component:create',component); 
					});

				});
				*/
				singlton.watcher.trigger('deck:init',res); 
			});

			window.socket.on('deck:background',function(res){
				/*the init function is different. 
				_.each(res.slides,function(slide,key,obj){
					slide.selected = false; // disable selected!!
					singlton.watcher.trigger('slide:create',slide); 
					debugger;
					_.each(slide.components,function(component,key,obj){
						singlton.watcher.trigger('component:create',component); 
					});

				});
				*/
				if(res.allSlides==true)	{
				
					singlton.watcher.trigger(res.attr+':change',res.allSlides,res.bg,res.attr); 
				}
					
				else
				{
					//if single slide. then get it from the space. 

					singlton.watcher.trigger(res.attr+':change',false,res.bg,res.attr,singlton.space[res.objectId]);
				}
			});

			window.socket.on('deck:surface',function(res){
				/*the init function is different. 
				_.each(res.slides,function(slide,key,obj){
					slide.selected = false; // disable selected!!
					singlton.watcher.trigger('slide:create',slide); 
					debugger;
					_.each(slide.components,function(component,key,obj){
						singlton.watcher.trigger('component:create',component); 
					});

				});
				*/
				if(res.allSlides==true)	{
					
					singlton.watcher.trigger(res.attr+':change',res.allSlides,res.bg,res.attr); 
				}
					
				else
				{
					//if single slide. then get it from the space. 

					singlton.watcher.trigger(res.attr+':change',false,res.bg,res.attr,singlton.space[res.objectId]);
				}
			});


			


			window.socket.on('user:join',function(res){
				singlton.watcher.trigger('user:join',res); 
			});

			window.socket.on('user:message',function(res){
				singlton.watcher.trigger('user:message',res.data); 
			}); 
			window.socket.on('component:create', function(res){
				if(res && res.success){
					var objectId = res.data.__uid; 
					if(singlton.space[objectId]){ // object exists. 
						singlton.space[objectId].set('id',res.data.id) ; 
					}
					else{
						//new object created. notifiy who is interested.
						singlton.watcher.trigger('component:create',res.data); 
					}
				}
			});

			window.socket.on('component:update', function(res){
				if(res && res.success){
					var objectId = res.data.__uid; 
					if(singlton.space[objectId]){ // object exists. 
						var objRef = singlton.space[objectId]; 
						objRef.set('id',res.data.id) ; 
						objRef.set(singlton.getAttrs(res.data, objRef), {silence:true}); 

					}
				}
			});

			window.socket.on('component:delete', function(res){
				if(res && res.success){
					var objectId = res.data.__uid;
					if(singlton.space[objectId]){ // object exists. 
						singlton.watcher.trigger('component:delete', singlton.space[objectId])
						delete singlton.space[objectId]; 
					}
				}
			});


			window.socket.on('slide:create', function(res){
				if(res && res.success){
					var objectId = res.data.__uid; 
					if(singlton.space[objectId]){ // object exists. 
						singlton.space[objectId].set('id',res.data.id) ; 
					}
					else{
						//new object created. notifiy who is interested.
						res.data.selected = false; // disable selected!!
						singlton.watcher.trigger('slide:create',res.data); 
					}
				}
        	});

        	window.socket.on('slide:update', function(res){
				
				if(res && res.success){
					var objectId = res.data.__uid; 
					if(singlton.space[objectId]){ // object exists. 
						var objRef = singlton.space[objectId]; 
						objRef.set('id',res.data.id) ; 
						objRef.set(singlton.getAttrs(res.data, objRef), {silence:true}); 
					}
				}
				
			});

        	window.socket.on('slide:delete', function(res){
				if(res && res.success){
					var objectId = res.data.__uid;
					if(singlton.space[objectId]){ // object exists. 
						singlton.watcher.trigger('slide:delete', singlton.space[objectId])
						delete singlton.space[objectId]; 
					}
				}
        	});

		}

		this.getAttrs = function(obj, spaceObj){
			obj.selected = spaceObj.get('selected')
			return obj;
		}

		this._getGUID = function(){
			function s4() {
			    return Math.floor((1 + Math.random()) * 0x10000)
			      .toString(16)
			      .substring(1);
			}
			return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
		}
	};

	mySinglton.getInstance = function(){
		if(singlton === null)
			singlton = new mySinglton(); 
		return singlton; 
	}
	return  mySinglton.getInstance(); 
});
