var	$ = require('jquery'),
	TagProcess = require('./js/tagprocess'),
	Router = require('./js/router'),
	Header = require('./js/modules/header'),
	NavBar = require('./js/modules/navbar'),
	Footer = require('./js/modules/footer'),
	header = new Header.View(),
	navbar = new NavBar.View(),
	footer = new Footer.View(),
	deferred = {};

TagProcess.vent.on('domchange:page', function (options) {
    if (options.title && options.title.trim() !== '') {
        TagProcess.$doc.attr('title', TagProcess.title + ': ' + options.title);
    } else {
        TagProcess.$doc.attr('title', TagProcess.title);
    }
});

$('#layout').prepend(navbar.render().$el)
    .prepend(header.render().$el).parent()
	.append(footer.render().$el);

var signInAttempt = TagProcess.Auth.rememberMeSignIn();
if (signInAttempt !== false) {
	deferred.userRequest = $.Deferred();
	signInAttempt.always(deferred.userRequest.resolve);
}

Router.initialize();
