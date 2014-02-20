var $ = require('jquery'),
    ViewManager = require('./utilities/viewmanager'),
    Vent = require('./utilities/vent'),
	Authenticate = require('./modules/authenticate');
module.exports = {
	Auth: Authenticate,
	ViewManager: ViewManager,
	baseUrl: 'dev1.xertigo.net',
    $doc: $(document),
    title: $(document).attr('title'),
    vent: Vent,
	locations: [
		{
			'href': '#services',
			'name': 'Services'
		},
		{
			'href': '#technology',
			'name': 'Technology'
		},
        {
			'href': '#aboutus',
			'name': 'About Us'
		},
        {
			'href': '#contactus',
			'name': 'Contact Us'
		},
        {
			'href': '#client',
			'name': 'Client'
		}
	]
};
