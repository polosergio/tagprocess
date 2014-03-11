var Backbone = require('backbone'),
    ContactUsTemplate = require('../../templates/contactus.hbs'),
	Helpers = require('../utilities/helpers');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = ContactUsTemplate();
		},
		events: {
			'submit form' : 'submit'
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		},
		submit: function (event) {
			event.preventDefault();
			var $form = $(event.currentTarget),
				data = Helpers.serializeObject($form.serializeArray()),
				$alert = $form.find('.alert');
			$.ajax({
				url: '/tagproc/api/contact',
				type: 'POST',
				data: data,
				success: function (response) {
					$alert.removeClass('hide alert-danger').addClass('alert-success').html('Message sent.');
					$form[0].reset();
				},
				error: function (e) {
					$alert.removeClass('hide alert-success').addClass('alert-danger').html(e.statusText);
				}
			});
		}
	})
};
