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
			debugger; 

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

		this.connect= function(url){
			debugger; 
			this.socket = socketio.connect(window.location.href + (url || "")); 
			window.socket = this.socket; 
			window.socket.on('slide:create', function(res){
				debugger;
				if(res && res.success){
					var objectId = res.data.__uid; 
					if(singlton.space[objectId]){ // object exists. 
						singlton.space[objectId].set('id',res.data.id) ; 
					}
					else{
						//new object created. notifiy who is interested.
						singlton.watcher.trigger('slide:create',res.data); 
					}
				}
        	});

        	window.socket.on('slide:delete', function(res){
				debugger;
				if(res && res.success){
					var objectId = res.data.__uid;
					if(singlton.space[objectId]){ // object exists. 
						singlton.watcher.trigger('slide:delete', singlton.space[objectId])
						delete singlton.space[objectId]; 
					}
				}
        	});

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
