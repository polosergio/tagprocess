var _ = require('underscore'),
	Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	SidebarTemplate = require('../../templates/sidebar.hbs'),
	ServerReportModal = require('./modals/serverReport');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		View: Backbone.View.extend({
			id: 'sidebar',
			template: SidebarTemplate,
			initialize: function (options) {
				this.collection = TagProcess.sidebar;
				this.modal = new ServerReportModal();
				if (options.active) {
					this.setActive(options.active);
				}
			},
			events: {
				'click #serverReport': 'openServerReportModal'
			},
			render: function () {
				var payload = {
					locations: this.collection.toJSON()
				}
				this.$el.empty().append(this.template(payload));
				return this;
			},
			setActive: function (href) {
				_.each(this.collection.models, function (model) {
					model.set('active', model.get('href') === href);
				});
				return this;
			},
			openServerReportModal: function (event) {
				event.preventDefault();
				this.$('#sidebarWrapper').append(this.modal.open().$el);
			},
		})
	});
	return exports;
}());
