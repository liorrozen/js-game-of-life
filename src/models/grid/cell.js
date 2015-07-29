define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var CellModel = Backbone.Model.extend({
        live: false,

        initialize: function( attributes ){
            for ( var prop in attributes ){
                this.set( prop, attributes[ prop ] );
            }
        }
    });
    return CellModel;
});
