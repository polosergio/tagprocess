var Backbone = require('backbone'),
	LoginTemplate = require('../../templates/login.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = LoginTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
