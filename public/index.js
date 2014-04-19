
$(function () {

	var $form = $('form');
	var form = {
		schema: {
			type: 'object',
			properties: {
				sampling: {
					type: 'object',
					title: 'Ресэмплинг',
					properties: {
						type: {
							type: 'string',
							title: 'Способ усреднения',
							description: 'sampling.type',
							enum: [ 'average', /* 'geometric', */ 'maximum' ]
						}
					}
				},
				preproc: {
					type: 'object',
					title: 'Препроцессинг',
					properties: {
						maximize: {
							type: 'boolean',
							title: 'Нормализация',
							description: 'preproc.maximize',
							required: true
						},
						log10: {
							type: 'boolean',
							title: 'Логарифмическая шкала',
							description: 'preproc.log10',
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
							title: 'Сглаживание',
							description: 'rendering.smooth',
							required: true
						},
						lineWidth: {
							type: 'number',
							title: 'Толщина инструмента',
							description: 'rendering.lineWidth',
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
							title: 'Ширина картинки',
							description: 'size.width',
							required: true
						},
						height: {
							type: 'integer',
							title: 'Высота каритинки',
							description: 'size.height',
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
							title: 'Отступ слева и справа',
							description: 'indenting.sspace',
							required: true
						},
						hspace: {
							type: 'integer',
							title: 'Отступ между верхом и низом',
							description: 'indenting.hspace',
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
							titile: 'Цвет верхней части',
							description: 'colors.positive'
						},
						negative: {
							type: 'color',
							titile: 'Цвет нижней части',
							description: 'colors.negative'
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
