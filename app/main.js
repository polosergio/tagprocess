var	$ = require('jquery'),
	TagProcess = require('./js/tagprocess'),
	Router = require('./js/router'),
	Header = require('./js/header'),
	Footer = require('./js/footer'),
	header = new Header.View(),
	footer = new Footer.View();


$('#header').append(header.$el);
$('#footer').append(footer.$el);
Router.initialize();
