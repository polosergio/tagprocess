var Backbone = require('backbone'),
    ClientTemplate = require('../../templates/client.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = ClientTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
