
$(function () {

	var $form = $('form');
	var form = {
		schema: {
			type: 'object',
			properties: {
				rendering: {
					type: 'object',
					title: 'Рендеринг',
					properties: {
						smooth: {
							type: 'boolean',
							title: 'smooth',
							description: 'Использовать сглаживание',
							required: true
						}
					},
				},
				size: {
					type: 'object',
					title: 'Размеры',
					properties: {
						width: {
							type: 'integer',
							title: 'width',
							description: 'Ширина картинки',
							required: true
						},
						height: {
							type: 'integer',
							title: 'height',
							description: 'Высота каритинки',
							required: true
						}
					}
				},
				indenting: {
					type: 'object',
					title: 'Отступы',
					properties: {
						sspace: {
							type: 'integer',
							title: 'sspace',
							description: 'Ширина отступов слева и справа',
							required: true
						},
						hspace: {
							type: 'integer',
							title: 'hspace',
							description: 'Высота отступа между верхом и низом',
							required: true
						}
					}
				},
				colors: {
					type: 'object',
					title: 'Цвет',
					properties: {
						positive: {
							type: 'color',
							title: 'positive',
							description: 'Цвет верхней части'
						},
						negative: {
							type: 'color',
							title: 'negative',
							description: 'Цвет нижней части'
						}
					}
				}
			}
		}
	};

	$.ajax({
		url: 'default.json',
		method: 'GET',
		contentType: 'application/json',
		success: function (content, status) {
			showForm(content);
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

		console.log('+', JSON.stringify(values, null, 2));

//		return;


		$.ajax({
			url: '/gen',
			method: 'POST',
			contentType: 'application/json',
			data: JSON.stringify(values, null, 2),
			success: function (content, status) {
	//			console.log('+', content, status);
				$('div.content', 'div#wf-img').html(content);
			},
			error: function (content, status) {
				console.log('!', content, status);
			}
		});

	}

	function showForm(formdata) {
		$form.html('');
		$form.jsonForm({
			schema: form.schema,
			onSubmit: postFormData,
			value: formdata
		});
	}

});
