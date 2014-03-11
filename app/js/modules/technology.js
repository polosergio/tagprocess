var Backbone = require('backbone'),
    TechnologyTemplate = require('../../templates/technology.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = TechnologyTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
