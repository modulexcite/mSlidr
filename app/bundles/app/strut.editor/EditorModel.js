define(['libs/backbone',
	'lodash',
	'strut/header/model/HeaderModel',
	'strut/deck/Deck',
	'strut/slide_components/ComponentFactory',
	'common/Adapter',
	'tantaman/web/interactions/Clipboard',
	'./GlobalEvents',
	'tantaman/web/undo_support/CmdListFactory',
	'strut/sync/collaborate'],
	function(Backbone,_, Header, Deck, ComponentFactory, Adapter, Clipboard, GlobalEvents, CmdListFactory,live) {
		'use strict';

		function adaptStorageInterfaceForSavers(storageInterface) {
			return new Adapter(storageInterface, {
				store: 'savePresentation'
			});
		}
		
		return Backbone.Model.extend({
			initialize: function() {
				// is there a better way to do this?
				window.uiTestAcc = this;

				this._fontState = window.sessionMeta.fontState || {};
				this._deck = new Deck();
				this._deck.on('change:customBackgrounds', function(deck, bgs) {
					this.trigger('change:customBackgrounds', this, bgs)
				}, this);
				//REMOVED: we don't add empty slide anymore.
				//this.addSlide();

				this.set('header', new Header(this.registry, this));

				this.set('modeId', 'slide-editor');

				this.exportable = new Adapter(this, {
					export: 'exportPresentation',
					identifier: 'fileName'
				});

				this.exportable.adapted = this;

				var savers = this.registry.getBest('tantaman.web.saver.AutoSavers');
				if (savers) {
					var storageInterface = null;
					var storageInterface = this.registry.getBest('strut.StorageInterface');
					storageInterface = adaptStorageInterfaceForSavers(storageInterface);
					this._exitSaver = savers.exitSaver(this.exportable, storageInterface);
					this._timedSaver = savers.timedSaver(this.exportable, 20000, storageInterface);
				}

				this.clipboard = new Clipboard();
				this._createMode();

				this._cmdList = CmdListFactory.managedInstance('editor');

				GlobalEvents.on('undo', this._cmdList.undo, this._cmdList);
				GlobalEvents.on('redo', this._cmdList.redo, this._cmdList);

				live.subscribe('deck:init',this.loadDeck,this);
				live.subscribe('slide:create',this.insertSlide,this); 
				live.subscribe('slide:delete',this.removeSlide,this);
				live.subscribe('component:create',this.insertComponent,this); 
				live.subscribe('component:delete',this.deleteComponent,this); 
				live.subscribe('component:update',this.updateComponent,this); 
				Backbone.on('etch:state', this._fontStateChanged, this);
				//load deck from the server side. 
				live.loadDeck(); 
			},

			loadDeck : function(deck){
				var self = this; 
				_.each(deck.slides,function(slide){
					var components = slide.components; 
					if(!slide.components){
						slide.components = [];
					}
					self.insertSlide(slide);
				})
			}, 
			changeActiveMode: function(modeId) {
				if (modeId != this.get('modeId')) {
					this.set('modeId', modeId);
					this._createMode();
				}
			},

			customStylesheet: function(css) {
				if (css == null) {
					return this._deck.get('customStylesheet');
				} else {
					this._deck.set('customStylesheet', css);
				}
			},

			dispose: function() {
				throw "EditorModel can not be disposed yet"
				this._exitSaver.dispose();
				this._timedSaver.dispose();
				Backbone.off(null, null, this);
			},

			newPresentation: function() {
				var num = window.sessionMeta.num || 0;

				num += 1;
				window.sessionMeta.num = num;

				this.importPresentation({
	        		fileName: "presentation-" + num,
	        		slides: []
	      		});
				this._deck.create();
			},

			/**
			 * see Deck.addCustomBgClassFor
			*/
			addCustomBgClassFor: function(color) {
				var result = this._deck.addCustomBgClassFor(color);
				if (!result.existed) {
					this.trigger('change:customBackgrounds', this, this._deck.get('customBackgrounds'));
				}
				return result;
			},

			customBackgrounds: function() {
				return this._deck.get('customBackgrounds');
			},

			importPresentation: function(rawObj) {
				// deck disposes iteself on import?
				console.log('New file name: ' + rawObj.fileName);
				this._deck.import(rawObj);
			},

			exportPresentation: function(filename) {
				if (filename)
					this._deck.set('fileName', filename);
				var obj = this._deck.toJSON(false, true);
				return obj;
			},

			fileName: function() {
				var fname = this._deck.get('fileName');
				if (fname == null) {
					// TODO...
					fname = 'presentation-unnamed';
					this._deck.set('fileName', fname);
				}

				return fname;
			},

			deck: function() {
				return this._deck;
			},

			cannedTransition: function(c) {
				if (c != null)
					this._deck.set('cannedTransition', c);
				else
					return this._deck.get('cannedTransition');
			},

			slides: function() {
				return this._deck.get('slides');
			},

			addSlide: function(index) {
				debugger;
				this._deck.create(index);
			},

			insertSlide:function(slide){
				debugger;
				this._deck.insert(slide);
			},
			removeSlide:function(slide){
				this._deck.deleteSlide(slide); 
			}, 

			activeSlide: function() {
				return this._deck.get('activeSlide');
			},

			activeSlideIndex: function() {
				return this._deck.get('slides').indexOf(this._deck.get('activeSlide'));
			},

			insertComponent:function(component){
				
				var slideId = component.slideId; 
				var slide = this.slides().get(slideId); 
				//here we should create the componenet in slient. and add it to the slide. 
				if (slide) {
					var comp = ComponentFactory.instance.createModel(component.type, {
						fontStyles: component.fontStyles
					},
					component
					);
					slide.add(comp);
				}

			},
			deleteComponent:function(component){
				
				var slideId = component.get('slideId'); 
				var slide = this.slides().get(slideId); 
				slide.remove(component); 
			}, 

			updateComponent:function(component){
				
			}, 
			addComponent: function(type) {

				var slide = this._deck.get('activeSlide');
				
				if (slide) {
					var comp = ComponentFactory.instance.createModel(type, {
						slideId:slide.get('id'),
						fontStyles: this._fontState
					},
					{
						slideId:slide.get('id')
					});
					slide.add(comp);
				}
			},

			_fontStateChanged: function(state) {
				_.extend(this._fontState, state);
				window.sessionMeta.fontState = this._fontState;
			},

			_createMode: function() {
				var modeId = this.get('modeId');
				var modeService = this.registry.getBest({
					interfaces: 'strut.EditMode',
					meta: { id: modeId }
				});

				if (modeService) {
					var prevMode = this.get('activeMode');
					if (prevMode)
						prevMode.close();
					this.set('activeMode', modeService.getMode(this, this.registry));
				}
			},

			constructor: function EditorModel(registry) {
				this.registry = registry;
				Backbone.Model.prototype.constructor.call(this);
			}
		});
	});
