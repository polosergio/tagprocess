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
            'forms/:form'   : 'showForm',
			'statements'	: 'showStatements',
			'settings'		: 'showSettings'
		},
		initialize: function () {
			this.viewTarget = '#content';
			this.viewManager = new TagProcess.ViewManager({'selector': this.viewTarget});
		},
		showIndex: function () {
            var view = require('./modules/home');
			this.show({hash: '#home', title: 'Home', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showServices: function () {
			var view = require('./modules/services');
			this.show({hash: '#services', title: 'Services', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showTechnology: function () {
			var view = require('./modules/technology');
			this.show({hash: '#technology', title: 'Technology', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showAboutUs: function () {
			var view = require('./modules/aboutus');
			this.show({hash: '#aboutus', title: 'About Us', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showContactUs: function () {
			var view = require('./modules/contactus');
			this.show({hash: '#contactus', title: 'Contact Us', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showLogin: function () {
			var view = require('./modules/login');
			this.show({hash: '#login', title: 'Log In', view: new view.View(), viewOptions: {needsPermission: false}});
		},
		showClient: function () {
			var view = require('./modules/client');
			this.show({hash: '#client', title: 'Client', view: new view.View(), viewOptions: {needsPermission: false}});
		},
        showClientID: function (id) {
            var view = require('./modules/jobDetails');
            this.show({hash: '#client', title: 'Job Details', view: new view.View({id: id}), viewOptions: {needsPermission: true}})
        },
        showForm: function (form) {
            var view = require('./modules/newForms');
            this.show({hash: '#client', title: 'New ' + form, view: new view.View({form: form}), viewOptions: {needsPermission: true}});
        },
		showStatements: function () {
			var view = require('./modules/statements');
			this.show({hash: '#statements', title: 'Client Statements', view: new view.View(), viewOptions: {needsPermission: true}});
		},
		showSettings: function () {
			var view = require('./modules/settings');
			this.show({hash: '#settings', title: 'User Settings', view: new view.View(), viewOptions: {needsPermission: true}});
		},
		show: function (options) {
			var that = this,
                settings = _.extend({
				hash: undefined,
				title: '',
				view: undefined,
				viewOptions: {}
			}, options);
            if (!TagProcess.Auth.signedIn && settings.viewOptions.needsPermission) {
                this.navigate('login');
                return;
            }
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
