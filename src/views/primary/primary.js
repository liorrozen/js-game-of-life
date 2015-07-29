define([
  'jquery',
  'underscore',
  'backbone',
  'models/grid/cells',
  'views/grid/grid'
], function($, _, Backbone, CellCollection, GridView){
  var PrimaryView = Backbone.View.extend({
    el: '#container',
    render: function(){
        var cellCollection = new CellCollection([
            { x: 10, y: 5 },
            { x: 2, y: 15 },
        ]);
        var grid = new GridView({
            collection: cellCollection,
            size: { width: 300, height: 300 },
            cell: 10
        });
        grid.render();
        this.$el.append( grid.el );
        this.$el.css( 'width', grid.grid.size.width );
    }
  });
  return PrimaryView;
});
