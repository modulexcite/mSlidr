define(['libs/backbone',
	'strut/sync/collaborate',
	'moment',
	'lodash',
	'strut/collaboration/BaseModalView',
	'jquery.slimscroll',
	'css!/styles/messanger/messanger.css'],
function(Backbone,live,moment,_,BaseModalView) {
	return BaseModalView.extend({
		events:{
			'click #btn-close': 'close', 
			'click #btn-save': 'changeName', 
		}, 

		initialize: function() {
			BaseModalView.prototype.initialize.apply(this,arguments); 
			this._profileTemplate = JST['strut.collaboration/profile'];
			this.rendered = false;
			this.modalView = null; 
		},

		render: function() {
			BaseModalView.prototype.render.apply(this,arguments);
		},
		toggle:function(){
			BaseModalView.prototype.render.call(this,{title:"Profile",username:this.username}); 
			this.renderView(this._profileTemplate , {username:this.username}); 
			this.show();
		},
		close:function(){
			BaseModalView.prototype.teardown.apply(this, arguments);
		}, 

		changeName:function(){
			var userName = this.$("#txt-username").val(); 
			live.changeName(userName);
		},

		setName:function(user){
			debugger;
			this.username = user.name; 
			this.userId = user.id; 
		},

		constructor: function ProfileView() {
			BaseModalView.prototype.constructor.apply(this, arguments);
		}
	});
});