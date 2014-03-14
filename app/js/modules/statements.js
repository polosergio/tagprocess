var _ = require('underscore'),
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
				'change select[name=time]'		: 'showCustomDate'
			},
			render: function () {
				var data = this.collection.toJSON(),
					payload = {clients: data};
				this.$el.empty().append(this.template(payload));
				this.$('.sidebar').html(this.sidebar.render().delegateEvents().$el);
                Helpers.initSelectizeInputs(this);
				return this;
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
			}
		})
	});
	return exports;
}());
