$(document).ready(function() {
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			for(let i = 0; i < response.length; i++) {
				// console.log(response[i]['files'])
				
				let main = $("<tr>" +
					"<td><div class='action-icons'>" +
						"<i class='bi bi-pencil-square'></i> <i class='bi bi-trash3'></i>" +
					"</div></td>" +
					"<th scope='row'>" + response[i]['user_id'] + "</th>" +
					"<td>" + response[i]['user_firstName'] + "</td>" +
					"<td>" + response[i]['user_lastName'] + "</td>" +
					"<td>" + response[i]['user_userName'] + "</td>" +
				"</tr>")
				
				let td = $("<td></td>")
				let ul = $("<ul class='list-group list-group-flush '></ul>")
				td.append(ul)
				main.append(td)
				$('tbody').append(main)
					for (let j = 0; j < response[i]['files'].length; j++) {
						let li = $("<li class='list-group-item' value='"+response[i]['files'][j]['file_id']+"'>"+
							"<div class='files'>" +
								"<p>" + response[i]['files'][j]['file_path'] + "</p>" +
								"<div class='files-icons'>" +
									"<i class='bi bi-download'></i>" +
									"<i class='bi bi-x-lg'></i>" +
								"</div>" +
							"</div>" +
						"</li>")
						ul.append(li)
					}
				main.append("<td><div class='input-div'>" +
						"<label for='file-input' class='form-label'>Upload File</label>" +
						"<input class='form-control file-input' type='file'>" +
					"</div>" +
					"<div class='upload-button-div mt-2'>" +
						"<button type='button' class='btn btn-primary upload-button'>Upload</button>" +
					"</div></td>")
			}
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
		// console.log(e)
		// ------------------------------- CLICK EDIT BUTTON --------------------------------
		if(e.target.classList[1] === 'bi-pencil-square') {
			// MODAL OPEN
			let userid_val = e.target.parentNode.parentNode.parentNode.childNodes[1].childNodes[0].textContent
			let firstname_val = e.target.parentNode.parentNode.parentNode.childNodes[2].childNodes[0].textContent
			let lastname_val = e.target.parentNode.parentNode.parentNode.childNodes[3].childNodes[0].textContent
			let username_val = e.target.parentNode.parentNode.parentNode.childNodes[4].childNodes[0].textContent
			
			$('.popup-overlay-edit, .popup-content-edit').addClass('active')
			$('#modal-firstName').val(firstname_val)
			$('#modal-lastName').val(lastname_val)
			$('#modal-userName').val(username_val)
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
						current_userid: userid_val
					}),
					success: function(response) {
						$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
						$('#successText').val("User successfully updated!")
						$('#successAlert').css('display', 'flex')
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
		else if(e.target.classList[1] === 'bi-trash3') {
			$('.popup-overlay-delete, .popup-content-delete').addClass('active')
			
			$('.delete-submit').on('click', function() {
				$.ajax({
					url: '/delete_user',
					type: 'POST',
					contentType: 'application/json',
					data: JSON.stringify({
						userName: 'userName'
					}),
					success: function() {
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
			
			}
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
		$('#successAlert').css('display', 'none')
	});
	//------------------------------------- FAIL ALERT CLOSE -------------------------------------
	$('#failX').on('click', function() {
		$('#failAlert').css('display', 'none')
	});
	// ------------------------------------- PAGE REDIRECT -------------------------------------
	$('#landing-redirect').on('click', function() {
		window.location.href = '/index'
	});
	
	$('#back-home').on('click', function() {
		window.location.href = '/'
	})
});