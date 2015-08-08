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

    width_: 300,
    height_: 300,
    cellSize: 5,

    doTick: true,

    totalCells: null,
    cellMax: null,

    initialize: function(){
        this.totalCells = Math.pow(this.width_ / this.cellSize, 2);
        this.cellMax = this.width_ / this.cellSize;
        this.cellCollection = new CellCollection(
            [ [2,2], [10,5],[2,15] ]
        );
        this.cellCollection.max =  this.totalCells;
        this.gridView = new GridView({
            collection: this.cellCollection,
            size: { width: this.width_, height: this.height_ },
            cell: this.cellSize
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

    start: function(){
        this.doTick = true;
        this.tick();
    },

    pause: function(){
        this.doTick = false;
    },

    tick: function(){
        this.cellCollection.evolve();
        this.gridView.drawCells();
        if (this.doTick){
            var self = this;
            setTimeout(function(){self.tick()}, 0);
        }
    }
  });
  return PrimaryView;
});
