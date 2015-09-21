define(['libs/backbone',
	'strut/sync/collaborate',
	'moment',
	'lodash',
	'jquery.slimscroll',
	 
	'css!/styles/messanger/messanger.css'],
function(Backbone,live,moment,_) {
	return Backbone.View.extend({
		className: 'messanger',
		el:'#messangerContainer',
		tagName :'div',
		events:{
			'keyup #txtMessage': 'onKeyUp',
			'click #btn-close': 'toggle'
		}, 

		initialize: function() {

			this._template = JST['strut.messaging/messanger'];
			this._messageTemplate = JST['strut.messaging/message'];
		},

		render: function() {
			if(!this.rendered)
			{
				this.$el.html(this._template({username:this.username}));
				this.$('#messages').slimscroll();
				$(this.el).hide();
				this.rendered = true;
				this.hidden = true;  
				return this;	
			}
		},

		constructor: function MessangerView() {
			this.username = "Guest";
			this.rendered = false; 
			this.hidden = false; 
			this.messagesBuffer = []; 
			Backbone.View.prototype.constructor.apply(this, arguments);
		},
		setName:function(username){
			this.username = username; 
		}, 
		changeMyName:function(){
			var newUserName = this.$('lbl-username').val(); 
			
		}, 
		onKeyUp:function(e){
			if(e.which === 13){ // enter key{
				var messageTxt = this.$('#txtMessage').val(); 
				this.addMessage({
					username:'You', 
					createdAt:new Date(), 
					text:messageTxt,
					className:'right'
				});
				
				live.sendMessage(messageTxt);
				this.$('#txtMessage').val('');  
			}
    			
		}, 
		notifyMessage:function(){

		}, 
		shouldScroll: function(response) {
		  var messages_content = this.$('#content-container');
		  if(messages_content && messages_content[0])
		  	return  messages_content[0].clientHeight + messages_content[0].scrollTop === messages_content[0].scrollHeight;
		  else
		  	return true;
		},

		scroll:function(){
		  	this.$('#content-container').scrollTop(1E10);
		  
		},

		addMessage:function(message){


			if(this.hidden){
				this.messagesBuffer.push(message); 
				this.notifyMessage(); 
			}
			else{
				var shouldScroll = this.shouldScroll(); 
				this.$('.content').append(this._messageTemplate({
					username:message.username, 
					createdAt:moment(message.createdAt).format('h:mm a') ,
					text:message.text,
					className:message.className?message.className:'left'
				}));
				if(shouldScroll)
					this.scroll();
			}
			
		}, 
		toggle:function(){
			var self = this; 
			this.render(); 
			if(this.hidden){
				$(this.el).show();
				this.hidden = false
				_.each(this.messagesBuffer,function(message){
					self.addMessage(message);
				})
				

			}
				
			else{
				$(this.el).hide();
				this.hidden = true; 

			}	
		}
	});
});