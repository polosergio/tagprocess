var _ = require('underscore'),
	Backbone = require('backbone'),
	$ = jQuery = require('jquery'),
	CONST = require('./constants.js'),
	cookie = require('cookie-cutter'),
    //User = require('../utilities/viewmanager');
	User = require('../models/user');

require('jquery-ui-browserify');

module.exports = (function () {
	return {
		signedIn: false,

		signInMessage: 'You\'re currently not logged in.',

		updateSignInMessage: function (message) {
			$('#login-message').html(message).effect('highlight', 2000);
		},

		_doSignIn: function (options) {
			var _this = this,
				defaults = { url: '/tagproc/api/login', type: 'POST', contentType: 'application/json', processData: false },
				settings = _.extend(defaults, options);
			return $
				.ajax(settings)
				.done(
					function (response, status, xhr) {
						_this.signedIn = true;
						_this.user = new User(response.data);
						Backbone.trigger('signInSuccess', response, status, xhr);
					}
				)
				.fail(
					function (xhr, status, error) {
						Backbone.trigger('signInError', xhr, status, error);
                        }
                    )
                    .always(
                        function (xhr, status) {
                            Backbone.trigger('signInComplete', xhr, status);
                        }
                    )
                ;
            },

            signIn: function (username, password) {
                return this._doSignIn({
                    data: JSON.stringify({
                        username: username,
                        password: password
                    })
                });
            },

            rememberMeSignIn: function () {
                if (cookie(CONST.COOKIE.AUTH)) {
                    return this._doSignIn({
                        data: JSON.stringify({
                            uri: 42 // Preparing for future use case
                        }),
                        error: this.forgetLogin
                    });
                }
                return false;
            },

            signOut: function () {
                var _this = this;
                return $
                    .ajax({
                        url: '/tagproc/api/logout',
                        type: 'get'
                    })
                    .done(
                        function () {
                            _this.forgetLogin();
                            Backbone.trigger('signOutSuccess');
                        }
                    )
                    .fail(
                        function (response, status) {
                            Backbone.trigger('signOutError', status);
                        }
                    )
                    .always(
                        function () {
                            Backbone.trigger('signOutComplete');
                        }
                    )
                ;
            },

            forgetLogin: function () {
                cookie.set(CONST.COOKIE.AUTH, {expires: new Date(0)});
                this.signedIn = false;
                this.user = null;
                return this;
            }
	};
}());
