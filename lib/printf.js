
"use strict";

var sprintf = require('sprintf');

function printf() {
	console.log(sprintf.apply(process, arguments));
};

module.exports = printf;
