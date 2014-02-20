var $ = require('jquery'),
    Backbone = require('backbone'),
    ButtonTemplate = require('../../templates/navbutton.hbs');

module.exports = (function () {
    'use strict';
    return {
        Model: Backbone.Model.extend({
            defaults: {
                active: false
            }
        }),
        View: Backbone.View.extend({
            tagName: "li",
            className: "",
            template: ButtonTemplate,
            initialize: function () {
                this.listenTo(this.model, 'change:active', this.setActive);
            },
            render: function () {
                this.$el.html(this.template(this.model.toJSON())).toggleClass('active', this.model.get('active'));
                return this;
            },
            setActive: function () {
                console.log('test');
                $(this.el).toggleClass('active', this.model.get('active'));
            }
        })
    }
}());
