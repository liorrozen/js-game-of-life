define([
  'jquery',
  'underscore',
  'backbone',
  'views/primary/primary'
], function($, _, Backbone, AppView){
  var AppRouter = Backbone.Router.extend({
    routes: {
      '/users': 'showUsers',

      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){
    var app_router = new AppRouter();

    app_router.on('showUsers', function(){
      var userListView = new UserListView();
      userListView.render();
    });

    app_router.on('defaultAction', function(actions){
      console.log('No route:', actions);
    });

    Backbone.history.start();
  };
  return {
    initialize: initialize
  };
});
