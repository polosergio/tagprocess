var _ = require('underscore');

module.exports = (function () {
	'use strict';
	var exports = {};
	_.extend(exports, {
		enabled: false,
		init: function (callback) {
			if (!window.Notification) {
				return;
			}
			if (Notification.permission === 'default') {
				Notification.requestPermission(function () {
					exports.init();
					if (_.isFunction(callback)) { callback(); };
				});
			} else if (Notification.permission === 'granted') {
				this.enabled = true;
			} else if (Notification.permission === 'denied') {
				return;
			}
		},
		create: function (options) {
			var validOptions = ['body', 'tag', 'icon'],
				title = options.title || '',
				options = _.pick(options, validOptions);
			if (this.enabled) {
				this._currentNotification = new Notification(title, options);
			} else {
				exports.init(this.create.bind(this, options));
			}
		}
	});
	exports.init();
	return exports;
}());
