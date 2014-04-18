

(function () {

	"use strict";

	var util = require('util');
	var fs = require('fs');
	var constants = require('constants');
	var http = require('http');
	var path = require('path');
	var _ = require('underscore');
	var sprintf = require('sprintf');
	var Canvas = require('canvas');

	function parseColor(dashcolor, alpha) {
		return sprintf("rgba(%d, %d, %d, %f)",
			parseInt(dashcolor.substr(1, 2), 16),
			parseInt(dashcolor.substr(3, 2), 16),
			parseInt(dashcolor.substr(5, 2), 16),
			alpha);
	}

	function mk_top_pattern(ctx, hstart, hend, color) {
	//	#fa9632
		var p = ctx.createLinearGradient(0, hstart, 0, hend);
		var c0 = parseColor(color, 1);
		var c1 = parseColor(color, 0.7);
		p.addColorStop(  0, c0);
		p.addColorStop(0.4, c0);
		p.addColorStop(0.6, c1);
		p.addColorStop(  1, c1);
		return p;
	}

	function mk_bottom_pattern(ctx, hstart, hend, color) {
	//	#3296fa
		var p = ctx.createLinearGradient(0, hstart, 0, hend);
		var c0 = parseColor(color, 1);
		var c1 = parseColor(color, 0.7);
		p.addColorStop(  0, c0);
		p.addColorStop(0.4, c0);
		p.addColorStop(0.6, c1);
		p.addColorStop(  1, c1);
		return p;
	}

	function wfSamples_count(wfs) {
		return wfs.size.width - (wfs.indenting.sspace * 2);
	}

	function drawFrame(_wfStyle, _ctx) {
		_ctx.strokeStyle = 'rgba(0, 0, 0, .2)';
		_ctx.beginPath();
		_ctx.lineTo(0, 0.5);
		_ctx.lineTo(_wfStyle.size.width - 1, 0.5);
		_ctx.lineTo(_wfStyle.size.width - 1, _wfStyle.size.height - 0.5);
		_ctx.lineTo(0, _wfStyle.size.height - 0.5);
		_ctx.lineTo(0, 0.5);
		_ctx.stroke();
	}

	function draw_waveform(_wfStyle, _peakSet, options) {
		var result = {};
		var outStreamsCount = 0;

		for (var s in _wfStyle) {
			var style = _wfStyle[s];

			var canvas = new Canvas(style.size.width, style.size.height);
			var ctx = canvas.getContext('2d');

			ctx.imageSmoothingEnabled = style.rendering.smooth ? true : false;
			ctx.lineWidth = style.rendering.lineWidth;
		//	ctx.globalAlpha = 1;

			ctx.translate(0.5, 0);

//			if (style.frame) {
				drawFrame(style, ctx);
//			}

			ctx.translate(0, style.size.height / 2);

			var peaks = _peakSet[s];
			var hstart = (style.indenting.hspace / 2);

			for (var i = 0; i < wfSamples_count(style); i ++) {
				var hend = (peaks[i] * ((style.size.height / 2) - hstart)) + hstart;
				var vpos = style.indenting.sspace + i;

				ctx.strokeStyle = mk_top_pattern(ctx, - hstart, - hend, style.colors.positive);
				ctx.beginPath();
				ctx.lineTo(vpos, - hstart);
				ctx.lineTo(vpos, - hend);
				ctx.stroke();

				ctx.strokeStyle = mk_bottom_pattern(ctx, hstart, hend, style.colors.negative);
				ctx.beginPath();
				ctx.lineTo(vpos, hstart);
				ctx.lineTo(vpos, hend);
				ctx.stroke();
			}

			if (options && options.asDataURL) {
				result[s] = canvas.toDataURL();
			}
			else {
				result[s] = canvas.pngStream();
			}

		}

		return result;
	}

	module.exports = draw_waveform;

})();
