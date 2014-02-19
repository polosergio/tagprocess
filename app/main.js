var	$ = require('jquery'),
	TagProcess = require('./js/tagprocess'),
	Router = require('./js/router'),
	Header = require('./js/header'),
	NavBar = require('./js/navbar'),
	Footer = require('./js/footer'),
	header = new Header.View(),
	navbar = new NavBar.View(),
	footer = new Footer.View();


$('#header').append(header.$el);
$('#navbar').append(navbar.$el);
$('#footer').append(footer.$el);
Router.initialize();
