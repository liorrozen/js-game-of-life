define([
  'jquery',
  'underscore',
  'backbone'
], function($, _, Backbone){
  var ControlView = Backbone.View.extend({
    el: '#control',

    events: {
        'click #set_seed': 'set_seed',
        'click .start': 'start',
        'click .pause': 'pause'
    },

    set_seed: function(){
        this.trigger('foo');
        return false;
    },
    start: function(){
        this.trigger('start');
        return false;
    },
    pause: function(){
        this.trigger('pause');
        return false;
    }

  });
  return ControlView;
});
