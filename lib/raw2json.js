
(function () {

	"use strict";

	var fs = require('fs');
	var _ = require('underscore');
	var util = require('util');
	var when = require('when');

	var WORDLEN = 2;

	_.mixin({
		avg: function(arr) {
			var sum = 0;
			arr.forEach(function(n) {
				if (0 < n) sum += n;
			});
			return sum / arr.length;
		},
//		geometric: function(arr) {
//			var g = 0;
//			arr.forEach(function(n) {
//				if (0 < n) g *= n;
//			});
//			return Math.pow(g, 1 / arr.length);
//		}
	});

	module.exports = function (_stream, _bytesCount, style) {
		var samplesCount = _bytesCount / WORDLEN;
		var width_set = _.map(style, function (el) { return el.size.width; });
		var avgbuf = [ ],
			avgindex = [ ],
			peakbuf = [ ];

		for (var i = 0; i < width_set.length; i ++) {
			var avgbuflen = parseInt(samplesCount / width_set[i]);
			avgbuf[i] = new Array(avgbuflen);
			avgindex[i] = 0;
			peakbuf[i] = [];
		}

		function update(chunk) {
			for (var chunkIndex = 0; chunkIndex < chunk.length; chunkIndex += WORDLEN) {
				var word = chunk.readUInt16LE(chunkIndex);

				word -= 32767;
				word /= 32768;

				for (var i = 0; i < width_set.length; i ++) {
					if (avgindex[i] >= avgbuf[i].length) {
						avgindex[i] = 0;
					}
					avgbuf[i][avgindex[i]] = word;
					avgindex[i] ++;
					if (avgindex[i] >= avgbuf[i].length) {
						var res = _(avgbuf[i]);
						if ('average' === style[0].sampling.type)
							res = res.avg();
						else
//						if ('geometric' === style[0].sampling.type)
//							res = res.geometric();
//						else
						if ('maximum' === style[0].sampling.type)
							res = res.max();
						else
							res = 0;

						peakbuf[i].push(res);
					}
				}
			}
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
