var Modal = require('./modal'),
	_ = require('underscore'),
	TagProcess = require('../../tagprocess'),
    SettingsTemplate = require('../../../templates/modals/settings.hbs'),
	Backbone = require('backbone');

module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
			template: SettingsTemplate,
			initialize: function () {
				this.modal = new Modal({size: ''});
			},
			events: {
				'click #disableLogin': 'disableLogin'
			},
			render: function () {
				var payload = {
					user: TagProcess.Auth.user.toJSON(),
					admin: TagProcess.Auth.user.hasPermission('admin')
				};
				this.modal.render()
					.setHeaderHTML('<h4>User Settings</h4>')
					.setContentHTML(this.template(payload));
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
				return this;
			},
			disableLogin: function () {
				var $message = this.$('#message');
				$.ajax({
					url: '/tagproc/api/disable/',
					type: 'POST',
					success: function (response) {
						$message.empty().removeClass('hide').append(response.message);
					}
				});
				return this;
			}
		});
	return exports;
}());

