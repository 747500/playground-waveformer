
(function () {

	"use strict";

	var _ = require('underscore');

	var sprintf = require('sprintf');

	var when = require('when');
	var whennode = require('when/node');

	var audio2raw = require('./lib/audio2raw.js');
	var raw2json = require('./lib/raw2json.js');
	var waveform = require('./lib/waveform.js');

	var afile = '/home/native/Music/vivaldi.mp3';
//	var afile = '/home/native/Music/A Wilhelm Scream - The Horse.mp3';
//	var afile = '/var/www/Data/usersaudios/00/92/37/00299866137091379200/file.mp3';

	function log10(val) {
		return Math.log(val) / Math.LN10;
	}

	var MINVAL = (1 / 255);
	var MAXVAL = log10((MINVAL + 1) / MINVAL);

	module.exports.generator = function (req, res, next) {
		var wfStyle = [ req.body ];

		var ok = audio2raw(afile);

		ok = ok.then(function (result) {
			var width_set = _.map(wfStyle, function (el) { return el.size.width; });
			var ok = raw2json(result.stream, result.size, _.clone(width_set));

			return ok.then(function (peaks) {
				var l = peaks[0].length;
				for (var n = 0; n < l; n ++) {

 					var p0 = peaks[0][n];

					var p = log10(
						(MINVAL + p0) / MINVAL
					) / MAXVAL;

					console.log(sprintf("%12.5f %12.5f", p0, p));

					peaks[0][n] = p;
				}

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
