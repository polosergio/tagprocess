var _ = require('underscore'),
	Backbone = require('backbone');

module.export = (function () {
	'use strict';
	return Backbone.Model.extend({
        defaults: {
            username: 'John Doe'
        },
		url: '/api/user',
        parse: function (response) {
            return _.result(response, 'data');
		},
        hasPermission: function (need) {
            return _.indexOf(this.get('permissions'), need) !== -1;
        }
    });
}());
