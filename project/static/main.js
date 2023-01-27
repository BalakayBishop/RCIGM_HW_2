$(document).ready(function() {
	// ------------------------------------- PAGE REDIRECT -------------------------------------
	$('#landing-redirect').on('click', function() {
		window.location.href = '/index'
	});
	
	$('#back-home').on('click', function() {
		window.location.href = '/'
	})
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			for(let i = 0; i < response.length; i++) {
				let main = $("<tr id='"+ response[i]['user_id'] +"'>" +
					"<td><div class='action-icons'>" +
						"<i class='bi bi-pencil-square edit-user'></i> <i class='bi bi-trash3 delete-user'></i>" +
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
						let li = $("<li class='list-group-item' id='"+response[i]['files'][j]['file_id']+"'" +
							" value='"+response[i]['files'][j]['file_id']+"'>"+
							"<div class='files'>" +
								"<p>" + response[i]['files'][j]['file_path'] + "</p>" +
								"<div class='files-icons'>" +
									"<i class='bi bi-download'></i>" +
									"<i class='bi bi-x-lg delete-file'></i>" +
								"</div>" +
							"</div>" +
						"</li>")
						ul.append(li)
					}
				main.append("<td>" +
					"<div class='input-div'>" +
						"<label for='file-input' class='form-label'>Upload File</label>" +
						"<input class='form-control file-input' type='file'>" +
					"</div>" +
					"<div class='upload-button-div mt-2'>" +
						"<button type='button' class='btn btn-primary upload-button'>Upload</button>" +
					"</div>" +
				"</td>")
			}
		},
		error: function(jqXHR) {
			if (jqXHR.status === 400) {
			
			}
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
					$('tbody').append("<tr>" +
					"<td class='td-action-icons'><div class='action-icons'>" +
						"<i class='bi bi-pencil-square'></i> <i class='bi bi-trash3'></i>" +
					"</div></td>" +
					"<th scope='row'>" + response['id'] + "</th>" +
					"<td class='td-firstname'>" + response['firstName'] + "</td>" +
					"<td class='td-lastname'>" + response['lastName'] + "</td>" +
					"<td class='td-username'>" + response['userName'] + "</td>" +
					"<td class='td-file-list'><ul class='list-group list-group-flush '></ul></td>" +
					"<td class='td-upload-file'><div class='input-div'>" +
						"<label for='file-input' class='form-label'>Upload File</label>" +
						"<input class='form-control file-input' type='file'>" +
					"</div>" +
					"<div class='upload-button-div mt-2'>" +
						"<button type='button' class='btn btn-primary upload-button'>Upload</button>" +
					"</div></td>" +
				"</tr>")
				
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
			error: function(jqXHR) {
				if (jqXHR.status === 400) {
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
			}
		})
	});
	
	// ------------------------------------- EDIT USER MODAL -------------------------------------
	$("#user-table").on("click", "td .edit-user", function() {
		let $tr_id = $(this).closest('tr').attr('id')
		$('#modal-submitButton').prop('disabled', true)
		let userid_val = $(this).closest('tr').find('th').text()
		let firstname_val = $(this).closest('tr').find('td:eq(1)').text()
		let lastname_val = $(this).closest('tr').find('td:eq(2)').text()
		let username_val = $(this).closest('tr').find('td:eq(3)').text()
		$('.popup-overlay-edit, .popup-content-edit').addClass('active')
		$('#modal-firstName').val(firstname_val)
		$('#modal-lastName').val(lastname_val)
		$('#modal-userName').val(username_val)
		let input_firstname = false;
		let input_lastname = false;
		let input_username = false;
		$('#modal-firstName').on('change', function() {
			input_firstname = true
			allChanged()
		})
		$('#modal-lastName').on('change', function() {
			input_lastname = true
			allChanged()
		})
		$('#modal-userName').on('change', function() {
			input_username = true
			allChanged()
		})
		function allChanged() {
			if (input_firstname || input_lastname || input_username) {
				$('#modal-submitButton').prop('disabled', false)
			}
			else {
				$('#modal-submitButton').prop('disabled', true)
			}
		}
			// --------------------------------- MODAL FORM SUBMISSION ----------------------------------
		$('#modal-submitButton').on('click', function(event) {
			event.preventDefault()
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
					$("#"+$tr_id).find('th').text(response['user_id'])
					$("#"+$tr_id).find('td:eq(1)').text(response['firstName'])
					$("#"+$tr_id).find('td:eq(2)').text(response['lastName'])
					$("#"+$tr_id).find('td:eq(3)').text(response['userName'])

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
				error: function(jqXHR) {
					if (jqXHR.status === 400) {
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
				}
			})
		});
	}); // ----- END OF EDIT USER MODAL -----
	
	// ------------------------------------- DELETE USER MODAL -------------------------------------
	$("#user-table").on("click", "td .delete-user", function(event) {
		event.preventDefault()
		let $tr_id = $(this).closest('tr').attr('id')
		console.log($tr_id)
		$('.popup-overlay-delete, .popup-content-delete').addClass('active')
		let userid_val = $(this).closest('tr').find('th').text()
		let firstname_val = $(this).closest('tr').find('td:eq(1)').text()
		let lastname_val = $(this).closest('tr').find('td:eq(2)').text()
		let username_val = $(this).closest('tr').find('td:eq(3)').text()
		$('#infoList').append("<li class='list-group-item'>User ID: " + userid_val + " </li>" +
			"<li class='list-group-item'>First Name: " + firstname_val + "</li>" +
			"<li class='list-group-item'>Last Name: " + lastname_val + "</li>" +
			"<li class='list-group-item'>Username: " + username_val + "</li>")
		$('.delete-submit').on('click', function() {
			$.ajax({
				url: '/delete_user',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					user_id: $tr_id
				}),
				success: function() {
					$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
					$("#"+$tr_id).remove();
					$('#infoList').html('')
					$('#successText').text('User successfully deleted!')
					$('#successAlert').css('display', 'flex')
					$('#failAlert').css('display', 'none')
					setTimeout(function() {
						$('#successAlert').fadeOut(125)
					}, 2000);
				},
				error: function() {
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
	}); // ----- END OF DELETE USER MODAL -----
	
	// ------------------------------------- DELETE FILE MODAL -------------------------------------
	$("#user-table").on("click", "td .delete-file", function(event) {
		event.preventDefault()
		$('.popup-overlay-delete-file, .popup-content-delete-file').addClass('active')
			let $file_id = $(this).closest('li').attr('id')
			let $file_name = $(this).closest('div.files').find('p').text()
			$('#file-info').text($file_name)

			$('.delete-file-submit').on('click', function() {
				$.ajax({
				url: '/delete_file',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					file_id: $file_id
				}),
				success: function() {
					$('.popup-overlay-delete-file, .popup-content-delete-file').removeClass('active')
					$("#"+$file_id).remove()
					$('#file-info').text('')
					$('#successText').text('File successfully deleted!')
					$('#successAlert').css('display', 'flex')
					$('#failAlert').css('display', 'none')
					setTimeout(function() {
						$('#successAlert').fadeOut(125)
					}, 2000);
				},
				error: function() {
					$('.popup-overlay-delete-file, .popup-content-delete-file').removeClass('active')
					$('#file-info').text('')
					$('#failedText').text('File deletion failed!')
					$('#failAlert').css('display', 'flex')
					$('#successAlertAlert').css('display', 'none')
					setTimeout(function() {
						$('#failAlert').fadeOut(125)
					}, 2000);
				}
			});
		});
	}); // ----- END OF DELETE FILE -----
	// 	// UPLOAD FILE FUNCTION
	// 	else if(e.target.classList[2] === 'upload-button') {
	// 		let fileName = $(e.target).closest('tr').find('td:eq(5) input').val()
	// 		fileName = fileName.replace("C:\\fakepath\\", "")
	// 		if(fileName !== '') {
	// 			let user_id = $(e.target).closest('tr').find('th').text()
	// 			$.ajax({
	// 				url: '/upload',
	// 				type: 'POST',
	// 				contentType: 'application/json',
	// 				data: JSON.stringify({
	// 					user_id: user_id,
	// 					fileName: fileName
	// 				}),
	// 				success: function(response) {
	// 					let new_li = $("<li class='list-group-item' value='"+ response['file_id']+"'>" +
	// 						"<div class='files'>" +
	// 						"<p>" + response['path'] + "</p>" +
	// 						"<div class='files-icons'>" +
	// 							"<i class='bi bi-download'></i><i class='bi bi-x-lg'></i>" +
	// 						"</div>" +
	// 						"</div>" +
	// 						"</li>");
	// 					let $list = $(e.target).closest('tr').find('td:eq(4) ul');
	// 					$list.append(new_li);
	// 					$(e.target).closest('tr').find('td:eq(5) input').val('')
	// 					$('#successText').text('File successfully uploaded!')
	// 					$('#successAlert').css('display', 'flex')
	// 					$('#failAlert').css('display', 'none')
	// 					setTimeout(function() {
	// 						$('#successAlert').fadeOut(125)
	// 					}, 2000);
	// 				},
	// 				error: function() {
	// 					$('#failedText').text('File upload failed!')
	// 					$('#failAlert').css('display', 'flex')
	// 					setTimeout(function() {
	// 						$('#failAlert').fadeOut(125)
	// 					}, 2000);
	// 				}
	// 			})
	// 		}
	// 	}
	// }); // end of table.click
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
					$('#modal-submitButton').prop('disabled', true)
					$('#modal-available').css('display', 'none')
					$('#modal-taken').css('display', 'block')
				}
				else if (response['class'] === 'none') {
					$('.modal-username').removeClass('success fail')
					$('#modal-submitButton').prop('disabled', true)
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
});