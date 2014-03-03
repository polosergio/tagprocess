var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JoBDetailsTemplate = require('../../templates/jobDetails.hbs'),
    CommentFormTemplate = require('../../templates/forms/comment.hbs'),
    ServiceFormTemplate = require('../../templates/forms/service.hbs'),
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify'),
	Helpers = require('../utilities/helpers'),
	ServeDetails = require('./modals/serveDetails'),
    Modal = require('./modals/modal');
require('../../libs/selectize/js/standalone/selectize.js');

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
				this.details = new ServeDetails({id: this.id});
                this.model = new exports.Model({jobnumber: this.id});
                this.modal = new Modal({size: '', parentView: this});
                this.listenTo(this.model, 'sync', this.render);
                this.model.fetch();
            },
            events: {
                'click .edit'           :'toggleEdit',
                'submit .formEdit'      :'submitEdit',
				'click #viewDetails'    :'openDetailsModal',
                'click #addComment'     :'openCommentModal',
                'click #serviceForm'    :'openServiceModal'
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
			openDetailsModal: function (event) {
				event.preventDefault();
				this.$el.append(this.details.open().$el);
			},
            openModalWithTemplate: function (options) {
                var modal = this.modal;
                modal.render()
                    .setHeaderHTML(options.header)
                    .setContentHTML(options.template)
                    .addEvent(options.event, options.selector, options.callback)
                    .open();
                Helpers.initSelectizeInputs(modal);
                return this;
            },
            openCommentModal: function (event) {
                event.preventDefault();
                this.openModalWithTemplate({
                    header: '<h4>Add Comments</h4>',
                    template: CommentFormTemplate(),
                    event: 'submit',
                    selector: '#commentForm',
                    callback: this.submitComment
                });
                return this;
            },
            openServiceModal: function (event) {
                event.preventDefault();
                this.openModalWithTemplate({
                    header: '<h4>Service Information</h4>',
                    template: ServiceFormTemplate(),
                    event: 'submit',
                    selector: '#serviceForm',
                    callback: this.submitService
                });
                return this;
            },
            submitService: function (event) {
                event.preventDefault();
                var $form = $(event.currentTarget),
                    modal = this,
                    that = modal.parentView,
                    $alert = $form.find('.alert'),
                    params = Helpers.serializeObject($form.serializeArray());
                params.jobnumber = that.id;
                $.ajax({
                    url: '/tagproc/api/service',
                    data: params,
                    type: 'POST',
                    success: function (response) {
                        $alert.removeClass('hide alert-danger').addClass('alert-success').html('Service has been added.');
                        that.model.fetch();
                        modal.hide();
                    },
                    error: function (e) {
                        $alert.removeClass('hide alert-success').addClass('alert-danger').html(e.statusText);
                    }
                });
                return this;
            },
            submitComment: function (event) {
                event.preventDefault();
                var $form = $(event.currentTarget),
                    modal = this,
                    that = modal.parentView,
                    $alert = $form.find('.alert'),
                    data = {
                        comments: $form.find('textarea').val(),
                        jobnumber : that.id
                    };
                $.ajax({
                    url: '/tagproc/api/comments',
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        $alert.removeClass('hide alert-danger').addClass('alert-success').html('Comment has been added.');
                        that.details.model.fetch();
                        modal.hide();
                    },
                    error: function (e) {
                        $alert.removeClass('hide alert-success').addClass('alert-danger').html(e.statusText);
                    }
                });
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
