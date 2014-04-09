

(function () {

	"use strict";

	var fs = require('fs');
	var _ = require('underscore');
	var util = require('util');
	var when = require('when');


	module.exports = function (_stream, _bytesCount, _width_set) {

		var avgbuf = [ ],
			avgindex = [ ],
			peakbuf = [ ];

		function update(chunk) {

			for (var chunkIndex = 0; chunkIndex < chunk.length; chunkIndex += 2) {
				var word = chunk.readUInt16LE(chunkIndex);
//				word -= 128;
//				word /= 128;

word -= 32767;
word /= 32768;

				for (var i = 0; i < _width_set.length; i ++) {
					if (avgindex[i] >= avgbuf[i].length) {
						avgindex[i] = 0;
					}
					avgbuf[i][avgindex[i]] = word;
					avgindex[i] ++;
					if (avgindex[i] >= avgbuf[i].length) {
						peakbuf[i].push(_.max(avgbuf[i]));
					}
				}
			}
		}

		for (var i = 0; i < _width_set.length; i ++) {
			var avgbuflen = parseInt(_bytesCount / _width_set[i]);
			avgbuf[i] = new Array(avgbuflen);
			avgindex[i] = 0;
			peakbuf[i] = [];
		}

		return when.promise(function (resolve, reject) {
			_stream.on('data', function (chunk) {
				update(chunk);
			});

			_stream.on('end', function () {
				resolve(peakbuf);
			});

			_stream.on('error', function (err) {
				reject(err);
			});
		});
	};

})();
