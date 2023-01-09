$(document).ready(function() {
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			for(let i = 0; i < response.length; i++) {
				$('#userList').append("" +
					"<li class='list-group-item'>" +
						"<div class='li-inner'>" +
							"<div class='li-p-div'>" +
								"<p>First Name: " + response[i]['firstName'] + "</p>" +
								"<p>Last Name: " + response[i]['lastName'] + "</p>" +
								"<p>Last Name: " + response[i]['userName'] + "</p>" +
							"</div>" +
							"<div class='li-buttons'>" +
								"<button class='btn btn-success list-buttons-edit'>Edit</button>" +
								"<button class='btn btn-danger list-buttons-edit'>Delete</button>" +
							"</div>" +
						"</div>" +
						"<div class='mb-3 file-input'>" +
							"<label for='formFile' class='form-label'>Select File</label>" +
							"<input class='form-control formFile' type='file'>" +
						"</div>" +
					"</li>"
				)
			}
		},
		fail: function() {
			$('#userList').append("<li class='list-group-item fail-list'>Error Loading Users</li>")
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
				$('#successAlert').css('display', 'flex')
				$('#userList').append("" +
					"<li class='list-group-item'>" +
						"<div class='li-inner'>" +
							"<div class='li-p-div'>" +
								"<p>First Name: " + response['firstName'] + "</p>" +
								"<p>Last Name: " + response['lastName'] + "</p>" +
								"<p>Last Name: " + response['userName'] + "</p>" +
							"</div>" +
							"<div class='li-buttons'>" +
								"<button class='btn btn-success list-buttons-edit'>Edit</button>" +
								"<button class='btn btn-danger list-buttons-edit'>Delete</button>" +
							"</div>" +
						"</div>" +
						"<div class='mb-3 file-input'>" +
							"<label for='formFile' class='form-label'>Select File</label>" +
							"<input class='form-control formFile' type='file'>" +
						"</div>" +
					"</li>"
				)
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
	$('ul').on('click', function(e) {
		let form = document.querySelector('#modal-form')
		let usernameInput = document.querySelector('.modal-username')
		let taken = document.querySelector('#modal-taken')
		let available = document.querySelector('#modal-available')
		
		let firstName = e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent
		firstName = firstName.replace('First Name: ', '')
		
		let lastName = e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent
		lastName = lastName.replace('Last Name: ', '')
		
		let userName = e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent
		userName = userName.replace('Username: ', '')
		
		// ------------------------------- CLICK EDIT BUTTON --------------------------------
		if(e.target.classList[2] === 'list-buttons-edit') {
			// MODAL OPEN
			$('.popup-overlay-edit, .popup-content-edit').addClass('active')
			
			$('#modal-firstName').val(firstName)
			$('#modal-lastName').val(lastName)
			$('#modal-userName').val(userName)
			let currentUsername = userName
			
			// --------------------------------- MODAL FORM SUBMISSION ----------------------------------
			
			$('#modal-submitButton').on('click', function(e2) {
				e2.preventDefault()
				let successEditAlert = document.getElementById('edit-success')
				let failEditAlert = document.getElementById('edit-fail')
				
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
						
						successEditAlert.style.display = 'flex'
						failEditAlert.style.display = 'none'
						setTimeout(function() {
							$('#edit-success').fadeOut(125)
						}, 2000);
						
						form.reset()
						taken.style.display = 'none'
						available.style.display = 'none'
						usernameInput.classList.remove('fail', 'success')
						$('#modal-submitButton').prop('disabled', false)
						
						e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent = "First Name: "
							+ response['firstName']
						e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent = "Last Name: "
							+ response['lastName']
						e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent = "Username: "
							+ response['userName']
						
					},
					fail: function() {
						successEditAlert.style.display = 'none'
						failEditAlert.style.display = 'flex'
						
						setTimeout(function() {
							$('.edit-fail').fadeOut(125)
						}, 2000);
					}
				})
			});
		}
		// ------------------------------- CLICK DELETE BUTTON --------------------------------
		else if(e.target.classList[2] === 'list-buttons-delete') {
			let li = e.target.parentNode.parentNode
			// DELETE MODAL OPEN
			$('.popup-overlay-delete, .popup-content-delete').addClass('active')
			let list = document.querySelector('#infoList')
			
			let listFn = document.createElement('li')
			listFn.classList.add('list-group-item')
			listFn.innerText = 'First Name: ' + firstName
			
			let listLn = document.createElement('li')
			listLn.classList.add('list-group-item')
			listLn.innerText = 'Last Name: ' + lastName
			
			let listUn = document.createElement('li')
			listUn.classList.add('list-group-item')
			listUn.innerText = 'Username: ' + userName
			
			list.appendChild(listFn)
			list.appendChild(listLn)
			list.appendChild(listUn)
			
			$('.delete-submit').on('click', function() {
				let successAlert = document.querySelector('#delete-success')
				let failAlert = document.querySelector('#delete-fail')
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
						let ul = document.querySelector('#infoList')
						ul.innerHTML = ''
						
						successAlert.style.display = 'flex'
						failAlert.style.display = 'none'
						
						setTimeout(function() {
							$('#delete-success').fadeOut(125)
						}, 2000);
					},
					fail: function() {
						$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
						let ul = document.querySelector('#infoList')
						ul.innerHTML = ''
						
						successAlert.style.display = 'none'
						failAlert.style.display = 'flex'
						
						setTimeout(function() {
							$('#delete-success').fadeOut(125)
						}, 2000);
						
					}
				})
			});
			
		}
		
		// EDIT MODAL CLOSED
		$('.close-edit').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			form.reset()
			taken.style.display = 'none'
			available.style.display = 'none'
			usernameInput.classList.remove('fail', 'success')
			$('#modal-submitButton').prop('disabled', false)
		});
		
		// EDIT & DELETE MODAL CLOSE X ICON
		$('.modal-xmark-edit').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			form.reset()
			taken.style.display = 'none'
			available.style.display = 'none'
			usernameInput.classList.remove('fail', 'success')
			$('#modal-submitButton').prop('disabled', false)
		});
		
		// DELETE MODAL CLOSE
		$('.close-delete').on('click', function() {
			$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
			let ul = document.querySelector('#infoList')
			ul.innerHTML = ''
		});
		
		$('.modal-xmark-delete').on('click', function() {
			$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
			let ul = document.querySelector('#infoList')
			ul.innerHTML = ''
		});
	});
	
	// ------------------------------------- MODAL USERNAME VALIDATION -------------------------------------
	$('.modal-username').on('input', function() {
		let username = $(this).val()
		$.ajax({
			url: '/username_validation',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				input: username
			}),
			success: function(response) {
				let usernameInput = document.querySelector('.modal-username')
				let taken = document.querySelector('#modal-taken')
				let available = document.querySelector('#modal-available')
				
				if (response['class'] === 'success') {
					usernameInput.classList.remove('fail')
					usernameInput.classList.add('success')
					$('#modal-submitButton').prop('disabled', false)
					available.style.display = 'block'
					taken.style.display = 'none'
				}
				else if (response['class'] === 'fail') {
					usernameInput.classList.remove('success')
					usernameInput.classList.add('fail')
					$('#modal-submitButton').prop('disabled', true)
					available.style.display = 'none'
					taken.style.display = 'block'
				}
				else if (response['class'] === 'none') {
					usernameInput.classList.remove('success')
					usernameInput.classList.remove('fail')
					$('#modal-submitButton').prop('disabled', false)
					available.style.display = 'none'
					taken.style.display = 'none'
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
	
	// ------------------------------------- FILE UPLOAD -------------------------------------
	
});


