var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/email.hbs'),
	Backbone = require('backbone'),
	Helpers = require('../../utilities/helpers');


module.exports = (function () {
	'use strict';
	var Client = Backbone.Model.extend({
			baseUrl: '/tagproc/api/email',
			url: function () {
				return this.baseUrl + '?' + $.param(_.pick(this.toJSON(), 'client'));
			},
			defaults: {
				jobnumber: '',
				emailname: 'TagProcessLLC',
				client: '',
				email: '',
				subject: '',
				message: ''
			}
		}),
		exports = Backbone.View.extend({
			template: Template,
			initialize: function (options) {
				this.modal = new Modal();
				this.client = new Client({
					client: options.client,
					jobnumber: options.jobnumber,
					subject: 'Job ' + options.jobnumber + ' Completed',
					message: 'Dear Client,\n\nJob number ' + options.jobnumber + ' has been completed.\n\nSincerely,\n\nTagProcessLLC'
				});
				this.listenTo(this.client, 'sync', this.render);
				this.client.fetch();
			},
			events: {
				'submit form': 'submit',
			},
			render: function () {
				var data = this.client.toJSON();
				this.modal.render()
					.setHeaderHTML('<h4>Send e-mail to Client</h4>')
					.setContentHTML(this.template(data));
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.modal.open();
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					that = this,
					$alert = $form.find('.alert'),
					params = Helpers.serializeObject($form.serializeArray());
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Loading...');
				$.ajax({
					url: '/tagproc/api/email',
					data: params,
					type: 'POST',
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html('E-mail sent.');
						that.modal.hide();
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
