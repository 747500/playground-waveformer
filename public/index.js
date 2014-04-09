
$(function () {

	var $form = $('form');
	var form = {
		schema: {
			type: 'object',
			properties: {
				preproc: {
					type: 'object',
					title: 'Препроцессинг',
					properties: {
						maximize: {
							type: 'boolean',
							title: 'preproc.maximize',
							description: 'Усиление/нормализация',
							required: true
						},
						log10: {
							type: 'boolean',
							title: 'preproc.log10',
							description: 'Логарифмическая шкала',
							required: true
						}
					}
				},
				rendering: {
					type: 'object',
					title: 'Рендеринг',
					properties: {
						smooth: {
							type: 'boolean',
							title: 'rendering.smooth',
							description: 'Использовать сглаживание',
							required: true
						},
						lineWidth: {
							type: 'number',
							title: 'rendering.lineWidth',
							description: 'Толщина инструмента',
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
							title: 'size.width',
							description: 'Ширина картинки',
							required: true
						},
						height: {
							type: 'integer',
							title: 'size.height',
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
							title: 'indenting.sspace',
							description: 'Ширина отступов слева и справа',
							required: true
						},
						hspace: {
							type: 'integer',
							title: 'indenting.hspace',
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
							title: 'colors.positive',
							description: 'Цвет верхней части'
						},
						negative: {
							type: 'color',
							title: 'colors.negative',
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
