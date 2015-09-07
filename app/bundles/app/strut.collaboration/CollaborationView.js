define(['libs/backbone',
	'strut/messaging/MessangerView',
	'strut/sync/collaborate',
	'css!styles/messanger/messanger.css'],
function(Backbone,MessangerView,live) {
	return Backbone.View.extend({
		className: 'collaboraionPanel',
		tagName :'div',
		events:{
			"click #discussicon":"toggleMessanger"
		},

		initialize: function() {
			//the collaboaring viewer will hold instance from the messanger viewer
			this._template = JST['strut.collaboration/collaborate'];
			live.subscribe('user:yourname',this.connected,this); 
			live.subscribe('user:join',this.addUser,this);
			live.subscribe('user:left',this.removeUser,this); 
			live.subscribe('user:message',this.addMessage,this);  
		},

		render: function() {
			this.$el.html(this._template());
			return this;
		},

		constructor: function CollaborationView() {
			this.chatIsHiddee = true; 
			this._messanger = new MessangerView(); 
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		connected:function(myname){
			this._messanger.setName(myname); 
		}, 
		addUser:function(username){
			//alert(username); 
		}, 
		removeUser:function(){
			alert('remove user'); 
		}, 
		addMessage:function(message){
			if(this.chatIsHiddee){
				var self = this;
				this.$('#discussicon>.m-label').animate({opacity:0},700,"linear",function(){
				  $(this).animate({opacity:1},700);
				});
			}
			
			this._messanger.addMessage(message);
		}, 
		toggleMessanger:function(){
			this.chatIsHiddee = !this.chatIsHiddee; 
			this._messanger.toggle(); 
		}
	});
});