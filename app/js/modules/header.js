var $ = require('jquery'),
	Backbone = require('backbone'),
	HeaderTemplate = require('../../templates/header.hbs');

module.exports = {
	View: Backbone.View.extend({
        tagName: 'header',
        id: 'header',
        className: 'page-header container',
		initialize: function () {
			this.template = HeaderTemplate();
		},
		render: function () {
			var template = this.template;
			this.$el.empty().append(template);

            return this;
		}
	})
};
