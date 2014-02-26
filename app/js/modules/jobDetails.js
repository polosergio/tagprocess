var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JoBDetailsTemplate = require('../../templates/jobDetails.hbs'),
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify');
Handlebars.registerHelper('parse', function (name) {
    return name.replace('_', ' ').toUpperCase();
});
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
        }
    });
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
                        job: helpers.parseEditable(data)
                    };
                this.$el.empty().append(this.template(payload));
                return this;
            },
            toggleEdit: function (event) {
                event.preventDefault();
                var $target = $(event.currentTarget);
                $target.siblings().toggleClass('hide');
            },
            edit: function (event) {
                event.preventDefault();
				Notify.create({title: 'Saved', body: 'Field has been saved', tag: 'test'});
                console.log(event);
            }
        })
    });
    return exports;
}());
