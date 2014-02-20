var Backbone = require('backbone');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = 'RANDOM TEMPLATE';
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		}
	})
};
