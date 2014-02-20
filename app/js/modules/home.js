var Backbone = require('backbone'),
	HomeTemplate = require('../../templates/home.hbs');

'use strict';
module.exports = {
    View: Backbone.View.extend({
        initialize: function () {
            this.template = HomeTemplate();
        },
        render: function () {
            this.$el.empty().append(this.template);

            return this;
        }
    })
};
