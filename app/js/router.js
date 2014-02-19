var Backbone = require('backbone'),
	TagProcess = require('./tagprocess');

module.exports = (function () {
	'use strict';
	var Router = Backbone.Router.extend({
		routes: {
			''			: 'showIndex',
			'home'		: 'showIndex',
			'test'		: 'showTest'
		},
		showIndex: function () {
			console.log('index');
		},
		showTest: function () {
			console.log('test');
		}
	});
	return {
		initialize: function () {
			TagProcess.router = new Router();
			Backbone.history.start();
		}
	};
}());
