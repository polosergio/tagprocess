var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    Sidebar = require('./sidebar'),
    Helpers = require('../utilities/helpers');
require('../../libs/selectize/js/standalone/selectize.js');

module.exports = (function (){
    'use strict';
    var exports = {};

    _.extend(exports, {
        View: Backbone.View.extend({
            forms: {
                'employee': require('../../templates/forms/employee.hbs'),
                'client': require('../../templates/forms/client.hbs'),
                'server': require('../../templates/forms/server.hbs'),
                'case': require('../../templates/forms/case.hbs'),
                'attorney': require('../../templates/forms/attorney.hbs')
            },
            initialize: function (options) {
                if (!options.form) {
                    throw new Error('You must pass a form.');
                }
                this.form = options.form;
                this.template = this.forms[options.form];
                this.sidebar = new Sidebar.View({active: '#forms/' + this.form});
            },
			events: {
				'submit form': 'submit'
			},
			render: function () {
				this.$el.empty().append(this.template());
				this.$('.sidebar').html(this.sidebar.render().$el);
                Helpers.initSelectizeInputs(this);
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
                    url = $form.data('url'),
					data = Helpers.serializeObject($form.serializeArray()),
					$alert = $form.find('.alert');
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Submitting...');
				$.ajax({
					url: url,
					type: 'POST',
					data: data,
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html(response.message);
						$form[0].reset();
					},
					error: function (e) {
						var message = JSON.parse(e.responseText);
						$alert.removeClass('hide alert-success alert-info').addClass('alert-danger').html(message.message || e.statusText);
					}
				});
			}
        })
    });
    return exports;
}());
