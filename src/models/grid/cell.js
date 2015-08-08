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
        ages: [
            '#FFF',
            '#E7DAC9',
            '#DCBE98',
            '#D2A165',
            '#C98735',
            '#AD6A18',
            '#9B5D0F',
            '#774609',
            '#583100',
            '#000000'
        ],
        age: 0,
        initialize: function( attributes ){
            for ( var prop in attributes ){
                this.set( prop, attributes[ prop ] );
            }
            this.id = this.get('x') + '_' + this.get('y');
        },

        older: function(){
            this.age += 1;
        },

        getAge: function(){
            var current_age = Math.floor(this.age/10);
            var age_len = this.ages.length - 1;
            var capped_age = current_age >= age_len? age_len : current_age;
            return this.ages[capped_age];
        }
    });
    return CellModel;
});
