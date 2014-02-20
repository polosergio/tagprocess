var $ = require('jquery'),
	Backbone = require('backbone'),
	FooterTemplate = require('../../templates/footer.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = FooterTemplate();
		},
		render: function () {
			this.$el.empty().append(this.template);

            return this;
		}
	})
};