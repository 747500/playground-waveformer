/* jshint bitwise:false */

(function () {

	'use strict';

	var crypto = require('crypto');
	var child_process = require('child_process');
	var fs = require('fs');
	var util = require('util');

	var when = require('when');

/*
**
**	@param _inputFilename	String
**
**/
	module.exports = function (_inputFilename) {

		var outFilename = '/tmp/node-' + process.pid + '.' + crypto.randomBytes(16).toString('hex');

		var cargs = [
			'-loglevel', 'quiet',
			'-i', _inputFilename,
			'-ac', '1',
			'-ar', '4000',
			'-acodec', 'pcm_u8',
			'-f', 'u8',
			'-y', outFilename
		];

		return when.promise(function (resolve, reject) {

			var child = child_process.spawn('/usr/bin/ffmpeg', cargs);

			child.stdout.on('data', function (data) {
				console.log('ffmpeg out:\n%s\n', data.toString());
			});

			child.stderr.on('data', function (data) {
				console.log('ffmpeg err:\n%s\n', data.toString());
			});

			child.on('exit', function (code) {
				var signal = code >> 8;
				code = code & 127;

				if (0 === code && 0 === signal) {
					var rawStream = fs.createReadStream(outFilename, { autoClose: true });
					rawStream.on('open', function (_fd) {
						var fileSize = fs.fstatSync(_fd).size;
						cleanup(outFilename);
						resolve({
							stream: rawStream,
							size: fileSize,
							duration: fileSize / 4000
						});
					});
					return;
				}

				var err = new Error(util.format('ffmpeg: %d/%d', code,  signal));
				cleanup(outFilename);
				reject(err);
			});
		});

	};

	function cleanup(_fn) {
		fs.unlink(_fn, function (err) {
			if (err) {
				console.warn('unlink tmpfile warn:\n%s\n',
					err.stack || err.toString());
			}
		});
	}

})();
