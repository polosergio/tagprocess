var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	Sidebar = require('./sidebar'),
	Helpers = require('../utilities/helpers'),
    StatementsTemplate = require('../../templates/statements.hbs');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		Collection: Backbone.Collection.extend({
			params: {
				count: 10,
				offset: 0
			},
			baseUrl: '/tagproc/api/clients',
			url: function () {
				return this.baseUrl + '?' + $.param(this.params);
			}
		}),
		View: Backbone.View.extend({
			template: StatementsTemplate,
			initialize: function () {
                var that = this;
				this.collection = new exports.Collection();
				this.sidebar = new Sidebar.View({active: '#statements'});
				delete this.collection.params.q;
				delete this.collection.params.searchby;
				this.listenTo(this.collection, 'sync', this.render);
				this.collection.fetch();
			},
			events: {
				'click .switch-page'			: 'switchPage',
				'change select[name=time]'		: 'showCustomDate'
			},
			render: function () {
				var data = this.collection.toJSON(),
					payload = {clients: data};
				this.$el.empty().append(this.template(payload));
				this.$('.sidebar').html(this.sidebar.render().$el);
				this.$('.switch-page').tooltip();
                Helpers.initSelectizeInputs(this);
				return this;
			},
			setSearchBy: function (event) {
				event.preventDefault();
				var $target = $(event.currentTarget),
					$button = $target.parents('ul').siblings();
				$button.find('#search-by-text').html($target.html());
				this.collection.params.searchby = $target.data('value');
			},
			showCustomDate: function (event) {
				var $target = $(event.currentTarget),
					 value = $target.val();
				if (value === 'custom') {
					$target.parent('.form-group').siblings('.form-group').removeClass('hide');
				} else {
					$target.parent('.form-group').siblings('.form-group').addClass('hide');
				}
				return this;
			},
			switchPage: function (event) {
				event.preventDefault();
				var offset = parseInt($(event.currentTarget).data('offset'), 10);
				this.collection.params.offset = this.collection.params.offset + offset >= 0 ? this.collection.params.offset + offset : 0;
				this.collection.fetch();
			}
		})
	});
	return exports;
}());
