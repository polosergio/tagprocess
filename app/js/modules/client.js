var _ = require('underscore'),
	$ = require('jquery'),
	TagProcess = require('../tagprocess'),
	Backbone = require('backbone'),
	Sidebar = require('./sidebar'),
    ClientTemplate = require('../../templates/client.hbs');

module.exports = (function () {
	'use strict';
	var exports = {},
		helpers = {
			parseFormParams: function (params) {
				var options = {
					'account': 'Client',
					'casenumber': 'Case',
					'jobnumber': 'Job Number'
				}, result = _.clone(params);
				result.searchby = options[params.searchby];
				return result;
			}
		};
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
			parse: function (response, xhr) {
                this.status = xhr.xhr.status;
				return response;
			}
		}),
		View: Backbone.View.extend({
			initialize: function () {
                var that = this;
				this.template = ClientTemplate;
				this.collection = new exports.Collection();
				this.sidebar = new Sidebar.View({active: '#client'});
				delete this.collection.params.q;
				delete this.collection.params.searchby;
				this.listenTo(this.collection, 'sync', this.render);
				this.collection.fetch();
			},
			events: {
				'click #searchby a'				: 'setSearchBy',
				'keyup #search'					: 'debouncedSearch',
                'submit form'					: 'search',
				'click .switch-page'			: 'switchPage'
			},
			render: function () {
				var data = this.collection.toJSON(),
					payload = {
					items: _.isEmpty(data) ? null : data,
					form: helpers.parseFormParams(this.collection.params),
					locations: TagProcess.sidebar,
                    no_access: _.isUndefined(this.collection.status) || this.collection.status === 401
				};
				this.$el.empty().append(this.template(payload));
				this.$('.sidebar').html(this.sidebar.render().$el);
				this.$('.switch-page').tooltip();
				return this;
			},
			setSearchBy: function (event) {
				event.preventDefault();
				var $target = $(event.currentTarget),
					$button = $target.parents('ul').siblings();
				$button.find('#search-by-text').html($target.html());
				this.collection.params.searchby = $target.data('value');
			},
            debouncedSearch: _.debounce(function (event) {
                this.search(event);
            }, 1000),
			search: function (event) {
                event.preventDefault();
				this.collection.params.offset = 0;
				this.collection.params.q = this.$('#search').val();
				this.collection.params.searchby = this.collection.params.searchby ? this.collection.params.searchby : 'jobnumber';
				this.collection.fetch();
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
