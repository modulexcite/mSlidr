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
			'click #btn-close': 'close'
		}, 

		initialize: function() {
			BaseModalView.prototype.initialize.apply(this,arguments); 
			this._shareTemplate = JST['strut.collaboration/share'];
			this.rendered = false;
			this.modalView = null; 
		},

		render: function() {
			BaseModalView.prototype.render.apply(this,arguments);
		},
		toggle:function(){
			BaseModalView.prototype.render.call(this,{title:"Share"}); 
			this.renderView(this._shareTemplate , {
				link: window.location.href , 
				embededUrl:"<iframe src='" +  window.location.href + "'' width=600 height=400></iframe>"
			}); 
			this.$('#btn-save').hide();
			this.show();
		},
		close:function(){
			BaseModalView.prototype.teardown.apply(this, arguments);
		}, 

		constructor: function ShareView() {
			BaseModalView.prototype.constructor.apply(this, arguments);
		}
	});
});