
(function () {

	"use strict";

	var _ = require('underscore');

	var when = require('when');
	var whennode = require('when/node');

	console.printf = require('./lib/printf.js');

	var audio2raw = require('./lib/audio2raw.js');
	var raw2json = require('./lib/raw2json.js');
	var waveform = require('./lib/waveform.js');

//	var afile = '/home/native/Music/vivaldi.mp3';
//	var afile = '/home/native/Music/A Wilhelm Scream - The Horse.mp3';
//	var afile = '/var/www/Data/usersaudios/00/92/37/00299866137091379200/file.mp3';
//	var afile = '/home/native/Music/01 Twisted Transistor/Unknown/00 - 2e399e2ccc3bad.mp3.mp3';
//	var afile = '/home/native/Music/Soul Hooligan/Unknown/01 - Algebra.mp3';
	var afile = '/home/native/Music/Чайковский Петр Ильич [club13333245] - Времена года - Апрель- Подснежник.mp3';


	function log10(val) {
		return Math.log(val) / Math.LN10;
	}

	module.exports.generator = function (req, res, next) {
		var wfStyle = [ req.body ];
//console.log(wfStyle);
		var MINVAL = 1 / wfStyle[0].size.height;
		var MAXVAL = log10((MINVAL + 1) / MINVAL);

		var ok = audio2raw(afile);

		ok = ok.then(function (result) {
			var ok = raw2json(result.stream, result.size, wfStyle);

			return ok.then(function (peaks) {
				var l = peaks[0].length;

				// amplification
				var k;
				if (wfStyle[0].preproc.maximize) {
					var max = 0;
					for (var n = 0; n < l; n ++) {
						if (max < peaks[0][n]) max = peaks[0][n];
					}
					k = 1 / max;
				}
				else {
					k = 1;
				}

				for (var n = 0; n < l; n ++) {
				//	test signal
				//	var p0 = 1 / l * n;

					var p0 = peaks[0][n] * k;

				// empty graph avoidance on zero signal
					p0 += MINVAL;

					var p;
					if (wfStyle[0].preproc.log10) {
						p = log10((MINVAL + p0) / MINVAL) / MAXVAL;
					}
					else {
						p = p0;
					}
					peaks[0][n] = p;
				//	console.printf("%12.5f %12.5f", p0, p);
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
