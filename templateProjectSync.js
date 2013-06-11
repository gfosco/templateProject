// Really Quick Start
// Template-based system for customizing development projects.
// 
// This is a synchronous command-line script that uses environment variables
// It is run by the web service, which sets the environment variables based on the POST data

// Node JS Module includes
// hat provides collision free hash generation functions
var hat = require('hat');
var http = require('http');
var fs = require('fs');
// execSync is a blocking layer around the 'child-process' modules 'exec' method
var execSync = require('execSync');

// Define the templates, the available options and the search/replace tokens.
var Templates = {
	'QWERTYPROD' : {  // QWERTYPROD contains a Single-Page Application XCode Template with Storyboards and Parse.
		'product' : 'QWERTYPROD',
		'organization' : 'QWERTYORG',
		'bundle' : 'QWERTYBUNDLEPFX',
		'parseAppId' : 'QWERTYAPPID',
		'parseKey' : 'QWERTYKEY',
		'name' : 'QWERTYNAME'
	},
	'HACKPROD' : { // HACKPROD contains a Single-Page Application XCode template with Storyboards, Parse, and the Facebook SDK.
		'product' : 'HACKPROD',
		'organization' : 'HACKORG',
		'bundle' : 'HACKBUNDLE',
		'parseAppId' : 'HACKAPPID',
		'parseKey' : 'HACKKEY',
		'name' : 'HACKNAME',
		'fbid' : '475121865870836',
		'fbname' : 'HACKDISPLAYNAME'
	}
}

// get a collision free hash function
var rack = hat.rack();

// check if the template environment variable is populated
if (!process.env.template && process.env.TESTMODE != 1) {
	exitWithMessageAndCode('Template not provided.',80);
}

// The Product Name variable is the only potentially dangerous value, as it is used in exec functions and as a filepath parameter.
// This is easily sanitized by requiring only letters, numbers, and dash/underscore.
if (process.env.TESTMODE != 1 && (!process.env.product || !process.env.product.match(/^[\w _-]+$/))) {
	exitWithMessageAndCode('Product name invalid.',70);
}

// TODO: When the UI enforces the right template, this can be removed, but for now we set
//       the templated based on the provided values.
process.env.template = process.env.fbid ? 'HACKPROD' : 'QWERTYPROD';


// None of the values are optional, so lets check they're all provided.
// The only v

// Run the process.
makeTemplate(process.env);

// 
//

// With TESTMODE=1 these default values will be used.
function mockOptions() { 

	return {
		'product':'FJMProd',
		'organization':'FJMCo',
		'bundle':'com.FJMCo',
		'parseAppId':'fExC5sYySPHdXpkBuRZv1zilESZXuuMrKh74Xuxf',
		'parseKey':'7jMYzK1KALmQlslDb2szdGpSuOAaGhWyDJh2ayD4',
		'name':'Fosco',
		'template':'QWERTYPROD',
		'enable':['PUSH','ANALYTICS','TESTOBJ']
	};

}



function makeTemplate(options) { 

	options = process.env.TESTMODE == 1 ? mockOptions() : options;

	var product = options['product'];
	var org = options['organization'];
	var bundle = options['bundle'];
	var appid = options['parseAppId'];
	var key = options['parseKey'];
	var name = options['name'];
	var template = options['template'];
	var enable = options['enable'];
	var fbid = '';
	var fbname = '';

	if (options['fbid'] && options['fbname']) {
		fbid = options['fbid'];
		fbname = options['fbname'];
	}

	if (Templates[template]) {

		var old_product = Templates[template]['product'],
			old_org = Templates[template]['organization'],
			old_bundle = Templates[template]['bundle'],
			old_appid = Templates[template]['parseAppId'],
			old_key = Templates[template]['parseKey'],
			old_name = Templates[template]['name'],
			old_fbid = Templates[template]['fbid'],
			old_fbname = Templates[template]['fbname'];

		// We generate a unique hash for directory names.
		var ourToken = rack();

		// Set up the paths we'll be working with.
		var template_folder = './xcode_projects/' + template + '/'
		var working_folder = './working_folder/' + ourToken + '/';
		var output_folder = './output_folder/' + ourToken + '/';

		// Let's start by just setting up directories:
		var result = execSync.exec('mkdir ' + working_folder);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while making working_folder for token: ' + ourToken);
		result = execSync.exec('mkdir ' + output_folder);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while making output_folder for token: ' + ourToken);

		// Copy the template folder into our working folder:
		var copyCommand = 'cd ' + template_folder + ' && cp -R * ../.' + working_folder + ' && cd ../..';	
		result = execSync.exec(copyCommand);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while copying template for token: ' + ourToken);

		// Rename the 4 main files in an XCode project based on the sanitized product value:
		result = execSync.exec('mv ' + working_folder + old_product + ' ' + working_folder + product);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product folder.');
		result = execSync.exec('mv ' + working_folder + old_product + '.xcodeproj ' + working_folder + product + '.xcodeproj');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product.xcodeproj folder.');
		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Prefix.pch ' + working_folder + product + '/' + product + '-Prefix.pch');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product-Prefix.pch file.');
		result = execSync.exec('mv ' + working_folder + product + '/' + old_product + '-Info.plist ' + working_folder + product + '/' + product + '-Info.plist');
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while renaming product-Info.plist file.');

		// Rewrite the project.pbxproj file:
		var fileData = fs.readFileSync(working_folder + product + '.xcodeproj/project.pbxproj','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		result = fs.writeFileSync(working_folder + product + '.xcodeproj/project.pbxproj',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product.xcodeproj/project.pbxproj.');

		// Rewrite the AppDelegate.h file:
		fileData = fs.readFileSync(working_folder + product + '/AppDelegate.h','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		fileData = fileData.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/AppDelegate.h',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.h.');

		// Rewrite the AppDelegate.m file:
		fileData = fs.readFileSync(working_folder + product + '/AppDelegate.m','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		fileData = fileData.replace(new RegExp(old_name,'g'),name);
		fileData = fileData.replace(new RegExp(old_appid,'g'),appid);
		fileData = fileData.replace(new RegExp(old_key,'g'),key);
		result = fs.writeFileSync(working_folder + product + '/AppDelegate.m',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.m.');

		// Rewrite the Prefix.pch file:
		fileData = fs.readFileSync(working_folder + product + '/' + product + '-Prefix.pch','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		result = fs.writeFileSync(working_folder + product + '/' + product + '-Prefix.pch',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/product-Prefix.pch.');

		// Rewrite the Info.plist file:
		fileData = fs.readFileSync(working_folder + product + '/' + product + '-Info.plist','utf8');
		fileData = fileData.replace(new RegExp(old_bundle,'g'),bundle);
		if (template == 'HACKPROD') {
			fileData = fileData.replace(new RegExp(old_fbid,'g'),fbid);
			fileData = fileData.replace(new RegExp(old_fbname,'g'),fbname);
		}
		result = fs.writeFileSync(working_folder + product + '/' + product + '-Info.plist',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/AppDelegate.m.');

		// Rewrite the ViewController.h file:
		fileData = fs.readFileSync(working_folder + product + '/ViewController.h','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		fileData = fileData.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/ViewController.h',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/ViewController.h.');

		// Rewrite the ViewController.m file:
		fileData = fs.readFileSync(working_folder + product + '/ViewController.m','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		fileData = fileData.replace(new RegExp(old_name,'g'),name);
		fileData = fileData.replace(new RegExp(old_appid,'g'),appid);
		fileData = fileData.replace(new RegExp(old_key,'g'),key);
		result = fs.writeFileSync(working_folder + product + '/ViewController.m',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/ViewController.m.');

		// Rewrite the main.m file:
		fileData = fs.readFileSync(working_folder + product + '/main.m','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		fileData = fileData.replace(new RegExp(old_org,'g'),org);
		fileData = fileData.replace(new RegExp(old_name,'g'),name);
		result = fs.writeFileSync(working_folder + product + '/main.m',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product/main.m.');

		// Rewrite the contents.xcworkspacedata file:
		fileData = fs.readFileSync(working_folder + product + '.xcodeproj/project.xcworkspace/contents.xcworkspacedata','utf8');
		fileData = fileData.replace(new RegExp(old_product,'g'),product);
		result = fs.writeFileSync(working_folder + product + '.xcodeproj/project.xcworkspace/contents.xcworkspacedata',fileData,'utf8');
		if (result) exitWithMessageAndCode('Result returned while overwriting product.xcodeproj/project.xcworkspace/contents.xcworkspacedata.');

		// Zip up the project into the output folder:
		var zipCommand = 'cd ' + working_folder + ' && zip -q -r ../.' + output_folder + product + '.zip * && cd ../../';		
		result = execSync.exec(zipCommand);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while zipping project for token: ' + ourToken);

		// Delete the working folder:
		var cleanCommand = 'rm -rf ' + working_folder;
		result = execSync.exec(cleanCommand);
		if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while cleaning up working folder for token: ' + outToken);

		// Return the path to the zip:
		exitWithMessageAndCode(output_folder + product + '.zip',0);

	} else {
		exitWithMessageAndCode('Invalid template',10);
	}

}
exports.makeTemplate = makeTemplate;

function exitWithMessageAndCode(message, code) { 

	console.log((code == 0 ? message : 'Fatal error: ' + message));
	process.exit(code >= 0 ? code * -1 : -1);

}