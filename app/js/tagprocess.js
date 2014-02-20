<<<<<<< HEAD
var $ = require('jquery'),
    ViewManager = require('./utilities/viewmanager'),
    Vent = require('./utilities/vent');

module.exports = {
	ViewManager: ViewManager,
    $doc: $(document),
    title: $(document).attr('title'),
    vent: Vent,
=======
module.exports = {
>>>>>>> parent of 8b1ab45... Adds draft version of viewmanager
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
            'href': '#login',
            'name': 'Login'
        },
        {
			'href': '#client',
			'name': 'Client'
		}
	]
};
