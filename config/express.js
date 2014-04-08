
(function () {

	"use strict";

	var express = require('express');
	var path = require('path');

	module.exports = function (app, config) {

		app.set('showStackError', true);

/*
		// should be placed before express.static
		app.use(express.compress({
			filter: function (req, res) {
				var h = res.getHeader('Content-Type');
				return /json|text|javascript|css/.test(h)
			},
			level: 6
		}));
*/

//		app.use(express.favicon());
		app.use(express.static(path.join(config.root, 'public')));

		app.use(express.logger('dev'));
//		app.use(express.logger({ format: ':method ":url" :status' }));

		app.set('views', path.join(config.root, 'views'));
		app.set('view engine', 'jade');

		app.configure(function () {

			app.use(express.cookieParser());
			app.use(express.bodyParser());
			app.use(express.methodOverride());

/*
			app.use(express.session({
				secret: 'noobjs',
				store: new mongoStore({
					url: config.db,
					collection: 'sessions'
				})
			}));
*/
			app.use(app.router);
			app.use(express.errorHandler({
				showStack: true,
				dumpExceptions: true
			}));

		});

		app.configure('development', function () {
			app.locals.pretty = true;
		});

		app.configure('test', function () {
			app.locals.pretty = true;
		});

	};

})();
