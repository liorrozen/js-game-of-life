define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/grid/grid.html'
], function($, _, Backbone, template){
    var GridView = Backbone.View.extend({
        className: 'gridView',
        grid: {
            canvas: null,
            context: null,
            size: null
        },
        cell: {
            canvas: null,
            context: null,
            size: null
        },

        initialize: function( options ){
            this.grid.size = options.size;
            this.cell.size = options.cell;

            this.grid.canvas = $('<canvas class="can" id="gridCanvas" />').attr({
                width: this.grid.size.width + 1,
                height: this.grid.size.height + 1
            });
            this.grid.context = this.grid.canvas.get(0).getContext('2d');

            this.cell.canvas = $('<canvas class="can" id="cellCanvas" />').attr({
                width: this.grid.size.width + 1,
                height: this.grid.size.height + 1
            });
            this.cell.context = this.cell.canvas.get(0).getContext('2d');

            this.cell.canvas.on('mousewheel', this.on_mouse_wheel);
        },
        drawCells: function(){

            this.clearCells();
            var self = this;
            $.each( this.collection.models, function( index, cell ){
                self.drawCell(cell);
            });
        },
        drawCell: function(cell) {
            var row = cell.get('x');
            var col = cell.get('y');
            var x = (col * this.cell.size);
            var y = (row * this.cell.size);
            var ageColor = cell.getAge();
            this.cell.context.fillStyle = ageColor;
            this.cell.context.fillRect(x+1,y+1,this.cell.size,this.cell.size);
        },

        drawGrid: function(){
            var max_x = this.grid.size.width;
            var max_y = this.grid.size.height;
            for (var x = 0.5; x < max_x + 1; x += this.cell.size) {
                this.grid.context.moveTo(x, 0);
                this.grid.context.lineTo(x, max_y);
            }

            for (var y = 0.5; y < max_y + 1; y += this.cell.size) {
                this.grid.context.moveTo(0, y);
                this.grid.context.lineTo(max_x, y);
            }

            this.grid.context.strokeStyle = '#36334D';
            this.grid.context.stroke();
        },

        clearCells: function(){
            var totalWidth = (this.grid.size.width*this.cell.size)+1;
            var totalHeight = (this.grid.size.height*this.cell.size)+1;
            this.cell.context.clearRect(
                0, 0, totalWidth, totalHeight
            );
        },

        on_mouse_wheel: function(e){
            if(e.originalEvent.wheelDelta /120 > 0) {
                $(".gridView").css('transform', 'scale(1)');
            }
            else{
                $(".gridView").css('transform', 'scale(1)');
            }
        },
        render: function(){
            this.$el.append( this.grid.canvas );
            this.$el.append( this.cell.canvas );
            this.drawGrid();
            this.drawCells();
        }
    });
    return GridView;
});
