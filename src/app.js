define([
  'jquery',
  'underscore',
  'backbone',
  'views/primary/primary',
  'router',
], function($, _, Backbone, PrimaryView, Router){
  var initialize = function(){
    Router.initialize();


    var primaryView = new PrimaryView();
    primaryView.render();

  };

  return {
    initialize: initialize
  };
});
