define(['strut/deck/Component',
	'strut/sync/collaborate',
	'common/FileUtils'],
	function(Component,live, FileUtils) {
		'use strict';

		/**
		 * @class Image
		 * @augments Component
		 */
		return Component.extend({
			initialize: function() {
				Component.prototype.initialize.apply(this, arguments);
				this.set('type', 'Image');

				var src = this.get('src');
				this.set('imageType', FileUtils.imageType(src));
			},

			_updateCache: function() {
			},

			toBase64: function() {

			},

			constructor: function ImageModel(attrs) {
				Component.prototype.constructor.call(this, attrs);
				live.addObject(this,arguments); 
			}
		});
	});