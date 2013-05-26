// Custom XCode Project maker.
// Provide all the standard details and get a project ready to go, with the right folder names and nothing left to rename.


// hat rack provides collision free random hashes
var hat = require('hat');
var rack = hat.rack();

var http = require('http'),
	fs = require('fs'),
	execSync = require('execSync');

var Templates = {'QWERTYPROD':101};
var Replace = {
	'QWERTYPROD' : {
		'product' : 'QWERTYPROD',
		'organization' : 'QWERTYORG',
		'bundle' : 'QWERTYBUNDLEPFX',
		'parseAppId' : 'QWERTYAPPID',
		'parseKey' : 'QWERTYKEY',
		'name' : 'QWERTYNAME'
	}
}

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

		var old_product = Replace[template]['product'];
		var old_org = Replace[template]['organization'];
		var old_bundle = Replace[template]['bundle'];
		var old_appid = Replace[template]['parseAppId'];
		var old_key = Replace[template]['parseKey'];
		var old_name = Replace[template]['name'];

		var ourToken = rack();
		console.log('Unique token ' + ourToken + ' generated.');

		var template_folder = './xcode_projects/' + template + '/'
		var working_folder = './working_folder/' + ourToken + '/';
		var output_folder = './output_folder/' + ourToken + '/';

		// Let's start by just setting up directories:
		var result = execSync.exec('mkdir ' + working_folder);
		if (result.code) failExit('Return code ' + result.code + ' while making working_folder for token: ' + ourToken);

		result = execSync.exec('mkdir ' + output_folder);
		if (result.code) failExit('Return code ' + result.code + ' while making output_folder for token: ' + ourToken);

		var copyCommand = 'cp -R ' + template_folder + ' ' + working_folder;		
		result = execSync.exec(copyCommand);
		if (result.code) failExit('Return code ' + result.code + ' while copying template for token: ' + ourToken);

		result = execSync.exec('mv ' + working_folder + old_product + ' ' + working_folder + product);
		if (result.code) failExit('Return code ' + result.code + ' while renaming product folder.');

		result = execSync.exec('mv ' + working_folder + old_product + '.xcodeproj ' + working_folder + product + '.xcodeproj');
		if (result.code) failExit('Return code ' + result.code + ' while renaming product.xcodeproj folder.');

		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Prefix.pch ' + working_folder + product + '/' + product + '-Prefix.pch');
		if (result.code) failExit('Return code ' + result.code + ' while renaming product-Prefix.pch file.');

		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Info.plist ' + working_folder + product + '/' + product + '-Info.plist');
		if (result.code) failExit('Return code ' + result.code + ' while renaming product-Info.plist file.');

		var xcpj = fs.readFileSync(working_folder + product + '/' + product + '.xcodeproj/project.pbxproj','utf8');
		xcpj = xcpj.replace(new RegExp(old_product,'g'),product);
		xcpj = xcpj.replace(new RegExp(old_org,'g'),org);
		result = fs.writeFileSync(working_folder + product + '/' + product + '.xcodeproj/project.pbxproj',xcpj,'utf8');
		if (result) failExit('Result returned while overwriting product.xcodeproj/project.pbxproj');

		failExit('Just kidding.. all good.',0);

	} else {
		failExit('Invalid template',10);
	}

}

function failExit(reason, code) { 

	console.log('Fatal error: ' + reason);
	process.exit(code);

}