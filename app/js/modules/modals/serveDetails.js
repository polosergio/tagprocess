var Modal = require('./modal'),
	ServeTemplate = require('../../../templates/modals/serveDetails.hbs'),
	_ = require('underscore'),
	Backbone = require('backbone');

module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
		template: ServeTemplate,
		initialize: function () {
			this.modal = new Modal();
			this.model = new Backbone.Model({test: 'hi', example: 'world'});
			this.render();
		},
		render: function () {
			var data = this.model.toJSON();
			this.modal.render().setContentHTML(this.template(data));
			return this;
		},
		open: function () {
			this.render().modal.open();
		}
	});
	return exports;
}());
