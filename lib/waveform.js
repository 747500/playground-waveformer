

(function () {

	"use strict";

	var util = require('util');
	var fs = require('fs');
	var constants = require('constants');
	var http = require('http');
	var path = require('path');
	var _ = require('underscore');

	var Canvas = require('canvas');

	function mk_top_pattern(ctx, hstart, hend) {
		var p = ctx.createLinearGradient(0, hstart, 0, hend);
		p.addColorStop(  0, 'rgba(250, 150, 50, 1)');
		p.addColorStop(0.4, 'rgba(250, 150, 50, 1)');
		p.addColorStop(0.6, 'rgba(250, 150, 50, 0.7)');
		p.addColorStop(  1, 'rgba(250, 150, 50, 0.7)');
		return p;
	}

	function mk_bottom_pattern(ctx, hstart, hend) {
		var p = ctx.createLinearGradient(0, hstart, 0, hend);
		p.addColorStop(  0, 'rgba(50, 150, 250, 1)');
		p.addColorStop(0.4, 'rgba(50, 150, 250, 1)');
		p.addColorStop(0.6, 'rgba(50, 150, 250, 0.7)');
		p.addColorStop(  1, 'rgba(50, 150, 250, 0.7)');
		return p;
	}

	function wfSamples_count(wfs) {
		return wfs.width - (wfs.sspace * 2);
	}

	function drawFrame(_wfStyle, _ctx) {
		_ctx.strokeStyle = 'rgba(0, 0, 0, .2)';
		_ctx.beginPath();
		_ctx.lineTo(0, 0.5);
		_ctx.lineTo(_wfStyle.width - 1, 0.5);
		_ctx.lineTo(_wfStyle.width - 1, _wfStyle.height - 0.5);
		_ctx.lineTo(0, _wfStyle.height - 0.5);
		_ctx.lineTo(0, 0.5);
		_ctx.stroke();
	}

	function draw_waveform(_wfStyle, _peakSet, options) {
		var result = {};
		var outStreamsCount = 0;

		for (var s in _wfStyle) {
			var style = _wfStyle[s];

			var canvas = new Canvas(style.width, style.height);
			var ctx = canvas.getContext('2d');

			ctx.imageSmoothingEnabled = style.smooth ? true : false;
		//	ctx.lineWidth = 1;
		//	ctx.globalAlpha = 1;

			ctx.translate(0.5, 0);

			if (style.frame) {
				drawFrame(style, ctx);
			}

			ctx.translate(0, style.height / 2);

			var peaks = _peakSet[s];
			var hstart = (style.hspace / 2);

			for (var i = 0; i < wfSamples_count(style); i ++) {
				var hend = (peaks[i] * ((style.height / 2) - hstart) + 1) + hstart;
				var vpos = style.sspace + i;

				ctx.strokeStyle = mk_top_pattern(ctx, - hstart, - hend);
				ctx.beginPath();
				ctx.lineTo(vpos, - hstart);
				ctx.lineTo(vpos, - hend);
				ctx.stroke();

				ctx.strokeStyle = mk_bottom_pattern(ctx, hstart, hend);
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

