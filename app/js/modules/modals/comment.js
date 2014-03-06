var Modal = require('./modal'),
	_ = require('underscore'),
	Template = require('../../../templates/forms/comment.hbs'),
	Backbone = require('backbone');


module.exports = (function () {
	'use strict';
	var exports = Backbone.View.extend({
			template: Template,
			initialize: function (options) {
				this.id = options.id;
				this.modal = new Modal({size: ''});
			},
			events: {
				'submit form': 'submit',
			},
			render: function () {
				this.modal.render()
					.setHeaderHTML('<h4>Add Comments</h4>')
					.setContentHTML(this.template());
				this.$el.empty().append(this.modal.$el);
				return this.delegateEvents();
			},
			open: function () {
				this.render().modal.open();
				return this;
			},
			submit: function (event) {
				event.preventDefault();
				var $form = $(event.currentTarget),
                    that = this,
                    $alert = $form.find('.alert'),
                    data = {
                        comments: $form.find('textarea').val(),
                        jobnumber : this.id
                    };
                $.ajax({
                    url: '/tagproc/api/comments',
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        $alert.removeClass('hide alert-danger').addClass('alert-success').html('Comment has been added.');
                        that.trigger('submit');
						that.modal.hide();
                    },
                    error: function (e) {
                        $alert.removeClass('hide alert-success').addClass('alert-danger').html(e.statusText);
                    }
                });
				return this;
			}
	});
	return exports;
}());
