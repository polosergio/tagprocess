var $ = require('jquery'),
	Backbone = require('backbone'),
	HeaderTemplate = require('../templates/headerTemplate.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = HeaderTemplate();
			this.render();
		},
		render: function () {
			var template = this.template;
			this.$el.empty().append(template);
		}
	})
};
