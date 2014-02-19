var $ = require('jquery'),
	Backbone = require('backbone'),
	TagProcess = require('./tagprocess'),
	NavBarTemplate = require('../templates/navbar.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = NavBarTemplate({locations: TagProcess.locations});
			this.render();
		},
		render: function () {
			this.$el.empty().append(this.template);
		}
	})
};
