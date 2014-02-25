var $ = require('jquery'),
	Backbone = require('backbone')
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
	],
	sidebar: new Backbone.Collection([
		{
			'href': '#client',
			'active': false,
			'name': 'Jobs'
		},
		{
			'href': '#forms/case',
			'active': false,
			'name': 'New Case'
		},
		{
			'href': '#forms/client',
			'active': false,
			'name': 'New Client'
		},
		{
			'href': '#forms/server',
			'active': false,
			'name': 'New Server'
		},
		{
			'href': '#forms/employee',
			'active': false,
			'name': 'New Employee'
		},
        {
            'href': '#forms/attorney',
            'active': false,
            'name': 'New Attorney'
        },
		{
			'href': '#',
			'active': false,
			'name': 'Client Statement'
		},
		{
			'href': '#',
			'active': false,
			'name': 'Server Report'
		},
		{
			'href': '#',
			'active': false,
			'name': 'Client Receivables Report'
		}
	])
};
