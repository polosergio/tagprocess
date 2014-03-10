var Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
    SettingsTemplate = require('../../templates/settings.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = SettingsTemplate;
		},
		render: function () {
			var payload = {
				admin: TagProcess.Auth.user.hasPermission('admin')
			};
			this.$el.empty().append(this.template(payload));
			return this;
		}
	})
};
