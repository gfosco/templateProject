// Custom XCode Project maker.
// Provide all the standard details and get a project ready to go, with the right folder names and nothing left to rename.


// hat rack provides collision free random hashes
var hat = require('hat');
var rack = hat.rack();

var http = require('http'),
	fs = require('fs'),
	exec = require('exec');

var Templates = {'QWERTYPROD':101};
var InProcess = {};
var State = {};

makeTemplate();

function mockOptions() { 

	return {
		'product':'FJMProd',
		'organization':'FJMCo',
		'bundle':'com.FJMCo',
		'parseAppId':'fExC5sYySPHdXpkBuRZv1zilESZXuuMrKh74Xuxf',
		'parseKey':'7jMYzK1KALmQlslDb2szdGpSuOAaGhWyDJh2ayD4',
		'name':'Fosco',
		'template':'QWERTYPROD'
	};

}

function makeTemplate(options) { 

	var defaultOptions = mockOptions();
	options = options || defaultOptions;

	var product = options['product'] || defaultOptions.product;
	var org = options['organization'] || defaultOptions.organization;
	var bundle = options['bundle'] || defaultOptions.bundle;
	var appid = options['parseAppId'] || defaultOptions.parseAppId;
	var key = options['parseKey'] || defaultOptions.parseKey;
	var name = options['name'] || defaultOptions.name;
	var template = options['template'] || defaultOptions.template;

	if (Templates[template]) {

		failExit('Just kidding, all good so far.',0);

	} else {
		failExit('Invalid template',10);
	}

}

function failExit(reason, code) { 

	console.log('Fatal error: ' + reason);
	process.exit(code);

}