var Backbone = require('backbone');
'use strict';

module.exports = {
    View: Backbone.View.extend({
        initialize: function () {
            this.template = 'HOME PAGE CONTENT';
        },
        render: function () {
            this.$el.empty().append(this.template);

            return this;
        }
    })
};
