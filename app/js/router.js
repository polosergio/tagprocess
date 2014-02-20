var Backbone = require('backbone'),
	TagProcess = require('./tagprocess'),
    _ = require('underscore');

module.exports = (function () {
	'use strict';
	var Router = Backbone.Router.extend({
		routes: {
			''			    : 'showIndex',
			'home'		    : 'showIndex',
			'services'		: 'showServices'
		},
		showIndex: function () {
            var view = require('./modules/home');
			this.show({hash: '#home', title: 'Home', view: new view.View()});
		},
<<<<<<< HEAD
		showServices: function () {
			var view = require('./modules/services');
			this.show({hash: '#services', title: 'Services', view: new view.View()});
		},
		show: function (options) {
			var that = this,
                settings = _.extend({
				hash: undefined,
				title: '',
				view: undefined,
				viewOptions: {}
			}, options);
            TagProcess.vent.trigger('domchange:page', settings);
            if (settings.view instanceof Backbone.View) {
				that.viewManager.showView(settings.view);
			}
			return this;
=======
		showTest: function () {
			console.log('test');
>>>>>>> parent of 8b1ab45... Adds draft version of viewmanager
		}
	});
	return {
		initialize: function () {
			TagProcess.router = new Router();
			Backbone.history.start();
		}
	};
}());
