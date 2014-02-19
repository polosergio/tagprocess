var $ = require('jquery'),
	Backbone = require('backbone');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.render();
		},
		render: function () {
			this.$el.empty().append('TESTING NAVBAR VIEW');
		}
	})
};
