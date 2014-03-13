var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JobDetailsTemplate = require('../../templates/jobDetails.hbs'),
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify'),
	Helpers = require('../utilities/helpers'),
	ServeDetailsModal = require('./modals/serveDetails'),
	CommentModal = require('./modals/comment'),
	ServiceModal = require('./modals/service'),
	UploaderModal = require('./modals/uploader'),
	EmailModal = require('./modals/email'),
	RosModal = require('./modals/returnOfService'),
	InvoiceModal = require('./modals/invoices'),
	TagProcess = require('../tagprocess');

module.exports = (function () {
    'use strict';
    var exports = {
        Model: Backbone.Model.extend({
            baseUrl: '/tagproc/api/job',
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
        'case_number': true,
        'judge': true,
        'plaintiff': true,
        'defendant': true,
        'attorney': true,
        'date_casefiled': true,
        'date_amendedfiled': true,
        'state': true,
        'county': true,
        'court_type': true,
        'server_id': true,
        'date_served': true,
        'time_served': true,
        'method_service': true,
        'detailed_service': true,
        'service_address': true,
        'served_on': true,
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
			template: JobDetailsTemplate,
            initialize: function (options) {
                this.id = options.id;
                this.model = new exports.Model({jobnumber: this.id});
                this.listenTo(this.model, 'sync', this.render);
                this.model.fetch();
            },
            events: {
                'click .edit'           :'toggleEdit',
                'submit .formEdit'      :'submitEdit',
				'click .openModal'	    :'openModal'
            },
            render: function () {
                var data = this.model.toJSON(),
                    payload = {
                        job: _.omit(helpers.parseEditable(data), 'attachments'),
						admin: TagProcess.Auth.user.hasPermission('admin'),
						attachments: data.attachments || []
                    };
                this.$el.empty().append(this.template(payload));
				return this.initializeModals();
            },
			initializeModals: function () {
				this.modal = {
					details: new ServeDetailsModal({id: this.id}),
					comment: new CommentModal({id: this.id}),
					service: new ServiceModal({id: this.id}),
					uploader: new UploaderModal({id: this.id}),
					email: new EmailModal({client: this.model.get('account'), jobnumber: this.id}),
					returnOfService: new RosModal({id: this.id}),
					invoices: new InvoiceModal({id: this.id})
				};
				this.listenTo(this.modal.comment, 'submit', this.refreshServeDetailsModal);
				this.listenTo(this.modal.service, 'submit', this.refreshModel);
				this.listenTo(this.modal.uploader, 'submit', this.refreshModel);
				return this;
			},
			openModal: function (event) {
				event.preventDefault();
				var modal = $(event.currentTarget).data('modal');
				this.$('#modalWrapper').append(this.modal[modal].open().$el);
			},
            refreshModel: function () {
				this.model.fetch();
				return this;
			},
            refreshServeDetailsModal: function () {
                this.modal.details.model.fetch();
				return this;
            },
            toggleEdit: function (event) {
                if (_.isFunction(event.preventDefault)) { event.preventDefault(); }
                var $target = $(event.currentTarget).parents('td');
                $target.children(':not(a)').toggleClass('hide').find('input').focus();
            },
            submitEdit: function (event) {
                event.preventDefault();
				var $form = $(event.currentTarget),
					data = Helpers.serializeObject($form.serializeArray()),
					key = Object.keys(data)[0],
					value = data[key],
                    that = this;
				 $.ajax({
					url: '/tagproc/api/job',
					data: _.extend(data, {jobnumber: that.model.get('jobnumber')}),
					type: 'POST',
					success: function (response) {
						var field = response[0].data;
                        $form.siblings('div').html(field[key]);
                        that.toggleEdit({currentTarget: $form.siblings('a')});
                        Notify.create({title: 'Saved', body: 'Field ' + helpers.parseKey(key) + ' has been updated to ' + value, tag: key, icon: 'app/images/save.png'});
					},
                    error: function (e) {
                        Notify.create({title: 'Error', body: e.statusText, icon: ''})
                    }
				 });
            }
        })
    });
    return exports;
}());
