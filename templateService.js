// Web Service interface for templateProjectSync.js

var http = require('http'),
	fs = require('fs'),
	router = require('choreographer').router(),
	nodestatic = require('node-static'),
	exec = require('child_process').exec,
	formidable = require('formidable');

var fileserver = new nodestatic.Server('./output_folder', {cache:3600});
var pubserver = new nodestatic.Server('./public', {cache:3600});

router.get('/output_folder/*/*', function (req, res, token, file) { 
	log('Got download attempt for ' + token);
	return fileserver.serveFile(token + '/' + file, 200, {}, req, res);
});

// Comment out these two routes to remove the UI and allow only POST to / and downloads from output folder.
router.get('/public/*', function (req, res, file) { 
	log('Got download attempt for ' + file);
	return fileserver.serveFile(file, 200, {}, req, res);
});

router.get('/', function (req, res) { 
	return pubserver.serveFile('index.html',200,{}, req, res);
});

router.post('/', function (req, res) {

	var form = new formidable.IncomingForm();

	form.parse(req, function (err, fields, files) {

		console.log(err);
		console.log(fields);
		console.log(files);

		log('Starting template customization');
		var enablearray = [];
		if (fields.enable_push == 'on') enablearray.push('PUSH');
		if (fields.enable_analytics == 'on') enablearray.push('ANALYTICS');
		if (fields.enable_testobj == 'on') enablearray.push('TESTOBJ');
		console.log(enablearray);
		var child = exec('node templateProjectSync.js', {
			'env':{
				'product':fields.product,
				'organization':fields.organization,
				'name':fields.devname,
				'parseAppId':fields.parseappid,
				'parseKey':fields.parsekey,
				'bundle':fields.bundlepfx,
				'fbid':(fields.fbid ? fields.fbid : ''),
				'fbname':(fields.fbname ? fields.fbname : ''),
				'template':(fields.fbid ? 'HACKPROD' : 'QWERTYPROD')
			}
		},
			function (error, stdout, stderr) {
				if (error) { 
					log('template creation failed. ' + stdout);
					res.end('Error. ' + stdout);
				} else {
					log('template creation succeeded. ' + stdout);
					res.writeHead(301,{
						'Location': stdout
					});
					res.end();
				}
			});

		child.on('exit', function (code) { 
			console.log(code);
		});

		child.on('error', function (code) { 
			console.log(code);
		});

	});

});

http.createServer(router).listen(80);

function log(msg, code) { 
	var dd = new Date();
	console.log(dd.toString() + ' - ' + msg + (code ? ' (' + code + ')' : ''));
}
