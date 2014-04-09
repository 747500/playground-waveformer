
(function () {

	"use strict";

	var _ = require('underscore');

	var when = require('when');
	var whennode = require('when/node');

	var audio2raw = require('./lib/audio2raw.js');
	var raw2json = require('./lib/raw2json.js');
	var waveform = require('./lib/waveform.js');

	var afile = '/home/native/Music/A Wilhelm Scream - The Horse.mp3';
	//'/var/www/Data/usersaudios/00/92/37/00299866137091379200/file.mp3';

	module.exports.generator = function (req, res, next) {
		var wfStyle = [ req.body ];

		var ok = audio2raw(afile);

		ok = ok.then(function (result) {
			var width_set = _.map(wfStyle, function (el) { return el.size.width; });
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
					res.send('<img src="' + result[k] + '" alt=""\>');
				});
			});

			return ok;
		});

		ok.done(function () {

		});

	};

})();
