var _ = require('underscore'),
	Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	SidebarTemplate = require('../../templates/sidebar.hbs');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		View: Backbone.View.extend({
			template: SidebarTemplate,
			initialize: function (options) {
				this.collection = TagProcess.sidebar;
				if (options.active) {
					this.setActive(options.active);
				}
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
			}
		})
	});
	return exports;
}());
