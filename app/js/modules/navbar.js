var $ = require('jquery'),
    _ = require('underscore'),
	Backbone = require('backbone'),
	TagProcess = require('../tagprocess'),
	NavBarTemplate = require('../../templates/navbar.hbs'),
    NavButton = require('./navbutton');

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
            this.$('.navbar-nav').append(buttonView.render().el);
        },
        setActive: function (options) {
            // Optimization needed. See tabNavigation.js
            _.each(this.collection.models, function (model) {
                model.set('active', model.get('href') === options.hash);
            });
        }
	})
};
