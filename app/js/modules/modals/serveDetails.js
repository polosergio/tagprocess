var Modal = require('./modal'),
	ListTemplate = require('../../../templates/modals/serveList.hbs'),
	DetailsTemplate = require('../../../templates/modals/serveDetails.hbs'),
	_ = require('underscore'),
	Backbone = require('backbone');

module.exports = (function () {
	'use strict';
	var Model = Backbone.Model.extend({
			baseUrl: '/tagproc/api/serve_details',
			url: function () {
				return this.baseUrl + '?' + $.param(this.toJSON());
			}
		}),
		exports = Backbone.View.extend({
			template: ListTemplate,
			detailsTemplate: DetailsTemplate,
			initialize: function () {
				this.modal = new Modal();
				this.model = new Model({jobnumber: this.id});
				this.listenTo(this.model, 'sync', this.render);
				this.model.fetch();
			},
			events: {
				'click .openDetails': 'openDetails',
				'click .openList'	: 'openList'
			},
			render: function () {
				var data = this.model.toJSON();
				this.modal.render()
					.setHeaderHTML('<h4>Details</h4>')
					.setContentHTML(this.template(data));
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
				return this;
			},
			openDetails: function (event) {
				event.preventDefault();
				var id = $(event.currentTarget).data('id'),
					data = id ? _.findWhere(this.model.get('comments'), {id: id.toString()}) : this.model.get('serve');
				this.modal.setContentHTML(this.detailsTemplate(data));
				return this.delegateEvents();
			},
			openList: function (event) {
				event.preventDefault();
				var data = this.model.toJSON();
				this.modal.setContentHTML(this.template(data));
				return this.delegateEvents();
			}
	});
	return exports;
}());
