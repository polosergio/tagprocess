var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/returnOfService.hbs'),
	Backbone = require('backbone'),
	Helpers = require('../../utilities/helpers');


module.exports = (function () {
	'use strict';
	var Comments = Backbone.Model.extend({
			baseUrl: '/tagproc/api/serve_details',
			url: function () {
				return this.baseUrl + '?' + $.param({jobnumber: this.id});
			}
		}),
		exports = Backbone.View.extend({
			template: Template,
			initialize: function (options) {
				this.id = options.id;
				this.comments = new Comments({id: this.id});
				this.modal = new Modal({size: ''});
				this.listenTo(this.comments, 'sync', this.render);
				this.comments.fetch();
			},
			render: function () {
				var data = this.comments.toJSON();
				this.modal.render()
					.setHeaderHTML('<h4>Return Of Service Options</h4>')
					.setContentHTML(this.template(data));
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
                Helpers.initSelectizeInputs(this);
				return this;
			}
		});
	return exports;
}());
