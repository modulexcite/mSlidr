define(['libs/backbone',
	'css!styles/messanger/messanger.css'],
function(Backbone) {
	return Backbone.View.extend({
		className: 'messanger',

		initialize: function() {
			this._template = JST['strut.messaging/messanger'];
		},


		// TODO: need to respond to addition/removal of
		// create component buttons
		render: function() {
			this.$el.html(this._template());
			return this;
		},

		constructor: function MessangerView() {
			Backbone.View.prototype.constructor.apply(this, arguments);
		}
	});
});