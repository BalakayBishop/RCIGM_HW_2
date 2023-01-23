$(document).ready(function() {
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			for(let i = 0; i < response.length; i++) {}
		},
		fail: function() {
		
		}
	});
	// ------------------------------------- USERNAME VALIDATION -------------------------------------
	$('.username').on('input', function() {
		$.ajax({
			url: '/username_validation',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				input: $(this).val()
			}),
			success: function(response) {
				if (response['class'] === 'success') {
					$('.username').addClass('success')
					$('.username').removeClass('fail')
					$('#submitButton').prop('disabled', false)
					$('#available').css('display', 'block')
					$('#taken').css('display', 'none')
				}
				else if (response['class'] === 'fail') {
					$('.username').addClass('fail')
					$('.username').removeClass('success')
					$('#submitButton').prop('disabled', true)
					$('#available').css('display', 'none')
					$('#taken').css('display', 'block')
				}
				else if (response['class'] === 'none') {
					$('.username').removeClass('fail', 'success')
					$('#submitButton').prop('disabled', false)
					$('#available').css('display', 'none')
					$('#taken').css('display', 'none')
				}
			}
		})
	});
	
	// ------------------------------------- FORM SUBMISSION -------------------------------------
	$('#submitButton').on('click', function(event) {
		event.preventDefault()
		$.ajax({
			url: '/new_user',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				firstName: $('#firstName').val(),
				lastName: $('#lastName').val(),
				userName: $('#userName').val()
			}),
			success: function(response) {
				$('#successText').text('User successfully created!')
				$('#successAlert').css('display', 'flex')
				setTimeout(function() {
					$('#successAlert').fadeOut(125)
				}, 2000);
				$('#form')[0].reset()
				$('.username').removeClass('success fail')
				$('#submitButton').prop('disabled', false)
				$('#available').css('display', 'none')
				$('#taken').css('display', 'none')
			},
			fail: function() {
				$('#form')[0].reset()
				$('#failedText').text('User creation failed!')
				$('#failAlert').css('display', 'flex')
				$('.username').removeClass('success fail')
				$('#submitButton').prop('disabled', false)
				$('#available').css('display', 'none')
				$('#taken').css('display', 'none')
				setTimeout(function() {
					$('#failAlert').fadeOut(125)
				}, 2000);
			}
		})
	});
	
	// ------------------------------------- MODALS FOR EDIT AND DELETE -------------------------------------
	$('table').on('click', function(e) {
		console.log(e)
		// ------------------------------- CLICK EDIT BUTTON --------------------------------
		if(e.target.classList[2] === 'table-buttons-edit') {
			// let firstName = e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent
			// firstName = firstName.replace('First Name: ', '')
			// let lastName = e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent
			// lastName = lastName.replace('Last Name: ', '')
			// let userName = e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent
			// userName = userName.replace('Username: ', '')
			// MODAL OPEN
			$('.popup-overlay-edit, .popup-content-edit').addClass('active')
			// $('#modal-firstName').val(firstName)
			// $('#modal-lastName').val(lastName)
			// $('#modal-userName').val(userName)
			// let currentUsername = userName
			// --------------------------------- MODAL FORM SUBMISSION ----------------------------------
			$('#modal-submitButton').on('click', function(e2) {
				e2.preventDefault()
				$.ajax({
					url: '/update_user',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						firstName: $('#modal-firstName').val(),
						lastName: $('#modal-lastName').val(),
						userName: $('#modal-userName').val(),
						currentUsername: currentUsername
					}),
					success: function(response) {
						$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
						$('#successText').val("User successfully updated!")
						$('#successAlert').css('display', 'flex')
						e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent = "First Name: " + response['firstName']
						e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent = "Last Name: " + response['lastName']
						e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent = "Username: " + response['userName']
						setTimeout(function() {
							$('#successAlert').fadeOut(125)
						}, 2000);
						$('#modal-form')[0].reset()
						$('#modal-available').css('display', 'none')
						$('#modal-taken').css('display', 'none')
						$('#modal-submitButton').prop('disabled', false)
						$('.modal-username').removeClass('success fail')
					},
					fail: function() {
						$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
						$('#modal-form')[0].reset()
						$('#failedText').text('User update failed!')
						$('#successAlert').css('display', 'none')
						$('#failAlert').css('display', 'flex')
						setTimeout(function() {
							$('#failAlert').fadeOut(125)
						}, 2000);
						$('#modal-available').css('display', 'none')
						$('#modal-taken').css('display', 'none')
						$('#modal-submitButton').prop('disabled', false)
						$('.modal-username').removeClass('success fail')
					}
				})
			});
		}
		// ------------------------------- CLICK DELETE BUTTON --------------------------------
		else if(e.target.classList[2] === 'list-buttons-delete') {
			let firstName = e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent
			firstName = firstName.replace('First Name: ', '')
			let lastName = e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent
			lastName = lastName.replace('Last Name: ', '')
			let userName = e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent
			userName = userName.replace('Username: ', '')
			let li = e.target.parentNode.parentNode.parentNode
			$('.popup-overlay-delete, .popup-content-delete').addClass('active')
			$('#infoList').append("<li class='list-group-item'>First Name: " + firstName + "</li>" +
				"<li class='list-group-item'>Last Name: " + lastName + "</li>" +
				"<li class='list-group-item'>Username: " + userName + "</li>");
			$('.delete-submit').on('click', function() {
				$.ajax({
					url: '/delete_user',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						userName: userName
					}),
					success: function() {
						li.parentNode.removeChild(li)
						$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
						$('#infoList').html('')
						$('#successText').text('User successfully deleted!')
						$('#successAlert').css('display', 'flex')
						$('#failAlert').css('display', 'none')
						setTimeout(function() {
							$('#successAlert').fadeOut(125)
						}, 2000);
					},
					fail: function() {
						$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
						$('#infoList').html('')
						$('#failedText').text('User deletion failed!')
						$('#successAlert').css('display', 'none')
						$('#failAlert').css('display', 'flex')
						setTimeout(function() {
							$('#failAlert').fadeOut(125)
						}, 2000);
					}
				})
			});
		}
		// UPLOAD FILE FUNCTION
		else if(e.target.classList[2] === 'upload') {
			let fileinput = $(e.target).parent().siblings('div.file-input').children('input.formFile')
			let fileName = fileinput.val()
			fileName = fileName.replace('C:\\fakepath\\', '')
			$(fileinput).on('change', function() {
				fileinput.removeClass('file-input-fail')
			})
			if(fileName !== '') {
				let userName = $(e.target).parent().siblings('div.li-inner').children('div.li-p-div').children(':eq(2)').text()
				userName = userName.replace('Username: ', '')
				$.ajax({
					url: '/upload',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						userName: userName,
						fileName: fileName
					}),
					success: function(response) {
						fileinput.val('')
						let fileslist = $(e.target).parent().siblings('ul.files-list')
						fileslist.css('display', 'block')
						fileslist.append("<li class='list-group-item files-list-item'><p>" +
								response['path'] + "</p>" +
							"<input type='hidden' value='" + response['file_id'] + "'>" +
							"<div class='file-icons'><i class='bi bi-download'></i>" +
							"<i class='bi bi-x-lg'></i></div></li>")
						$('#successText').text('File successfully uploaded!')
						$('#successAlert').css('display', 'flex')
						$('#failAlert').css('display', 'none')
						setTimeout(function() {
							$('#successAlert').fadeOut(125)
						}, 2000);
					},
					fail: function() {
						$('#failedText').text('File upload failed!')
						$('#failAlert').css('display', 'flex')
						setTimeout(function() {
							$('#failAlert').fadeOut(125)
						}, 2000);
					}
				})
			}
			else {
				fileinput.addClass('file-input-fail')
			}
		}
		// DOWNLOAD FILE FUNCTION
		else if (e.target.classList[1] === 'bi-download') {
			let file_id = $(e.target).parent('div.file-icons').siblings('input').val()
			
		}
		// DELETE FILE FUNCTION
		else if (e.target.classList[1] === 'bi-x-lg') {
			let file_id = e.target.parentNode.previousSibling.value
			let file = e.target.parentNode.parentNode.childNodes[0].textContent
			$('.popup-overlay-delete-file, .popup-content-delete-file').addClass('active')
			$('#file-info').text(file)
			let li = e.target.parentNode.parentNode
			$('.delete-file-submit').on('click', function() {
				$.ajax({
					url: '/delete_file',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						file_id: file_id
					}),
					success: function() {
						$('.popup-overlay-delete-file, .popup-content-delete-file').removeClass('active')
						li.parentNode.removeChild(li)
						$('#file-info').text('')
						$('#successText').text('File successfully deleted!')
						$('#successAlert').css('display', 'flex')
						setTimeout(function() {
							$('#successAlert').fadeOut(125)
						}, 2000);
					}
				});
			});
		}
		
		// EDIT MODAL CLOSED
		$('.close-edit').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			$('#modal-form')[0].reset()
			$('#modal-available').css('display', 'none')
			$('#modal-taken').css('display', 'none')
			$('.modal-username').removeClass('success fail')
			$('#modal-submitButton').prop('disabled', false)
		});
		// EDIT MODAL CLOSE X
		$('.modal-xmark-edit').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			$('#modal-form')[0].reset()
			$('#modal-available').css('display', 'none')
			$('#modal-taken').css('display', 'none')
			$('.modal-username').removeClass('success fail')
			$('#modal-submitButton').prop('disabled', false)
		});
		// DELETE MODAL CLOSE
		$('.close-delete').on('click', function() {
			$('.popup-overlay-delete, .popup-content-delete, .popup-overlay-delete-file, .popup-content-delete-file')
				.removeClass('active')
			$('#infoList').html('')
			$('#file-info').text('')
		});
		// DELETE MODAL CLOSE X
		$('.modal-xmark-delete').on('click', function() {
			$('.popup-overlay-delete, .popup-content-delete, .popup-overlay-delete-file, .popup-content-delete-file')
				.removeClass('active')
			$('#infoList').html('')
			$('#file-info').text('')
		});
	});
	// ------------------------------------- MODAL USERNAME VALIDATION -------------------------------------
	$('.modal-username').on('input', function() {
		$.ajax({
			url: '/username_validation',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				input: $(this).val()
			}),
			success: function(response) {
				if (response['class'] === 'success') {
					$('.modal-username').addClass('success')
					$('.modal-username').removeClass('fail')
					$('#modal-submitButton').prop('disabled', false)
					$('#modal-available').css('display', 'block')
					$('#modal-taken').css('display', 'none')
				}
				else if (response['class'] === 'fail') {
					$('.modal-username').addClass('fail')
					$('.modal-username').removeClass('success')
					$('#modal-submitButton').prop('disabled', false)
					$('#modal-available').css('display', 'none')
					$('#modal-taken').css('display', 'block')
				}
				else if (response['class'] === 'none') {
					$('.modal-username').removeClass('success fail')
					$('#modal-submitButton').prop('disabled', false)
					$('#modal-available').css('display', 'none')
					$('#modal-taken').css('display', 'none')
				}
			}
		})
	});
	// ------------------------------------- SUCCESS ALERT CLOSE -------------------------------------
	$('#successX').on('click', function() {
		$('#successAlert').hide()
	});
	//------------------------------------- FAIL ALERT CLOSE -------------------------------------
	$('#failX').on('click', function() {
		$('#failAlert').hide()
	});
	// ------------------------------------- PAGE REDIRECT -------------------------------------
	$('#landing-redirect').on('click', function() {
		window.location.href = '/index'
	});
	
	$('#back-home').on('click', function() {
		window.location.href = '/'
	})
});