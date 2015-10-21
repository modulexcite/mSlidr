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
			this.friends = []; 
			BaseModalView.prototype.initialize.apply(this,arguments); 
			this._friendsTemplate = JST['strut.collaboration/friends'];
			this.rendered = false;
			this.modalView = null; 
		},

		render: function() {
			BaseModalView.prototype.render.apply(this,arguments);
		},
		toggle:function(){
			BaseModalView.prototype.render.call(this,{title:"Friends"}); 
			debugger;
			this.renderView(this._friendsTemplate, {friends:this.friends}); 
			this.show();
		},
		close:function(){
			BaseModalView.prototype.teardown.apply(this, arguments);
		},

		add:function(user){
			this.friends.push(user); 
			//render more friend
		}, 

		remove:function(user){
			delete this.friends[user.id]; 
			//render again.
		}, 
		update:function(user){
			var index = _.findIndex(this.friends, function(friend) {
			  return friend.id == user.id;
			});
			if(index>-1)
				this.friends[index] = user; 
			//render again. 
		},

		constructor: function ProfileView() {
			BaseModalView.prototype.constructor.apply(this, arguments);
		}
	});
});