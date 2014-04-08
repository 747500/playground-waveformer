
(function () {

	"use strict";

	var util = require('util');
	var fs = require('fs');

	var _ = require('underscore');
	var when = require('when');
	var whennode = require('when/node');

	var audio2raw = require('../lib/audio2raw.js');
	var raw2json = require('../lib/raw2json.js');
	var waveform = require('../lib/waveform.js');

	var wfStyle = JSON.parse(fs.readFileSync('../config/waveform_style.json'));

	var http = require('http');

	var afile = '/var/www/Data/usersaudios/00/92/37/00299866137091379200/file.mp3';

	var express = require('express');
	var app = express();

	require('./config/express')(app, config);
	require('./routes')(app);

	app.listen(bindTo.port, bindTo.address, function () {
        console.log('http: listen %s:%s', bindTo.address, bindTo.port);
	});

/*
	var httpserver = http.createServer(function (req, res) {

		res.writeHead(200, { 'Content-Type': 'text/html' });


		var ok = audio2raw(afile);

		ok = ok.then(function (result) {
			var width_set = _.map(wfStyle, function (el) { return el.width; });
			var ok = raw2json(result.stream, result.size, _.clone(width_set));

			return ok.then(function (peaks) {
				return {
					peaks: peaks,
					duration: result.duration
				};
			});
		});

		ok = ok.then(function (result) {

			var ok = when.try(waveform, wfStyle, result.peaks, { asDataURL: true });
			ok = ok.then(function (result) {
				_(result).chain().keys().map(function (k) {
					res.write('<img src="' + result[k] + '" alt=""/><br />\n');
				});
			});
			return ok;
		});

		ok.done(function () {
			res.end('\n');
		});

	});


	httpserver.listen(25003, '0.0.0.0', function (err) {

		if (err) {
			console.log(err.stack || err);
			process.exit(1);
		}

		console.log('Server running at http://127.0.0.1:25003/');

	});
*/

})();
