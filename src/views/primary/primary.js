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
        // var seed = [[4,40],[4,39],[5,39],[5,40],[3,29],[2,29],[7,29],[8,29],[7,27],[3,27],[4,26],[5,26],[6,26],[6,25],[5,25],[4,25],[7,22],[6,21],[7,21],[8,21],[5,20],[9,20],[7,19],[4,18],[4,17],[5,16],[6,15],[7,15],[8,15],[9,16],[10,17],[10,18],[6,6],[7,6],[7,5],[6,5]];
        // this.cellCollection.reset(seed);

        // var seed = [[2,6],[3,6],[4,6],[4,5],[4,7],[8,6], [7,6],[9,6], [7,7], [7,5], [11,6],[10,6], [12,5], [12,6],[12,7], [15,6], [15,5],[15,7], [16,6], [17,6] ];
        // this.cellCollection.reset(seed);

        var randCells = [];
        var totalRandCells = Math.floor( this.totalCells * 0.2 );
        for (var i = 0; i<=totalRandCells; i++){
            var randRow =   Math.floor(Math.random() * (this.cellMax-1));
            var randCol = Math.floor(Math.random() * (this.cellMax-1));
            randCells.push([randRow,randCol]);
        }
        this.cellCollection.reset(randCells);

        // var tmpl = [];
        // for (var i = 0; i<=this.cellMax; i++){
        //     tmpl.push([Math.floor(this.cellMax/2),i]);
        // }
        // this.cellCollection.reset(tmpl);


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
