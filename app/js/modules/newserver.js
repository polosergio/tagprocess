var _ = require('underscore'),
	$ = require('jquery'),
	Backbone = require('backbone'),
	Sidebar = require('./sidebar'),
    NewClientTemplate = require('../../templates/newserver.hbs'),
	Helpers = require('../utilities/helpers');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		View: Backbone.View.extend({
			initialize: function () {
                var that = this;
				this.template = NewClientTemplate();
				this.sidebar = new Sidebar.View({active: '#newserver'});
			},
			events: {
				'submit form': 'submit'
			},
			render: function () {
				this.$el.empty().append(this.template);
				this.$('.sidebar').html(this.sidebar.render().$el);
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					data = Helpers.serializeObject($form.serializeArray()),
					$alert = $form.find('.alert');
				//PENDING CREATE NEW CLIENT API
				/*
				$.ajax({
					url: '/tagproc/api/newclient',
					type: 'POST',
					data: data,
					success: function (response) {
						console.log(response);
						$alert.removeClass('hide alert-danger').addClass('alert-success').html('Client Created');
						$form[0].reset();
					},
					error: function (e) {
						$alert.removeClass('hide alert-success').addClass('alert-danger').html(e.statusText);
					}
				});
				*/
			   $alert.removeClass('hide').html('Pending create new client api');
			}
		})
	});
	return exports;
}());


