var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/invoices.hbs'),
	Backbone = require('backbone'),
	Helpers = require('../../utilities/helpers');

module.exports = (function () {
	'use strict';
	var Invoices = Backbone.Collection.extend({
			params: {
				jobnumber: ''
			},
			baseUrl: '/tagproc/api/invoice',
			url: function () {
				return this.baseUrl + '?' + $.param(this.params);
			}
		}),
		exports = Backbone.View.extend({
			template: Template,
			initialize: function (options) {
				this.id = options.id;
				this.invoices = new Invoices();
				this.invoices.params.jobnumber = this.id;
				this.modal = new Modal({size: ''});
				this.listenTo(this.invoices, 'sync', this.render);
				this.invoices.fetch();
			},
			events: {
				'click .toggleForm'		: 'toggleCreate',
				'submit #invoiceForm'	: 'createInvoice',
				'change #method'		: 'toggleCheck'
			},
			render: function () {
				var data = this.invoices.toJSON(),
					payload = {invoices: data, jobnumber: this.id};
				this.modal.render()
					.setHeaderHTML('<h4>Invoices</h4>')
					.setContentHTML(this.template(payload));
				this.$el.empty().append(this.modal.$el);
				Helpers.initSelectizeInputs(this.modal);
				return this;
			},
			open: function () {
				this.render().modal.open();
				return this;
			},
			toggleCreate: function (event) {
				event.preventDefault();
				this.$('#invoiceForm, #invoiceList').toggleClass('hide');
				return this;
			},
			toggleCheck: function (event) {
				var $select = $(event.currentTarget),
					value = $select.val(),
					$checkInput = this.$('#check'),
					$checkContainer = $checkInput.parents('.form-group');
				if (value === 'check') {
					$checkInput.attr('disabled', false);
					$checkContainer.removeClass('hide');
				} else {
					$checkInput.attr('disabled', true);
					$checkContainer.addClass('hide');
				}
				return this;
			},
			createInvoice: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					$alert = this.$('.alert'),
					url = '/tagproc/api/invoice',
					params = Helpers.serializeObject($form.serializeArray()),
					that = this;
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Submitting...');
				$.ajax({
					url: url,
					type: 'POST',
					data: params,
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html(response.message);
						$form[0].reset();
						that.invoices.fetch();
					},
					error: function (e) {
						var message = Helpers.jsonParser(e.responseText);
						$alert.removeClass('hide alert-success alert-info').addClass('alert-danger').html(message.message || e.statusText);
					}
				});
				return this;
			}
		});
	return exports;
}());
