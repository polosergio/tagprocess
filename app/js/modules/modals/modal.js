var _ = require('underscore'),
	Backbone = require('backbone'),
	ModalTemplate = require('../../../templates/modals/modal.hbs');

module.exports = (function () {
	'use strict';
	var validOptions = ['backdrop', 'keyboard', 'show', 'remote'];
	var exports =  Backbone.View.extend({
		backdrop: true,
		keyboard: true,
		show: true,
		remote: false,
		footerHTML: '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>',
		template:  ModalTemplate,
		tagName: 'div',
		className: 'modal fade',
		attributes: {
			'tabindex': '-1',
			'role': 'dialog',
			'aria-hidden': true,
			'aria-labelledby': 'ServeDetails'
		},
		initialize: function (options) {
			if (_.isObject(options)) {
				_.extend(this, _.pick(options, validOptions));
			}
		},
		events: {
			'hidden.bs.modal': 'close'
		},
		render: function () {
			this.$el.empty().append(this.template());
			this.setFooterHTML(this.footerHTML);
			return this;
		},
		setHTML: function (selector, html) {
			this.$(selector).empty().append(html);
			return this;
		},
		setContentHTML: function (html) {
			this.setHTML('.modal-body', html);
			return this;
		},
		setHeaderHTML: function (html) {
			this.setHTML('.modal-header', html);
			return this;
		},
		setFooterHTML: function (html) {
			this.setHTML('.modal-footer', html);
			return this;
		},
		isShown: function () {
			var data = this.$el.data('bs.modal');
			return _.isUndefined(data) ? false : data.isShown;
		},
		hide: function () {
			this.$el.modal('hide');
			return this;
		},
		close: function () {
			if (!this.isClosed) {
				if (this.isShown()) {
					this.hide();
					Backbone.View.prototype.close.apply(this, arguments);
				}
			}
			return this;
		},
		open: function () {
			if (!this.isShown()) {
				this.$el.modal(_.pick(this, validOptions));
			}
			return this;
		}
	});

	return exports;
}());
