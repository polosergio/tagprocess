var _ = require('underscore'),
	Backbone = require('backbone'),
    ClientTemplate = require('../../templates/client.hbs');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		Collection: Backbone.Collection.extend({
			url: '/tagproc/api/jobs',
			parse: function (response) {
				return response;
			}
		}),
		View: Backbone.View.extend({
			initialize: function () {
				this.template = ClientTemplate;
				this.collection = new exports.Collection();
				this.listenTo(this.collection, 'sync', this.render);
				this.collection.fetch();
			},
			render: function () {
				var data = this.collection.toJSON(),
					payload = {
					items: _.isEmpty(data) ? null : data
				};
				console.log(payload);
				this.$el.empty().append(this.template(payload));
				return this;
			}
		})
	});
	return exports;
}());
