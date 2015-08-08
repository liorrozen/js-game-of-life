define([
    'jquery',
    'underscore',
    'backbone',
    'models/grid/cell'
], function($, _, Backbone, CellModel){
    var CellCollection = Backbone.Collection.extend({
        max: null,
        tempLiveCells: null,
        tempDeadCells: null,
        model: function( attributes ){
            return new CellModel( {
                x: attributes[0],
                y: attributes[1],
                live: attributes[2] || true
            });
        },

        repopulate: function(cells){
            var newCells = [];
            var cellIds = [];
            _.each(cells, function(cell){
                var existingCell = this.get(cell[0]+'_'+cell[1]);
                if (existingCell !== undefined){
                    existingCell.older();
                }else{
                    newCells.push(this.model(cell));
                }
                cellIds.push(cell[0]+'_'+cell[1]);
            }, this);

            var cellsToRemove = _.filter(this.models, function(cell){
                var no_longer_exists = (cellIds.indexOf(cell.id) == -1);
                return no_longer_exists;
            });

            this.remove(cellsToRemove);
            this.add(newCells);
        },

        addTempLive: function(x, y){
            if (this.tempLiveCells[x+'_'+y] === undefined){
                this.tempLiveCells[x+'_'+y] = [x, y, true];
            }
        },

        addTempDead: function(x, y){
            if (this.tempDeadCells[x+'_'+y] === undefined){
                this.tempDeadCells[x+'_'+y] = [x, y, false];
            }
        },

        evolve: function(){
            this.tempLiveCells = {};
            this.tempDeadCells = {};

            var workingCells = this.where({'live':true});
            workingCells.forEach( function(cell){
                var x = cell.get('x');
                var y = cell.get('y');

                var isLive = true;
                liveNeighboursCount = this.getNeighbours(
                    cell.get('live'), x, y
                );
                if (liveNeighboursCount < 2){
                    // Live cell with fewer than two live neighbours dies, as if caused by under-population.
                    isLive = false;
                } else {
                    if (liveNeighboursCount == 2 || liveNeighboursCount == 3){
                        // Live cell with two or three live neighbours lives on to the next generation.
                        this.addTempLive(x, y);
                    }else{
                        // Live cell with more than three live neighbours dies, as if by overcrowding.
                        isLive = false;
                    }
                }
            }, this);


            // go over all relevant dead cells
            _.each(this.tempDeadCells, function(cell){
                var x = cell[0];
                var y = cell[1];
                liveCellNeighbours = this.getNeighbours(
                    false, x, y
                );
                if (liveCellNeighbours == 3) {
                    // Dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
                    this.addTempLive(x, y);
                }
            }, this);

            var nextGen = _.map(this.tempLiveCells, function(cell) {
                return cell;
            });
            this.repopulate( nextGen );

        },
        getNeighbours: function(isLive, x, y){
            var cells = 0;

            // upper 3
            // +---+---+---+
            // | X | X | X |
            // | 0 | ■ | 0 |
            // | 0 | 0 | 0 |
            // +---+---+---+
            cells += this.isLivingNeigbour(isLive,x - 1, y - 1)? 1 : 0;
            cells += this.isLivingNeigbour(isLive,x - 1, y)? 1 : 0;
            cells += this.isLivingNeigbour(isLive,x - 1, y + 1)? 1 : 0;

            // sides
            // +---+---+---+
            // | 0 | 0 | 0 |
            // | X | ■ | X |
            // | 0 | 0 | 0 |
            // +---+---+---+
            cells += this.isLivingNeigbour(isLive,x, y - 1)? 1 : 0;
            cells += this.isLivingNeigbour(isLive,x, y + 1)? 1 : 0;

            // lower 3
            // +---+---+---+
            // | 0 | 0 | 0 |
            // | 0 | ■ | 0 |
            // | X | X | X |
            // +---+---+---+
            cells += this.isLivingNeigbour(isLive,x + 1, y - 1)? 1 : 0;
            cells += this.isLivingNeigbour(isLive,x + 1, y)? 1 : 0;
            cells += this.isLivingNeigbour(isLive,x + 1, y + 1)? 1 : 0;
            return cells;

        },
        isLivingNeigbour: function(isLive, x, y){
            if (x>=0 && y>=0 && x<this.max && y<this.max){
                cell = this.get(x+'_'+y);
                if (cell !== undefined && cell.get('live')){
                    return true;
                }else{
                    // If a living cell's neighbour is not live
                    // add it to the list of relevant dead cells
                    // for this generation.
                    if (isLive){
                        this.addTempDead(x, y);
                    }
                }

            }
            return false;

        }


    });

    return CellCollection;
});
