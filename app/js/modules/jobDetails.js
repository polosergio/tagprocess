var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JoBDetailsTemplate = require('../../templates/jobDetails.hbs'),
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify'),
	Helpers = require('../utilities/helpers'),
	ServeDetailsModal = require('./modals/serveDetails'),
	CommentModal = require('./modals/comment'),
	ServiceModal = require('./modals/service'),
	UploaderModal = require('./modals/uploader'),
	EmailModal = require('./modals/email');
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
		},
		getEmailParams: function (jobnumber, clientEmail) {
			var params = {
				emailname: 'TagProcess LLC'
			};
			_.extend(params, {
				clientemail: clientEmail || '',
				emailsubject: 'Job ' + jobnumber + ' Completed',
				emailmessage: 'Dear Client,\n\nJob number ' + jobnumber + ' has been completed.\n\nSincerely,\n\n' + params.emailname
			});
			return params;
		}
    });
	Handlebars.registerHelper('parse', helpers.parseKey);
	Handlebars.registerHelper('parseAttachmentType', helpers.parseAttachmentType);
	_.extend(exports, {
        View: Backbone.View.extend({
            initialize: function (options) {
                this.id = options.id;
				this.modal = {
					details: new ServeDetailsModal({id: this.id}),
					comment: new CommentModal({id: this.id}),
					service: new ServiceModal(),
					uploader: new UploaderModal(),
					email: new EmailModal()
				};
                this.template = JoBDetailsTemplate;
                this.model = new exports.Model({jobnumber: this.id});
                //this.modal = new Modal({size: '', parentView: this});
				this.listenTo(this.modal.comment, 'submit', this.submitComment);
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
						attachments: data.attachments || []
                    };
                this.$el.empty().append(this.template(payload));
                return this;
            },
			openModal: function (event) {
				event.preventDefault();
				var modal = $(event.currentTarget).data('modal');
				this.$('#modalWrapper').append(this.modal[modal].open().$el);
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
                /*this.openModalWithTemplate({
                    header: '<h4>Add Comments</h4>',
                    template: CommentFormTemplate(),
                    event: 'submit',
                    selector: '#commentForm',
                    callback: this.submitComment
                });
				*/
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
			openUploaderModal: function (event) {
				event.preventDefault();
				this.openModalWithTemplate({
					header: '<h4>Upload Documents</h4',
					template: UploaderFormTemplate(),
					event: 'submit',
					selector: '#uploaderForm',
					callback: this.submitUpload
				});
				return this;
			},
			openEmailModal: function (event) {
				event.preventDefault();
				var that = this,
					client = new (Backbone.Model.extend({
					baseUrl: '/tagproc/api/email',
					url: function () {
						return this.baseUrl + '?' + $.param(this.toJSON());
					}
				}))({
					client: that.model.get('account')
				});
				client.fetch({
					success: function (model, response) {
						that.openModalWithTemplate({
							header: '<h4>Send e-mail to Client</h4>',
							template: EmailFormTemplate(helpers.getEmailParams(that.id, response.email)),
							event: 'submit',
							selector: '#emailForm',
							callback: that.submitEmail
						});
					}
				});
				return this;
			},
			submitEmail: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					modal = this,
					that = modal.parentView,
					$alert = $form.find('.alert'),
					params = Helpers.serializeObject($form.serializeArray());
				console.log(params);
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Loading...');
				$.ajax({
					url: '/tagproc/api/email',
					data: params,
					type: 'POST',
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html('E-mail sent.');
						modal.hide();
					},
					error: function (e) {
						var message = JSON.parse(e.responseText);
						$alert.removeClass('hide alert-success alert-info').addClass('alert-danger').html(message.message || e.statusTExt);
					}
				});
				return this;
			},
			submitUpload: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
					modal = this,
					that = modal.parentView,
					$alert = $form.find('.alert'),
					data = new FormData();
				data.append('file', $form.find('#file')[0].files[0]);
				data.append('jobnumber', that.id);
				data.append('type', $form.find('#type').val());
				$alert.removeClass('hide alert-danger alert-success').addClass('alert-info').html('Loading...');
				$.ajax({
					url: '/tagproc/api/uploader',
					data: data,
					type: 'POST',
					cache: false,
					contentType: false,
					processData: false,
					success: function (response) {
						$alert.removeClass('hide alert-danger alert-info').addClass('alert-success').html('File uploaded.');
                        that.model.fetch();
                        modal.hide();
					},
					error: function (e) {
						var message = JSON.parse(e.responseText);
                        $alert.removeClass('hide alert-success alert-info').addClass('alert-danger').html(message.message || e.statusText);
                    }
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
