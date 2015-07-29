define([
    'jquery',
    'underscore',
    'backbone',
    'models/grid/cell'
], function($, _, Backbone, CellModel){
    var CellCollection = Backbone.Collection.extend({
        model: function( attributes ){
            return new CellModel( attributes );
        }
    });

    return CellCollection;
});
