var Backbone = require('backbone'),
    ServicesTemplate = require('../../templates/services.hbs');

module.exports = {
    View: Backbone.View.extend({
        initialize: function () {
            this.template = ServicesTemplate();
        },
        render: function () {
            this.$el.empty().append(this.template);

            return this;
        }
    })
};