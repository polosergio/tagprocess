var _ = require('underscore'),
    $ = jQuery = require('jquery'),
    Backbone = require('backbone'),
    JoBDetailsTemplate = require('../../templates/jobDetails.hbs'),
    CommentFormTemplate = require('../../templates/forms/comment.hbs');
    Handlebars = require('handlebars/runtime').default,
	Notify = require('../utilities/notify'),
	Helpers = require('../utilities/helpers'),
	ServeDetails = require('./modals/serveDetails'),
    Modal = require('./modals/modal');

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
                'click .edit': 'toggleEdit',
                'submit .formEdit': 'submitEdit',
				'click #viewDetails': 'openDetailsModal',
                'click #addComment': 'openCommentModal'
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
            openCommentModal: function (event) {
                event.preventDefault();
                this.modal.render()
                    .setHeaderHTML('<h4>Add Comments</h4>')
                    .setContentHTML(CommentFormTemplate())
                    .addEvent('submit', '#commentForm', this.submitComment)
                    .open();
                return this;
            },
            submitComment: function (event) {
                event.preventDefault();
                var $form = $(event.currentTarget),
                    modal = this,
                    that = modal.parentView,
                    data = {
                        comments: $form.find('textarea').val(),
                        jobnumber : that.id
                    };
                $.ajax({
                    url: '/tagproc/api/comments',
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        Notify.create({title: 'Added', body: 'Comment has been added.', icon: 'app/images/check.png'});
                        that.details.model.fetch();
                        modal.hide();
                    }
                });
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
                        Notify.create({title: 'Saved', body: 'Field ' + helpers.parseKey(key) + ' has been updated to ' + value, tag: key, icon: 'app/images/save.png'});
                        that.toggleEdit({currentTarget: $form.siblings('a')});
					}
				 });
            }
        })
    });
    return exports;
}());
