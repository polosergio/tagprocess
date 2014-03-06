var _ = require('underscore');
require('../../libs/selectize/js/standalone/selectize.js');

module.exports = (function () {
    'use strict';
    var exports = {
        setFormat: function (item, escape) {
            return '<div>' + escape(item.firstname + ' ' + item.lastname + ': ' + item.uniqueid + ' - ' + item.county)  + '</div>';
        }
    };

    _.extend(exports, {
        serializeObject: function (array) {
            var object = {};
            _.each(array, function (item) {
                if (object[item.name] !== undefined) {
                    if (!object[item.name].push) {
                        object[item.name] = [object[item.name]];
                    }
                    object[item.name].push(item.value || '');
                } else {
                    object[item.name] = item.value || '';
                }
            });
            return object;
        },
        customOptionRender: {
			'server': {
				'option': exports.setFormat,
				'item': exports.setFormat
			}
		},
		jsonParser: function (string) {
			try {
				string = JSON.parse(string);
			} catch (e) {
				string = {};
			}
			return string;
		},
        initSelectizeInputs: function (view) {
            var $select = view.$('select');
            $select.each(function () {
                var options = $(this).data() || {},
                    that = this;
                $(this).selectize({
                    valueField: options.value || 'value',
                    labelField: options.label || 'text',
                    searchField: options.search ? options.search.split(',') : 'text',
                    preload: true,
                    create: false,
                    load: function (query, callback) {
                        if (options.url) {
                            $.ajax({
                                url: options.url,
                                type: 'GET',
                                success: function (response) {
                                    callback(response);
                                },
                                error: function (e) {
                                    console.log('error', e);
                                }
                            });
                        } else {
                            callback();
                        }
                    },
                    render: exports.customOptionRender[that.name]
                });
            });
            return view;
        }
    });

    return exports;
}());
