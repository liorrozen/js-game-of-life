define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone){
    var CellModel = Backbone.Model.extend({
        id: null,
        x: null,
        y: null,
        live: false,
        initialize: function( attributes ){
            for ( var prop in attributes ){
                this.set( prop, attributes[ prop ] );
            }
            this.id = this.get('x') + '_' + this.get('y');
        }
    });
    return CellModel;
});
