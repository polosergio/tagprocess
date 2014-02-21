var Backbone = require('backbone'),
    ContactUsTemplate = require('../../templates/contactus.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = ContactUsTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
