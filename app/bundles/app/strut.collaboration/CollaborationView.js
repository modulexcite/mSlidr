define(['libs/backbone',
	'strut/messaging/MessangerView',
	'strut/collaboration/ProfileView',
	'strut/collaboration/FriendsView',
	'strut/collaboration/ShareView',
	'strut/sync/collaborate',
	'css!/styles/messanger/messanger.css'],
function(Backbone,MessangerView,ProfileView,FriendsView,ShareView, live) {
	return Backbone.View.extend({
		className: 'collaboraionPanel',
		tagName :'div',
		events:{
			"click #discussicon":"toggleMessanger", 
			"click #profile":"toggleProfile", 
			"click #friendsicon": "toggleFriends",
			"click #shareicon":"toggleShare"

		},

		initialize: function() {
			//the collaboaring viewer will hold instance from the messanger viewer
			this._template = JST['strut.collaboration/collaborate'];
			live.subscribe('user:yourname',this.connected,this); 
			live.subscribe('user:join',this.addUser,this);
			live.subscribe('user:left',this.removeUser,this); 
			live.subscribe('user:message',this.addMessage,this);  
			live.subscribe('user:name-change',this.changeName,this); 
		},

		render: function() {
			this.$el.html(this._template());
			return this;
		},

		constructor: function CollaborationView() {
			this.chatIsHiddee = true; 
			this._messanger = new MessangerView(); 
			this._profile = new ProfileView(); 
			this._friends = new FriendsView();
			this._share = new ShareView();
			Backbone.View.prototype.constructor.apply(this, arguments);
		},

		changeName:function(user){
			//here we should see list of connected users and set the name to new one. for friends. 
			this._friends.update(user); 
		}, 

		connected:function(user){
			this._messanger.setName(user); 
			this._profile.setName(user);
		}, 
		addUser:function(user){
			debugger;
			this._friends.add(user); 
		}, 
		removeUser:function(){
			this._friends.remove(user); 
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

		toggleProfile:function(){
			this._profile.toggle(); 
		},
		toggleFriends:function(){
			this._friends.toggle(); 
		},
		toggleMessanger:function(){
			this.chatIsHiddee = !this.chatIsHiddee; 
			this._messanger.toggle(); 
		},
		toggleShare:function(){
			this._share.toggle(); 
		},
	});
});