var	$ = require('jquery'),
	TagProcess = require('./js/tagprocess'),
	Router = require('./js/router'),
	Header = require('./js/modules/header'),
	NavBar = require('./js/modules/navbar'),
	Footer = require('./js/modules/footer'),
	header = new Header.View(),
	navbar = new NavBar.View(),
	footer = new Footer.View();

TagProcess.vent.on('domchange:page', function (options) {
    if (options.title && options.title.trim() !== '') {
        TagProcess.$doc.attr('title', TagProcess.title + ': ' + options.title);
    } else {
        TagProcess.$doc.attr('title', TagProcess.title);
    }
});

$('#layout').prepend(navbar.render().$el)
    .prepend(header.render().$el);
$('#footer').append(footer.render().$el);
Router.initialize();
