
(function () {

	"use strict";

	var os = require('os');
	var _ = require('underscore');
	var path = require('path');
	var rootPath = path.normalize(path.join(__dirname, '..'));
	var strftime = require('strftime');
	var util = require('util');

	module.exports = {
		development: {
			root: rootPath,
			app: {
				name: 'Waveformer (development mode)'
			}
		},
		test: {
			root: rootPath,
			app: {
				name: 'Waveformer (test mode)'
			}
		},
		production: {
			root: rootPath,
			app: {
				name: 'Waveformer'
			}
		}
	};

	function console_log() {
		var now = new Date();
		var strTs = strftime('%d %b %Y %T %Z', now);
	//	var hname = (os.hostname() || process.env.HOSTNAME || 'localhost'),
		var pname = path.basename(require.main.filename, '.js');
		var args = [ '%s %s[%s]:', strTs, pname, process.pid ].concat(arguments);
		_.map(args, function (el) {
			var toExpose = el &&
					'object' === typeof el;
			return toExpose ? util.inspect(el) : el;
		});
		uti.puts(util.format.apply(util, args));
	}

	if (console.log !== console_log) {
		console.log = console_log
	}

})();

