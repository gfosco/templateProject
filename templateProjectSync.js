// Custom XCode Project maker.
// Provide all the standard details and get a project ready to go, with the right folder names and nothing left to rename.


// hat rack provides collision free random hashes
var hat = require('hat');
var rack = hat.rack();

var http = require('http'),
	fs = require('fs'),
	execSync = require('execSync');

var Templates = {
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

		var old_product = Templates[template]['product'],
			old_org = Templates[template]['organization'],
			old_bundle = Templates[template]['bundle'],
			old_appid = Templates[template]['parseAppId'],
			old_key = Templates[template]['parseKey'],
			old_name = Templates[template]['name'];

		var ourToken = rack();

		var template_folder = './xcode_projects/' + template + '/'
		var working_folder = './working_folder/' + ourToken + '/';
		var output_folder = './output_folder/' + ourToken + '/';

		// Let's start by just setting up directories:
		var result = execSync.exec('mkdir ' + working_folder);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while making working_folder for token: ' + ourToken);

		result = execSync.exec('mkdir ' + output_folder);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while making output_folder for token: ' + ourToken);

		var copyCommand = 'cd ' + template_folder + ' && cp -R * ../.' + working_folder + ' && cd ../..';	
		result = execSync.exec(copyCommand);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while copying template for token: ' + ourToken);

		result = execSync.exec('mv ' + working_folder + old_product + ' ' + working_folder + product);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product folder.');

		result = execSync.exec('mv ' + working_folder + old_product + '.xcodeproj ' + working_folder + product + '.xcodeproj');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product.xcodeproj folder.');

		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Prefix.pch ' + working_folder + product + '/' + product + '-Prefix.pch');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product-Prefix.pch file.');

		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Info.plist ' + working_folder + product + '/' + product + '-Info.plist');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product-Info.plist file.');

		var xcpj = fs.readFileSync(working_folder + product + '.xcodeproj/project.pbxproj','utf8');
		xcpj = xcpj.replace(new RegExp(old_product,'g'),product);
		xcpj = xcpj.replace(new RegExp(old_org,'g'),org);
		result = fs.writeFileSync(working_folder + product + '.xcodeproj/project.pbxproj',xcpj,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product.xcodeproj/project.pbxproj.');

		var appdh = fs.readFileSync(working_folder + product + '/AppDelegate.h','utf8');
		appdh = appdh.replace(new RegExp(old_product,'g'),product);
		appdh = appdh.replace(new RegExp(old_org,'g'),org);
		appdh = appdh.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/AppDelegate.h',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.h.');

		var appdh = fs.readFileSync(working_folder + product + '/AppDelegate.m','utf8');
		appdh = appdh.replace(new RegExp(old_product,'g'),product);
		appdh = appdh.replace(new RegExp(old_org,'g'),org);
		appdh = appdh.replace(new RegExp(old_name,'g'),name);
		appdh = appdh.replace(new RegExp(old_appid,'g'),appid);
		appdh = appdh.replace(new RegExp(old_key,'g'),key);
		result = fs.writeFileSync(working_folder + product + '/AppDelegate.m',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.m.');

		xcpj = fs.readFileSync(working_folder + product + '/' + product + '-Prefix.pch','utf8');
		xcpj = xcpj.replace(new RegExp(old_product,'g'),product);
		result = fs.writeFileSync(working_folder + product + '/' + product + '-Prefix.pch',xcpj,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/product-Prefix.pch.');

		appdh = fs.readFileSync(working_folder + product + '/' + product + '-Info.plist','utf8');
		appdh = appdh.replace(new RegExp(old_bundle,'g'),bundle);
		result = fs.writeFileSync(working_folder + product + '/' + product + '-Info.plist',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.m.');

		appdh = fs.readFileSync(working_folder + product + '/ViewController.h','utf8');
		appdh = appdh.replace(new RegExp(old_product,'g'),product);
		appdh = appdh.replace(new RegExp(old_org,'g'),org);
		appdh = appdh.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/ViewController.h',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/ViewController.h.');

		appdh = fs.readFileSync(working_folder + product + '/ViewController.m','utf8');
		appdh = appdh.replace(new RegExp(old_product,'g'),product);
		appdh = appdh.replace(new RegExp(old_org,'g'),org);
		appdh = appdh.replace(new RegExp(old_name,'g'),name);
		appdh = appdh.replace(new RegExp(old_appid,'g'),appid);
		appdh = appdh.replace(new RegExp(old_key,'g'),key);
		result = fs.writeFileSync(working_folder + product + '/ViewController.m',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/ViewController.m.');

		appdh = fs.readFileSync(working_folder + product + '/main.m','utf8');
		appdh = appdh.replace(new RegExp(old_product,'g'),product);
		appdh = appdh.replace(new RegExp(old_org,'g'),org);
		appdh = appdh.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/main.m',appdh,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/main.m.');

		xcpj = fs.readFileSync(working_folder + product + '.xcodeproj/project.xcworkspace/contents.xcworkspacedata','utf8');
		xcpj = xcpj.replace(new RegExp(old_product,'g'),product);
		result = fs.writeFileSync(working_folder + product + '.xcodeproj/project.xcworkspace/contents.xcworkspacedata',xcpj,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product.xcodeproj/project.xcworkspace/contents.xcworkspacedata.');

		var zipCommand = 'cd ' + working_folder + ' && zip -q -r ../.' + output_folder + '/' + product + '.zip * && cd ../../';		
		result = execSync.exec(zipCommand);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while zipping project for token: ' + ourToken);

		exitWithMessageAndCode(output_folder + '/' + product + '.zip',0);

	} else {
		exitWithMessageAndCode('Invalid template',10);
	}

}
exports.makeTemplate = makeTemplate;

function exitWithMessageAndCode(message, code) { 

	console.log((code == 0 ? message : 'Fatal error: ' + message));
	process.exit(code >= 0 ? code * -1 : -1);

}