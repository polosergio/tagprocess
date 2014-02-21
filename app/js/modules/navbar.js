var $ = jQuery = require('jquery'),
	_ = require('underscore'),
	Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	NavBarTemplate = require('../../templates/navbar.hbs'),
    NavButton = require('./navbutton');

require('../../libs/bootstrap/bootstrap.js');
module.exports = {
    Collection: Backbone.Collection.extend({
        model: NavButton.Model
    }),
	View: Backbone.View.extend({
        tagName: 'div',
        className: '',
        id: 'navbar',
        template: NavBarTemplate,
		initialize: function () {
            this.collection = new module.exports.Collection(TagProcess.locations);
            this.listenTo(TagProcess.vent, 'domchange:page', this.setActive);
			this.listenTo(TagProcess.vent, 'signInSuccess', this.toggleUserDropdown);
			this.listenTo(TagProcess.vent, 'signOutSuccess', this.toggleUserDropdown);
		},
		events: {
			'click #logout': 'logout'
		},
		render: function () {
            var that = this;
			this.$el.empty().append(this.template());
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
            // Optimization needed. See tabNavigation.js
            _.each(this.collection.models, function (model) {
                model.set('active', model.get('href') === options.hash);
            });
        },
		toggleUserDropdown: function (data) {
			var text = _.isEmpty(data) || _.isUndefined(data) ? '' : data.data.name;
			this.$('#name-text').html(text);
			this.$('#user-dropdown').toggleClass('hide').siblings().toggleClass('hide');
		},
		logout: function () {
			TagProcess.Auth.signOut();
			TagProcess.Auth.updateSignInMessage('You\'re currently not logged in');
		}
	})
};
