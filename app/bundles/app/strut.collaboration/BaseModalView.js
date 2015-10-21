define(['lodash', 'libs/backbone', ], function(_, Backbone) {
  var BaseModalView = Backbone.View.extend({
        
        id: 'base-modal',
        className: 'modal fade hide',
        template: 'modals/BaseModal',
        
        events: {
          'hidden': 'teardown'
        },
        
        initialize: function() {
          this._template = JST['strut.collaboration/modal'];
          _(this).bindAll();
          this.render();
        },

        show: function() {
          this.$el.modal('show');
        },

        teardown: function() {
          //this.$el.modal({show:false})
          //this.$el.data('modal', null);
           this.$el.modal('hide');
        },

        render: function() {
          this.$el.html(this._template(arguments.length>0?arguments[0]:{title:""}));
          return this;
        },
        
        renderView: function(template,data) {
          this.$('.modal-body').html(template(data));
          this.$el.modal({show:false}); // dont show modal on instantiation
        }
     });
     
  return BaseModalView;
});