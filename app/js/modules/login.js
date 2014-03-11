var Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	LoginTemplate = require('../../templates/login.hbs');

module.exports = {
	View: Backbone.View.extend({
		initialize: function () {
			this.template = LoginTemplate();
			setTimeout(function () {
				if (TagProcess.Auth.signedIn) {
					TagProcess.Auth.updateSignInMessage('You\'re already logged in.');
					Backbone.history.navigate('client', {trigger: true});
				}
			}, 0);
		},
		events: {
			'submit form' : 'authenticate'
		},
		render: function () {
			this.$el.empty().append(this.template);
			return this;
		},
		renderError: function (error) {
			this.$('.alert')
				.toggleClass('hide', !error)
				.html(error)
			;
			this.$(':valid')
				.closest('.form-group')
					.toggleClass('has-error', false)
			;
			this.$(':invalid')
				.closest('.form-group')
					.toggleClass('has-error', true)
				.end()
				.first()
					.focus()
			;
			return this;
		},
		signIn: function (input) {
			var view = this,
				$button = this.$('button[type="submit"]').attr('disabled', true);
			this.renderError();
			TagProcess.Auth.forgetLogin().signIn(input.name, input.password).then(
				function () {
					var attemptedRoute = TagProcess.Auth.attemptedRoute;
					if (attemptedRoute) {
						Backbone.history.navigate(attemptedRoute, {trigger: true});
						TagProcess.Auth.attemptedRoute = null;
					} else {
						Backbone.history.navigate('client', {trigger: true});
					}
				},
				function (jqxhr, status, message) {
					var loginResponse;
					if (jqxhr.status === 401) {
						loginResponse = 'Invalid username and/or password.';
					} else {
						loginResponse = message;
					}
					view.renderError(loginResponse);
					$button.attr('disabled', false);
					return this;
				}
			);
			return this;
		},
		authenticate: function (event) {
			event.preventDefault();
			var inputs = {
				name: this.$('#username').val(),
				password: this.$('#password').val()
			};
			this.signIn(inputs);
			return this;
		}
	})
};
