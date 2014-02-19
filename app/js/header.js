var $ = require('jquery'),
	Backbone = require('backbone'),
	HeaderTemplate = require('../templates/headerTemplate.hbs'),
	NavBar = require('./navbar');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.navbar = new NavBar.View();
			this.template = HeaderTemplate({data: 'header test in here'});
			this.render();
		},
		render: function () {
			var template = this.template;
			this.$el.empty().append(template);
			this.$('.navbar').append(this.navbar.$el);
		}
	})
};
