var Backbone = require('backbone'),
	TagProcess = require('./tagprocess'),
    _ = require('underscore');

module.exports = (function () {
	'use strict';
	var Router = Backbone.Router.extend({
		routes: {
			''			    : 'showIndex',
			'home'		    : 'showIndex',
			'services'		: 'showServices',
			'technology'	: 'showTechnology',
			'aboutus'		: 'showAboutUs',
			'contactus'		: 'showContactUs',
			'login'			: 'showLogin',
			'client'		: 'showClient',
            'jobs/:id'      : 'showClientID',
            'forms/:form'   : 'showForm'
		},
		initialize: function () {
			this.viewTarget = '#content';
			this.viewManager = new TagProcess.ViewManager({'selector': this.viewTarget});
		},
		showIndex: function () {
            var view = require('./modules/home');
			this.show({hash: '#home', title: 'Home', view: new view.View()});
		},
		showServices: function () {
			var view = require('./modules/services');
			this.show({hash: '#services', title: 'Services', view: new view.View()});
		},
		showTechnology: function () {
			var view = require('./modules/technology');
			this.show({hash: '#technology', title: 'Technology', view: new view.View()});
		},
		showAboutUs: function () {
			var view = require('./modules/aboutus');
			this.show({hash: '#aboutus', title: 'About Us', view: new view.View()});
		},
		showContactUs: function () {
			var view = require('./modules/contactus');
			this.show({hash: '#contactus', title: 'Contact Us', view: new view.View()});
		},
		showLogin: function () {
			var view = require('./modules/login');
			this.show({hash: '#login', title: 'Log In', view: new view.View()});
		},
		showClient: function () {
			var view = require('./modules/client');
			this.show({hash: '#client', title: 'Client', view: new view.View()});
		},
        showClientID: function (id) {
            var view = require('./modules/jobDetails');
            this.show({hash: '#client', title: 'Job Details', view: new view.View({id: id})})
        },
        showForm: function (form) {
            var view = require('./modules/newForms');
            this.show({hash: '#client', title: 'New ' + form, view: new view.View({form: form})});
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
		}
	});
	return {
		initialize: function () {
			TagProcess.router = new Router();
			Backbone.history.start();
		}
	};
}());
