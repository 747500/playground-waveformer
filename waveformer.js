
(function () {

	"use strict";

	var env = process.env.NODE_ENV || 'development';
	var config = require('./config/config')[env];

	var util = require('util');
	var fs = require('fs');

	var _ = require('underscore');

	var express = require('express');
	var app = express();

	require('./config/express')(app, config);
	require('./routes')(app);

	var bindTo = {
		host: '0.0.0.0',
		port: 25003
	};

	app.listen(bindTo.port, bindTo.host, function () {
        console.log('http: listen %s:%s', bindTo.host, bindTo.port);
	});

})();
