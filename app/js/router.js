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
		initialize: function () {
			this.viewTarget = '#content';
			this.viewManager = new TagProcess.ViewManager({'selector': this.viewTarget});
		},
		showIndex: function () {
			console.log('index');
		},
		showTest: function () {
			console.log('test');
		},
		show: function (options) {
			var settings = _.extend({
				hash: undefined,
				title: '',
				view: undefined,
				viewOptions: {}
			}, options);

			if (_.isString(settings.view)) {
				var myView = require(settings.view);
				that.viewManager.showView(myView);
			} else if (settings.view instanceof Backbone.View) {
				that.viewManager.showView(settings.view);
			}
			return this;
		}
	});
	return {
		initialize: function () {
			TagProcess.router = new Router();
			Backbone.history.start();
		}
	};
}());
