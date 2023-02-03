$(document).ready(function() {
	// ----- PAGE REDIRECTS ------
	$('#landing-redirect-users').on('click', function() {
		window.location.href = '/index'
	});
	
	$('#landing-redirect-replica').on('click', function() {
		window.location.href = '/replica'
	});
	
	$('.back-home').on('click', function() {
		window.location.href = '/'
	})
	// ----- PAGE LOAD GET ------
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
				let ul = $("<ul id='ul-"+ response[i]['user_id'] +"' class='list-group list-group-flush'></ul>")
				td.append(ul)
				main.append(td)
				$('tbody').append(main)
					for (let j = 0; j < response[i]['files'].length; j++) {
						let li = $("<li class='list-group-item' id='"+response[i]['files'][j]['file_id']+"'>"+
							"<div class='files'>" +
								"<p>" + response[i]['files'][j]['file_path'] + "</p>" +
								"<div class='files-icons'>" +
									"<i class='bi bi-download download-file'></i>" +
									"<i class='bi bi-x-lg delete-file'></i>" +
								"</div>" +
							"</div>" +
						"</li>")
						ul.append(li)
					}
				main.append("<td>" +
					"<div class='input-div'>" +
						"<label for='file-input' class='form-label'>Upload File</label>" +
						"<input id='file-input-" + response[i]['user_id'] + "' class='form-control file-input'" +
					" type='file'>" +
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
	
	// ----- USERNAME VALIDATION ------
	$('.username').on('input', function() {
		let data = $(this).val()
		let input = '.username'
		let alert = '#username-alert'
		username_ajax(input, data, alert)
	});
	
	// ----- CREATE NEW USER ------
	$('#submitButton').on('click', function(event) {
		event.preventDefault()
		if ($('#firstName').val() !== '' && $('#lastName').val() !== '' && $('#userName').val() !== '') {
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
						$('tbody').append("<tr id='"+ response['user_id'] +"'>" +
						"<td class='td-action-icons'><div class='action-icons'>" +
							"<i class='bi bi-pencil-square edit-user'></i> <i class='bi bi-trash3 delete-user'></i>" +
						"</div></td>" +
						"<th scope='row'>" + response['user_id'] + "</th>" +
						"<td class='td-firstname'>" + response['firstName'] + "</td>" +
						"<td class='td-lastname'>" + response['lastName'] + "</td>" +
						"<td class='td-username'>" + response['userName'] + "</td>" +
						"<td class='td-file-list'><ul id='ul-"+ response['user_id'] +"' class='list-group" +
							" list-group-flush" +
							" '></ul></td>" +
						"<td class='td-upload-file'><div class='input-div'>" +
							"<label for='file-input' class='form-label'>Upload File</label>" +
							"<input id='file-input-" + response['user_id'] + "' class='form-control file-input' type='file'>" +
						"</div>" +
						"<div class='upload-button-div mt-2'>" +
							"<button type='button' class='btn btn-primary upload-button'>Upload</button>" +
						"</div></td>" +
					"</tr>")
					
					alert_func('#successAlert','User created successfully!')
					$('#form')[0].reset()
					$('.username').removeClass('success fail')
					$('#submitButton').prop({'disabled':false})
					$('#username-alert').css({'display':'none'})
				},
				error: function(jqXHR) {
					if (jqXHR.status === 400) {
						alert_func('#failAlert','User creation failed!')
						$('#form')[0].reset()
						$('.username').removeClass('success fail')
						$('#submitButton').prop({'disabled':false})
					}
				}
			});
		}
	});
	
	// ----- EDIT USER ------
	$("#user-table").on("click", ".edit-user", function() {
		let $tr_id = $(this).closest('tr').attr('id')
		let userid_val = $("#"+$tr_id).find('th').text()
		let firstname_val = $("#"+$tr_id).find('td:eq(1)').text()
		let lastname_val = $("#"+$tr_id).find('td:eq(2)').text()
		let username_val = $("#"+$tr_id).find('td:eq(3)').text()
		let input_firstname = false;
		let input_lastname = false;
		let input_username = false;
		$('#modal-firstName').on('change', function() {
			input_firstname = true
			allChanged()
		});
		$('#modal-lastName').on('change', function() {
			input_lastname = true
			allChanged()
		});
		$('#modal-userName').on('change', function() {
			input_username = true
			allChanged()
		});
		let content =
			"<div class='modalHeader'>" +
				"<h2>Edit User</h2>" +
				"<p><i class='fa-solid fa-xmark modal-x'></i></p>" +
			"</div>" +
			"<form id='modal-form' method='POST' class='needs-validation'>" +
				"<div class='form-floating mb-3'>" +
					"<input type='text' name='firstName' class='form-control' id='modal-firstName'" +
					" placeholder='John' required>" +
					"<label for='modal-firstName'>First Name</label>" +
				"</div>" +
				"<div class='form-floating mb-3'>" +
					"<input type='text' name='lastName' class='form-control' id='modal-lastName' placeholder='Doe'" +
					"   required>" +
					"<label for='modal-lastName'>Last Name</label>" +
				"</div>" +
				"<div class='form-floating mb-3'>" +
					"<input type='text' name='userName' class='form-control modal-username' id='modal-userName'" +
					" placeholder='john_doe' required>" +
					"<label for='modal-userName'>Username</label>" +
				"</div>" +
				"<p id='modal-username-alert'></p>" +
				"<div class='form-buttons'>" +
					"<button type='button' id='modal-submitButton' class='btn btn-primary submit'>Submit</button>" +
					"<button type='button' class='btn btn-secondary close'>Cancel</button>" +
				"</div>" +
			"</form>";
		modal('visible', content)
		function allChanged() {
			if (input_firstname || input_lastname || input_username) {
				$('#modal-submitButton').prop({'disabled': false})
			}
			else {
				$('#modal-submitButton').prop({'disabled': true})
			}
		}
		$('#modal-firstName').val(firstname_val)
		$('#modal-lastName').val(lastname_val)
		$('#modal-userName').val(username_val)
		$('#modal-submitButton').prop({'disabled': true})
		// ----- EDIT USERNAME VALIDATION ------
		$('#modal-userName').on('input', function() {
			let data = $(this).val()
			let input = '#modal-userName'
			let alert = '#modal-username-alert'
			username_ajax(input, data, alert)
		});
		//
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
					modal('hidden', '')
					$("#"+$tr_id).find('th').text(response['user_id'])
					$("#"+$tr_id).find('td:eq(1)').text(response['firstName'])
					$("#"+$tr_id).find('td:eq(2)').text(response['lastName'])
					$("#"+$tr_id).find('td:eq(3)').text(response['userName'])
					alert_func('#successAlert','User successfully updated!')
				},
				error: function(jqXHR) {
					if (jqXHR.status === 400) {
						modal('hidden', '')
						alert_func('#failAlert','User update failed!')
					}
				}
			})
		});
	});
	
	//
	$("#user-table").on("click", "td .delete-user", function(event) {
		event.preventDefault()
		let $tr_id = $(this).closest('tr').attr('id')
		let userid_val = $("#"+$tr_id).find('th').text()
		let firstname_val = $("#"+$tr_id).find('td:eq(1)').text()
		let lastname_val = $("#"+$tr_id).find('td:eq(2)').text()
		let username_val = $("#"+$tr_id).find('td:eq(3)').text()
		let content =
			"<div class='modalHeader'>" +
				"<h2>Delete User?</h2>" +
				"<p><i class='fa-solid fa-xmark modal-x'></i></p>" +
			"</div>" +
			"<div class='warning-message'>" +
				"<p><i class='bi bi-exclamation-triangle'></i>Warning!</p>" +
				"<p>Are you sure that you want to delete this user?</p>" +
				"<p>This action cannot be undone!</p>" +
			"</div>" +
			"<div class='userInfo'>" +
				"<p>User to be deleted: </p>" +
				"<ul id='infoList' class='list-group list-group-flush'>" +
					"<li class='list-group-item'>User ID: " + userid_val + " </li>" +
					"<li class='list-group-item'>First Name: " + firstname_val + "</li>" +
					"<li class='list-group-item'>Last Name: " + lastname_val + "</li>" +
					"<li class='list-group-item'>Username: " + username_val + "</li>" +
				"</ul>" +
			"</div>" +
			"<div class='form-buttons mt-4'>" +
				"<button type='button' class='btn btn-danger delete-user-submit'>Yes, delete this user!</button>" +
				"<button type='button' class='btn btn-secondary close'>Cancel, do not delete!</button>" +
			"</div>";
		modal('visible', content)
		$('.delete-user-submit').on('click', function() {
			$.ajax({
				url: '/delete_user',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					user_id: $tr_id
				}),
				success: function() {
					modal('hidden', '')
					$("#"+$tr_id).remove();
					alert_func('#successAlert','User successfully deleted!')
				},
				error: function() {
					modal('hidden', '')
					alert_func('#failAlert','User deletion failed!')
				}
			})
		});
	});
	
	//
	$("#user-table").on("click", "td .download-file", function(event) {
		event.preventDefault()
		
	}); //
	
	//
	$("#user-table").on("click", "td .delete-file", function(event) {
		event.preventDefault()
		let $file_id = $(this).closest('li').attr('id')
		let $file_name = $(this).closest('div.files').find('p').text()
		$('#file-info').text($file_name)
		let content =
			"<div class='modalHeader'>" +
				"<h2>Delete File?</h2>" +
				"<p><i class='fa-solid fa-xmark modal-x'></i></p>" +
			"</div>" +
			"<div class='warning-message'>" +
				"<p><i class='bi bi-exclamation-triangle'></i>Warning!</p>" +
				"<p>Are you sure that you want to delete this file?</p>" +
				"<p>This action cannot be undone!</p>" +
			"</div>" +
			"<div class='mt-4'>" +
				"<p id='delete-file-header'>File to be deleted: </p>" +
				"<p id='file-info'>"+ $file_name +"</p>" +
			"</div>" +
			"<div class='form-buttons mt-4'>" +
				"<button type='button' class='btn btn-danger delete-file-submit'>Yes, delete this file!</button>" +
				"<button type='button' class='btn btn-secondary close'>Cancel, do not delete!</button>" +
			"</div>"
		modal('visible', content)
		//
		$('.delete-file-submit').on('click', function() {
			$.ajax({
				url: '/delete_file',
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					file_id: $file_id
				}),
				success: function() {
					modal('hidden', '')
					$("#"+$file_id).remove()
					alert_func('#successAlert','File successfully deleted!')
				},
				error: function() {
					modal()
					alert_func('#failAlert','File deletion failed!')
				}
			});
		});
	});
	
	//
	$("#user-table").on("click", "td .upload-button", function(event) {
		event.preventDefault()
		
	});
	
	//
	$('.popup-content').on('click', '.modal-x, .close', function() {
		modal('hidden', '');
	});
	
	//
	$('#successX').on('click', function() {
		$('#successAlert').css('display', 'none')
	});
	//
	$('#failX').on('click', function() {
		$('#failAlert').css('display', 'none')
	});
	
	//
	function alert_func(alert, text) {
		$(alert).text(text)
		$(alert).css('display', 'flex')
		$('#failAlert').css('display', 'none')
		setTimeout(function() {
			$(alert).fadeOut(125)
		}, 2000);
	}
	
	//
	function username_ajax(input, data, alert) {
		$.ajax({
			url: '/username_validation',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				input: data
			}),
			success: function(response) {
				if (response['class'] === 'success') {
					usernameValidation(input, 'success', 'fail', '#submitButton',
						false, alert,'block', '#0f5132', "Username is available!")
				}
				else if (response['class'] === 'fail') {
					usernameValidation(input, 'fail', 'success', '#submitButton',
						true, alert,'block', '#842029', "Username is already taken!")
				}
				else if (response['class'] === 'none') {
					usernameValidation(input, '', 'success fail', '#submitButton',
						true, alert,'none', '', "")
				}
			}
		})
	}
	
	//
	function usernameValidation(username, add, remove, button, disabled , alert, display, color='none', text) {
		$(username).addClass(add)
		$(username).removeClass(remove)
		$(button).prop({'disabled':disabled})
		$(alert).css({'display':display, 'color':color})
		$(alert).text(text)
	}
	
	//
	function modal(visibility, content) {
		$('.popup-overlay, .popup-content').css('visibility', visibility)
		$('.popup-content').html(content)
	}
});