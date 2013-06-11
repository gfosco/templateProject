// Really Quick Start - Cleaner Utility.

var fs = require('fs');
var execSync = require('execSync');

var cleanCommand = 'rm -rf ./working_folder/*';
result = execSync.exec(cleanCommand);
if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while cleaning up working folders');

var cleanCommand = 'touch ./working_folder/placeholder';
result = execSync.exec(cleanCommand);
if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while touching working folder');

cleanCommand = 'rm -rf ./output_folder/*';
result = execSync.exec(cleanCommand);
if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while cleaning up output folders');

var cleanCommand = 'touch ./output_folder/placeholder';
result = execSync.exec(cleanCommand);
if (result.code) exitWithMessageAndCode('Return code ' + result.code + ' while touching output folder');

exitWithMessageAndCode("Cleaned up.",0);

//
//

function exitWithMessageAndCode(message, code) { 

	console.log((code == 0 ? message : 'Fatal error: ' + message));
	process.exit(code >= 0 ? code * -1 : -1);

}