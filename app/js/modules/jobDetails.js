var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JoBDetailsTemplate = require('../../templates/jobDetails.hbs'),
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify'),
	Helpers = require('../utilities/helpers');

module.exports = (function () {
    'use strict';
    var exports = {
        Model: Backbone.Model.extend({
            baseUrl: '/tagproc/api/jobs',
            url: function () {
                return this.baseUrl + '?' + $.param(this.toJSON());
            },
            parse: function (response) {
                return response[0];
            }
        })
    }, helpers = {}, isEditable = {
        'served_party': true,
        'served_person': true,
        'date_received': true,
        'time_received': true,
        'served_documents': true,
        'date_court': true,
        'casenumber': true,
        'judge': true,
        'plaintiff': true,
        'defendant': true,
        'attorney': true,
        'date_casefiled': true,
        'date_amendedfiled': true,
        'state': true,
        'county': true,
        'court_type': true,
        'serverid': true,
        'date_served': true,
        'time_served': true,
        'method_service': true,
        'detailed_service': true,
        'service_address': true,
        'servedon': true,
        'servee_address': true,
        'comments': true
    };

    _.extend(helpers, {
        parseEditable: function (object) {
            var temp = {};
            _.each(object, function (value, key) {
                temp[key] = {value: value, editable: isEditable[key]};
            });
            return temp;
        },
		parseKey: function (name) {
			return name.replace('_', ' ').toUpperCase();
		},
		parseAttachmentType: function (type) {
			var validTypes = {
				'doc': 'Documents',
				'ros': 'Return of Service',
				'completejob': 'Complete Job',
				'courtreceipt': 'Court Receipt'
			};
			return validTypes[type];
		}
    });
	Handlebars.registerHelper('parse', helpers.parseKey);
	Handlebars.registerHelper('parseAttachmentType', helpers.parseAttachmentType);
	_.extend(exports, {
        View: Backbone.View.extend({
            initialize: function (options) {
                this.id = options.id;
                this.template = JoBDetailsTemplate;
                this.model = new exports.Model({jobnumber: this.id});
                this.listenTo(this.model, 'sync', this.render);
                this.model.fetch();
            },
            events: {
                'click .edit': 'toggleEdit',
                'submit form': 'edit'
            },
            render: function () {
                var data = this.model.toJSON(),
                    payload = {
                        job: _.omit(helpers.parseEditable(data), 'attachments'),
						attachments: data.attachments || []
                    };
                this.$el.empty().append(this.template(payload));
                return this;
            },
            toggleEdit: function (event) {
                if (_.isFunction(event.preventDefault)) { event.preventDefault(); }
                var $target = $(event.currentTarget);
                $target.siblings().toggleClass('hide');
            },
            edit: function (event) {
                event.preventDefault();
				var $form = $(event.currentTarget),
					data = Helpers.serializeObject($form.serializeArray()),
					key = Object.keys(data)[0],
					value = data[key];
				/*
				 * TODO implement AJAX call to save fields
				 $.ajax({
					url: '/tagproc/api/job',
					data: data,
					type: 'POST',
					success: function (response) {
						console.log(response);
					}
				 });
				* */
				Notify.create({title: 'Saved', body: 'Field ' + helpers.parseKey(key) + ' has been updated to ' + value, tag: key, icon: 'app/images/save.png'});
				this.toggleEdit({currentTarget: $form.siblings('a')});
            }
        })
    });
    return exports;
}());
