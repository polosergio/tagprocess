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
			'name': 'Jobs',
			'needsAdmin': false
		},
		{
			'href': '#forms/case',
			'active': false,
			'name': 'New Case',
			'needsAdmin': true
		},
		{
			'href': '#forms/client',
			'active': false,
			'name': 'New Client',
			'needsAdmin': true
		},
		{
			'href': '#forms/server',
			'active': false,
			'name': 'New Server',
			'needsAdmin': true
		},
		{
			'href': '#forms/employee',
			'active': false,
			'name': 'New Employee',
			'needsAdmin': true
		},
        {
            'href': '#forms/attorney',
            'active': false,
            'name': 'New Attorney',
			'needsAdmin': true
        },
		{
			'href': '#statements',
			'active': false,
			'name': 'Client Statement',
			'needsAdmin': true
		},
		{
			'href': '#',
			'active': false,
			'name': 'Server Report',
			'attributes': {
				'id': 'serverReport'
			},
			'needsAdmin': true
		},
		{
			'href': '/tagproc/receivablesreport.php',
			'active': false,
			'name': 'Client Receivables Report',
			'attributes': {
				'target': '_blank'
			},
			'needsAdmin': true
		}
	])
};
