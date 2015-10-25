define(['strut/deck/Component','strut/sync/collaborate'],
function(Component,live) {
	'use strict';

	return Component.extend({
		initialize: function() {
			Component.prototype.initialize.apply(this, arguments);
			this.set('type', 'Shape');
		},

		constructor: function Shape(attrs) {
			Component.prototype.constructor.call(this, attrs);
			live.addObject(this,arguments); 
		}
	});
});