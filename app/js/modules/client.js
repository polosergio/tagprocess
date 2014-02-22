var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
    ClientTemplate = require('../../templates/client.hbs');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		Collection: Backbone.Collection.extend({
			params: {
				count: 10,
				offset: 0
			},
			baseUrl: '/tagproc/api/jobs',
			url: function () {
				return this.baseUrl + '?' + $.param(this.params);
			},
			parse: function (response) {
				return response;
			}
		}),
		View: Backbone.View.extend({
			initialize: function () {
				this.template = ClientTemplate;
				this.collection = new exports.Collection();
				delete this.collection.params.q;
				delete this.collection.params.searchby;
				this.listenTo(this.collection, 'sync', this.render);
				this.collection.fetch();
			},
			events: {
				'click #searchby a': 'setSearchBy',
				'keyup #search': 'search'
			},
			render: function () {
				var data = this.collection.toJSON(),
					payload = {
					items: _.isEmpty(data) ? null : data,
					form: this.collection.params
				};
				this.$el.empty().append(this.template(payload));
				return this;
			},
			setSearchBy: function (event) {
				event.preventDefault();
				var $target = $(event.currentTarget),
					$button = $target.parents('ul').siblings();
				$button.html($target.html());
				this.collection.params.searchby = $target.data('value');
			},
			search: _.debounce(function (event) {
				this.collection.params.q = this.$('#search').val();
				this.collection.params.searchby = this.collection.params.searchby ? this.collection.params.searchby : 'jobnumber';
				this.collection.fetch();
			}, 1000)
		})
	});
	return exports;
}());
