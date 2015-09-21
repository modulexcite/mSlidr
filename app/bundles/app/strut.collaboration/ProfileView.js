define(['libs/backbone',
	'strut/sync/collaborate',
	'moment',
	'lodash',
	'jquery.slimscroll',
	'css!/styles/messanger/messanger.css'],
function(Backbone,live,moment,_) {
	return Backbone.View.extend({
		className: 'profile',
		tagName :'div', 

		className: 'profile',
		el:'#profileContainer',
		tagName :'div',
		events:{
			'click #btn-close': 'toggle'
		}, 

		initialize: function() {
			this._template = JST['strut.collaboration/profile'];
		},

		render: function() {

			if(!this.rendered)
			{
				this.$el.html(this._template({username:this.username}));
				return this;	
			}
		},
		toggle:function(){
			var self = this; 
			this.render(); 
			if(this.hidden){
				$(this.el).show();
				this.hidden = false; 
			}
				
			else{
				$(this.el).hide();
				this.hidden = true; 
			}
		},

		constructor: function ProfileView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});