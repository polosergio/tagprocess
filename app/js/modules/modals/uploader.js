var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/comment.hbs'),
	Backbone = require('backbone');


module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
			template: Template,
			initialize: function () {
				this.modal = new Modal();
			},
			events: {
				'submit form': 'submit',
			},
			render: function () {
				this.modal.render()
					.setHeaderHTML('<h4>Add Comments</h4>')
					.setContentHTML(this.template());
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				console.log('SUBMIT COMMENT EVENT', event);
			}
	});
	return exports;
}());
