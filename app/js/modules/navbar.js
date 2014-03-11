var $ = jQuery = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	NavBarTemplate = require('../../templates/navbar.hbs'),
	UserDropdown = require('../../templates/userDropdown.hbs'),
    Handlebars = require('handlebars/runtime').default,
    NavButton = require('./navbutton'),
	SettingsModal = require('./modals/settings');

require('../../libs/bootstrap/bootstrap.js');
Handlebars.registerPartial('userDropdown', UserDropdown);
module.exports = {
    Collection: Backbone.Collection.extend({
        model: NavButton.Model
    }),
	View: Backbone.View.extend({
        tagName: 'div',
        className: 'container',
        id: 'navbar',
        template: NavBarTemplate,
		initialize: function () {
            this.collection = new module.exports.Collection(TagProcess.locations);
			this.settings = new SettingsModal();
            this.listenTo(TagProcess.vent, 'domchange:page', this.setActive);
			this.listenTo(TagProcess.vent, 'signInSuccess', this.toggleUserDropdown);
			this.listenTo(TagProcess.vent, 'signOutSuccess', this.toggleUserDropdown);
		},
		events: {
			'click #logout'		: 'logout',
			'click #settings'	: 'showSettings'
		},
		render: function () {
            var that = this,
				payload = {
					admin: TagProcess.Auth.user.hasPermission('admin')
				};
			this.$el.empty().append(this.template(payload));
            _.each(this.collection.models, function (item) {
                that.renderButton(item);
            }, this);

            return this;
		},
        renderButton: function (item) {
            var buttonView = new NavButton.View({
                model: item
            });
            this.$('#nav-ul').append(buttonView.render().el);
        },
        setActive: function (options) {
            _.each(this.collection.models, function (model) {
                model.set('active', model.get('href') === options.hash);
            });
        },
		toggleUserDropdown: function (data) {
			var text = _.isEmpty(data) || _.isUndefined(data) ? '' : data.data.name;
			this.$('#name-text').html(text);
			this.$('#user-dropdown').toggleClass('hide').siblings().toggleClass('hide');
			this.refreshUserDropdown();
			return this;
		},
		refreshUserDropdown: function () {
			var payload = {
				admin: TagProcess.Auth.user ? TagProcess.Auth.user.hasPermission('admin') : false
			};
			this.$('#user-dropdown ul').empty().append(UserDropdown(payload));
			return this;
		},
		logout: function () {
			TagProcess.Auth.signOut();
			TagProcess.Auth.updateSignInMessage('You\'re currently not logged in');
		},
		showSettings: function (event) {
			event.preventDefault();
			this.$('#settingsWrapper').append(this.settings.open().$el);
		}
	})
};
