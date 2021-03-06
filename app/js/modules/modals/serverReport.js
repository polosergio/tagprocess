var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/serverReport.hbs'),
	Backbone = require('backbone'),
	Helpers = require('../../utilities/helpers');


module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
			template: Template,
			initialize: function () {
				this.modal = new Modal({size: ''});
			},
			events: {
				'change #time': 'showCustomDate'
			},
			render: function () {
				this.modal.render()
					.setHeaderHTML('<h4>Generate Server Report</h4>')
					.setContentHTML(this.template());
				this.$el.empty().append(this.modal.$el);
				return this;
			},
			open: function () {
				this.render().modal.open();
                Helpers.initSelectizeInputs(this);
				return this;
			},
			showCustomDate: function (event) {
				var $target = $(event.currentTarget),
					 value = $target.val(),
					 $date = this.$('input[name=custom]');
				if (value === 'custom') {
					$date.parents('.form-group').removeClass('hide');
				} else {
					$date.parents('.form-group').addClass('hide');
				}
				return this;
			}
		});
	return exports;
}());
