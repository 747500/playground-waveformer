
$(function () {

	var form = {
		schema: {
			smooth: {
				type: 'boolean',
				title: 'smooth',
				description: 'Enable smoothing',
				required: true
			},
			width: {
				type: 'integer',
				title: 'width',
				description: 'Width of result picture',
				required: true
			},
			height: {
				type: 'integer',
				title: 'height',
				description: 'Height of result picture',
				required: true
			},
			sspace: {
				type: 'integer',
				title: 'sspace',
				description: 'Left&right padding space',
				required: true
			},
			hspace: {
				type: 'integer',
				title: 'hspace',
				description: 'Space between positive and' +
						' negative parts of waveform',
				required: true
			}
		}
	};

	$.ajax({
		url: 'default.json',
		method: 'GET',
		contentType: 'application/json',
		success: function (content, status) {
			var formdata = [ ];
			_(content).each(function (value, name) {
				if (form.schema[name]) {
					form.schema[name].default = value;
				}
			});

			showForm(formdata);
		},
		error: function (content, status) {
			console.log('!', content, status);
		}
	});

	function postFormData(errors, values) {

		if (errors) {
			console.log('!', errors);
			return;
		}

		$.ajax({
			url: '/gen',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(values, null, 2),
			success: function (content, status) {
//				console.log('+', content, status);
				$('div.content', 'div#wf-img').html(content);
			},
			error: function (content, status) {
				console.log('!', content, status);
			}
		});

	}

	function showForm() {
		$('form').jsonForm({
			schema: form.schema,
			onSubmit: postFormData
		});
	}

});
