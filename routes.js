
(function () {

	"use strict";

	var util = require('util');

	var wf = require('./wf.js');

	module.exports = function (app) {
	//	app.all('/*', user.load);
	//	app.get('/im/messages/:userId', im.history);
		app.post('/gen', wf.generator);
	};

})();
