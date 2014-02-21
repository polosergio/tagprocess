var Backbone = require('backbone'),
    AboutUsTemplate = require('../../templates/aboutus.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = AboutUsTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
