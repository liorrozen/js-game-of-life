define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var ControlView = Backbone.View.extend({
    el: '#control',

    events: {
        'click #set_seed': 'set_seed',
        'click .tick': 'tick',
    },

    set_seed: function(){
        this.trigger('foo');
    },
    tick: function(){
        this.trigger('tick');
        return false;
    }

  });
  return ControlView;
});
