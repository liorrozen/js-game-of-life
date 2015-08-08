define([
  'jquery',
  'underscore',
  'backbone',
  'models/grid/cells',
  'views/grid/grid'
], function($, _, Backbone, CellCollection, GridView){
  var PrimaryView = Backbone.View.extend({
    el: '#container',

    cellCollection: null,
    gridView: null,

    initialize: function(){
        var width_ = 300;
        var height_ = 300;
        var cellSize = 10;
        this.cellCollection = new CellCollection(
            [ [2,2], [10,5],[2,15] ]
        );
        this.cellCollection.max =  width_ / cellSize;
        this.gridView = new GridView({
            collection: this.cellCollection,
            size: { width: width_, height: height_ },
            cell: cellSize
        });
    },
    set_seed: function(){
        var seed = [[2,6],[3,6],[4,6],[4,5],[4,7],[8,6], [7,6],[9,6], [7,7], [7,5], [11,6],[10,6], [12,5], [12,6],[12,7], [15,6], [15,5],[15,7], [16,6], [17,6] ];
        this.cellCollection.reset(seed);
        this.gridView.drawCells();
    },
    render: function(){
        this.gridView.render();
        this.$el.append( this.gridView.el );
        this.$el.css( 'width', this.gridView.grid.size.width );
    },

    tick: function(){
        this.cellCollection.evolve();
        this.gridView.drawCells();
        return false;

    }
  });
  return PrimaryView;
});
