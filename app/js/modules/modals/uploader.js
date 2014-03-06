var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/uploader.hbs'),
	Backbone = require('backbone'),
	Helpers = require('../../utilities/helpers');


module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
			template: Template,
			initialize: function (options) {
				this.id = options.id;
				this.modal = new Modal();
			},
			events: {
				'submit form': 'submit',
			},
			render: function () {
				this.modal.render()
					.setHeaderHTML('<h4>Upload Documents</h4>')
					.setContentHTML(this.template());
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
                Helpers.initSelectizeInputs(this);
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					that = this,
					$alert = $form.find('.alert'),
					data = new FormData();
				data.append('file', $form.find('#file')[0].files[0]);
				data.append('jobnumber', this.id);
				data.append('type', $form.find('#type').val());
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Loading...');
				$.ajax({
					url: '/tagproc/api/uploader',
					data: data,
					type: 'POST',
					cache: false,
					contentType: false,
					processData: false,
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html('File uploaded.');
                        that.trigger('submit');
						that.modal.hide();
					},
					error: function (e) {
						var message = JSON.parse(e.responseText);
                        $alert.removeClass('hide alert-success alert-info').addClass('alert-danger').html(message.message || e.statusText);
                    }
				});
			    return this;
			}
	});
	return exports;
}());
