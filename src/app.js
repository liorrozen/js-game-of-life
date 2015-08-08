define([
  'jquery',
  'underscore',
  'backbone',
  'views/primary/primary',
  'views/primary/control',
  'router',
], function($, _, Backbone, PrimaryView, ControlView, Router){
  var initialize = function(){
    Router.initialize();

    var controlView = new ControlView();
    var primaryView = new PrimaryView();
    primaryView.render();

    controlView.on('foo', primaryView.set_seed, primaryView);
    controlView.on('start', primaryView.start, primaryView);
    controlView.on('pause', primaryView.pause, primaryView);

  };

  return {
    initialize: initialize
  };
});
