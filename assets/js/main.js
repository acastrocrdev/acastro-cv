let acastro_cv = {
	returnValue: null,

	init: () => {
		acastro_cv.aos();
		acastro_cv.smooth();
		acastro_cv.contact();
		acastro_cv.formValidator();
		acastro_cv.portfolioUpdate();
	},

	aos: () => {
		AOS.init({
			once: true,
		});
	},
	smooth: () => {
		$('a.smooth-scroll').click(function (event) {
			if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
				var target = $(this.hash);
				target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
				if (target.length) {
					event.preventDefault();
					$('html, body').animate(
						{
							scrollTop: target.offset().top,
						},
						1000,
						function () {
							var $target = $(target);
							$target.focus();
							if ($target.is(':focus')) {
								return false;
							} else {
								$target.attr('tabindex', '-1');
								$target.focus();
							}
						}
					);
				}
			}
		});
	},
	contact: () => {
		$('#contact_me').submit(function (e) {
			e.preventDefault();
		});

		$('#sendContact').off('click');
		$('#sendContact').on('click', function (e) {
			if ($('#contact_me').valid()) {
				if (grecaptcha.getResponse() != '') {
					acastro_cv.returnValue = $('#sendContact').html();
					$('#sendContact').attr('disabled', true).addClass('boxed-btn3_send').html('Enviando mensaje...');
					acastro_cv.showNotification('info', 'Enviando correo', 'Por favor espere...');
					$.post(
						apiPath,
						{
							public_action: 'dsabvdjasvcxas66_acvdsa',
							fullname: $('#fullname').val(),
							email: $('#email').val(),
							subject: $('#subject').val(),
							details: $('#details').val(),
							'g-recaptcha-response': grecaptcha.getResponse(),
						},
						function (data) {
							$('#sendContact').removeClass('boxed-btn3_send').addClass('boxed-btn3_sucess').html('Mensaje enviado. Muchas gracias.');
							if (data['status'] == 1) {
								acastro_cv.showNotification('success', 'Muchas gracias, pronto nos pondremos en contacto con usted.', 'Envio exitoso...');
								$('#fullname').val('').attr('disabled', true);
								$('#email').val('').attr('disabled', true);
								$('#subject').val('').attr('disabled', true);
								$('#details').val('').attr('disabled', true);
								$('').addClass('disabled');
							} else if (data['status'] == 2) {
								$('#sendContact').removeClass('boxed-btn3_send').removeAttr('disabled').html(acastro_cv.returnValue);
								acastro_cv.showNotification('error', 'Error al enviar el correo. Intente más tarde.', 'Por favor verifique...');
							} else if (data['status'] == 3) {
								$('#sendContact').removeClass('boxed-btn3_send').removeAttr('disabled').html(acastro_cv.returnValue);
								acastro_cv.showNotification('error', 'Por favor verifique que el Captcha este resuelto correctamente', 'Por favor verifique...');
							}
						}
					);
				} else {
					acastro_cv.showNotification('error', 'Por favor, resuelva el Captcha para continuar.', 'Por favor verifique...');
				}
			} else {
				acastro_cv.showNotification('error', 'Por favor, debe completar todos los campos de contacto.', 'Por favor verifique...');
			}
		});
	},
	showNotification: (type, message, title, closeTime) => {
		var cb = function (timewait) {
			setTimeout(function () {
				if (typeof type == 'undefined') type = 'error';
				if (typeof message == 'undefined' || message == '') message = 'No se ha definido un mensaje para la notificación';
				if (typeof title == 'undefined' || title == null) title = '';
				if (typeof closeTime != 'undefined' && $.isNumeric(closeTime)) toastr.options.timeOut = closeTime;
				switch (type) {
					case 'success':
					case 'Éxito':
					case '1':
					case 1:
						type = 'success';
						break;
					case 'error':
					case '2':
					case 2:
						type = 'error';
						break;
					case 'info':
					case 'infom':
					case 'info_show':
					case 3:
					case '3':
						type = 'info';
						break;
					case 'warning':
					case 'advertencia':
					case '4':
					case 4:
						type = 'warning';
						break;
				}
				toastr[type](message, title);
				if (typeof closeTime != 'undefined' && $.isNumeric(closeTime)) toastr.options.timeOut = '10000';
			}, timewait);
		};
		if ($('#toast-container').length > 0) {
			setTimeout(function () {
				toastr.clear();
				cb(1000);
			}, 1000);
		} else {
			cb(100);
		}
	},
	portfolioUpdate: () => {
		$('[data-portfolio]').off('click');
		$('[data-portfolio]').on('click', function (e) {
			ttt = this;
			e.preventDefault();
			let idTab = $(this).data('portfolio');
			$('#portfolio .tab-pane').removeClass('active');
			$('[data-portfolio]').removeClass('active');
			$('[data-portfolio=' + idTab + ']').addClass('active');
			$('#' + idTab).tab('show');
		});
	},
	formValidator: function () {
		jQuery.validator.addMethod(
			'answercheck',
			function (value, element) {
				return this.optional(element) || /^\bcat\b$/.test(value);
			},
			'Digite una respuesta correcta -_-'
		);
		$('#contact_me').validate({
			rules: {
				fullname: {
					required: true,
					minlength: 4,
				},
				email: {
					required: true,
					email: true,
				},
				subject: {
					required: true,
					minlength: 15,
				},
				details: {
					required: true,
					minlength: 30,
				},
			},
			messages: {
				fullname: {
					required: 'Por favor escriba su nombre, ya que deseo brindar una atención personalizada.',
					minlength: 'Su nombre debe contener más de 4 caracteres.',
				},
				email: 'Ocupamos un correo electrónico válido',
				subject: {
					required: 'Ocupamos que nos indique el motivo de su contacto.',
					minlength: 'Debe tener al menos 10 caracteres.',
				},
				details: {
					required: 'Expliqueme un poco más de detalle, en que consiste su contacto, necesidades y demás.',
					minlength: 'Brindeme un poco mas de detalle',
				},
			},
			submitHandler: function (form) {},
		});
	},
};

$(document).ready(function () {
	acastro_cv.init();
});
