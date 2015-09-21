define([
'strut/sync/sync', // include backbone sync lib.
		'strut/editor/EditorView',
        'strut/editor/EditorModel',
         
        'strut/sync/collaborate',
        ''
        ],
function(backboneSync,EditorView, EditorModel,live) {
	var registry = null;
	var editorStartup = {
		run: function() {
			var model = new EditorModel(registry);
    		var editor = new EditorView({model: model, registry: registry});
    		editor.render();
    		$('body').append(editor.$el);

    		/*
    		//REMOVED: we don't load presentation from session anymore.
			we don't load presentation from session anymore. instead we will load it from the server side. 
    		if (sessionMeta.lastPresentation != null) {
    			// Load it up.
    			var storageInterface = registry.getBest('strut.StorageInterface');
    			if(storageInterface){
	    			storageInterface.load(sessionMeta.lastPresentation, function(pres, err) {
	    				if (!err) {
	    					model.importPresentation(pres);
	    				} else {
	    					console.log(err);
	    					console.log(err.stack);
	    				}
	    			});		
	    			}
    		
    		}*/
		}
	};

	var welcome = {
		run: function() {
			// If no previous presentation was detected, show the welcome screen.
		}
	};

	return {
		initialize: function(reg) {
			var sliderNumber = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
			new live.connect(sliderNumber);
			registry = reg;
			
			registry.register({
				interfaces: 'strut.StartupTask'
			}, editorStartup);

			registry.register({
				interfaces: 'strut.StartupTask'
			}, welcome);
		}
	};
});