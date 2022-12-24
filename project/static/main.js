$(document).ready(function() {
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			let list = document.querySelector('#userList')
			for(let i = 0; i < response.length; i++) {
				let li = document.createElement('li')
				let title = document.createElement('p')
				title.innerText =
					"ID: " + response[i]['id']
					+ ", Username: " + response[i]['userName']
					+ ", First Name: " + response[i]['firstName']
					+ ", Last Name: " + response[i]['lastName']
				title.classList.add('title')
				li.appendChild(title)
				
				let icons = document.createElement('p')
				icons.innerHTML = '<i class="fa fa-pencil-square-o"></i> <i' +
					' class="fa fa-times"></i>'
				
				li.appendChild(icons)
				
				icons.classList.add('icons')
				li.classList.add('list-group-item')
				
				list.appendChild(li)
			}
		},
		fail: function() {
			let list = document.querySelector('#userList')
			let li = document.createElement('li')
			li.classList.add('list-group-item', 'fail-list')
			li.innerText = 'Error loading list of users'
			
			list.appendChild(li)
		}
	});
	
	// ------------------------------------- USERNAME VALIDATION -------------------------------------
	$('.username').on('input', function() {
		let username = $(this).val()
		$.ajax({
			url: '/username_validation',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				input: username
			}),
			success: function(response) {
				let usernameInput = document.querySelector('.username')
				let taken = document.querySelector('#taken')
				let available = document.querySelector('#available')
				
				if (response['class'] === 'success') {
					usernameInput.classList.remove('fail')
					usernameInput.classList.add('success')
					$('#submitButton').prop('disabled', false)
					available.style.display = 'block'
					taken.style.display = 'none'
				}
				else if (response['class'] === 'fail') {
					usernameInput.classList.remove('success')
					usernameInput.classList.add('fail')
					$('#submitButton').prop('disabled', true)
					available.style.display = 'none'
					taken.style.display = 'block'
				}
				else if (response['class'] === 'none') {
					usernameInput.classList.remove('success')
					usernameInput.classList.remove('fail')
					$('#submitButton').prop('disabled', false)
					available.style.display = 'none'
					taken.style.display = 'none'
				}
			}
		})
	});
	
	// ------------------------------------- FORM SUBMISSION -------------------------------------
	$('#submitButton').on('click', function(event) {
		event.preventDefault()
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		let form = document.querySelector('form')
		let usernameInput = document.querySelector('.username')
		let taken = document.querySelector('#taken')
		let available = document.querySelector('#available')
		
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
				if (response['process'] === 'success') {
					let list = document.querySelector('#userList')
					let li = document.createElement('li')
					let title = document.createElement('p')
					let form = document.querySelector('#form')
					title.innerText =
						"ID: " + response['id']
						+ ", Username: " + response['userName']
						+ ", First Name: " + response['firstName']
						+ ", Last Name: " + response['lastName']
					title.classList.add('title')
					li.appendChild(title)
					
					let icons = document.createElement('p')
					icons.innerHTML = '<i class="fa fa-pencil-square-o"></i> <i class="fa fa-times"></i>'
					li.appendChild(icons)
					
					icons.classList.add('icons')
					li.classList.add('list-group-item')
					
					list.appendChild(li)
					
					successAlert.style.display = 'flex'
					failAlert.style.display = 'none'
					
					setTimeout(function() {
						$('#successAlert').fadeOut(125)
					}, 2000);
					
					form.reset()
					usernameInput.classList.remove('fail', 'success')
					taken.style.display = 'none'
					available.style.display = 'none'
				}
				else if (response['process'] === 'fail') {
					
					successAlert.style.display = 'none'
					failAlert.style.display = 'flex'
					
					form.reset()
					usernameInput.classList.remove('fail')
					available.style.display = 'none'
					taken.style.display = 'none'
					
					setTimeout(function() {
						$('#failAlert').fadeOut(125)
					}, 2000);
					
					form.reset()
					usernameInput.classList.remove('fail', 'success')
					taken.style.display = 'none'
					available.style.display = 'none'
				}
			}
		})
	});
	
	// ------------------------------------- SUBMISSION SUCCESS -------------------------------------
	$('#successClose').on('click', function() {
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	});
	
	//------------------------------------- SUBMISSION FAIL -------------------------------------
	$('#failClose').on('click', function() {
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	});
	
	// ------------------------------------- MODALS FOR EDIT AND DELETE -------------------------------------
	$('ul').on('click', function(e) {
		
		let form = document.querySelector('#modal-form')
		let usernameInput = document.querySelector('.modal-username')
		let taken = document.querySelector('#modal-taken')
		let available = document.querySelector('#modal-available')
		
		// ------------------------------- CLICK EDIT ICON --------------------------------
		if(e.target.classList[1] === 'fa-pencil-square-o') {
			// MODAL OPEN
			$('.popup-overlay-edit, .popup-content-edit').addClass('active')
			let str = e.target.parentNode.previousSibling.textContent
			let newStr = e.target.parentNode.previousSibling
			let userName = ''
			let firstName = ''
			let lastName = ''
			
			let substrings = str.split(", ")
			for (let substring of substrings) {
				if(substring.startsWith('Username: ')) {
					userName = substring.replace('Username: ', '')
				}
				else if(substring.startsWith('First Name: ')) {
					firstName = substring.replace('First Name: ', '')
				}
				else if(substring.startsWith('Last Name: ')) {
					lastName = substring.replace('Last Name: ', '')
				}
			}
			
			$('#modal-firstName').val(firstName)
			$('#modal-lastName').val(lastName)
			$('#modal-userName').val(userName)
			let currentUsername = userName
			
			// --------------------------------- MODAL FORM SUBMISSION ----------------------------------
			
			$('#modal-submitButton').on('click', function() {
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
						form.reset()
						taken.style.display = 'none'
						available.style.display = 'none'
						usernameInput.classList.remove('fail', 'success')
						$('#modal-submitButton').prop('disabled', false)
						newStr.textContent =
							'ID: ' + response['id']
							+ ', Username: ' + response['userName']
							+ ', First Name: ' + response['firstName']
							+ ', Last Name: ' + response['lastName']
						$('#edit-success').style.display = 'flex'
						setTimeout(function() {
							$('#edit-success').fadeOut(125)
						}, 2000);
					},
					fail: function(response) {
						console.log(response)
					}
				})
			});
		}
		// ------------------------------- CLICK DELETE ICON --------------------------------
		else if(e.target.classList[1] === 'fa-times') {
			$('.popup-overlay-delete, .popup-content-delete').addClass('active')
	
			$('.close').on('click', function() {
				$('.popup-overlay-delete, .popup-content-delete').removeClass('active')
			});
		}
		
		// MODAL CLOSED
		$('.close-edit').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			form.reset()
			taken.style.display = 'none'
			available.style.display = 'none'
			usernameInput.classList.remove('fail', 'success')
			$('#modal-submitButton').prop('disabled', false)
		});
		
		$('.modal-xmark').on('click', function() {
			$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
			form.reset()
			taken.style.display = 'none'
			available.style.display = 'none'
			usernameInput.classList.remove('fail', 'success')
			$('#modal-submitButton').prop('disabled', false)
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
	
	
	// ------------------------------------- USER UPDATE X BUTTON CLICK -------------------------------------
	$('#editSuccessClose').on('click', function() {
		let successAlert = document.getElementById('edit-success')
		let failAlert = document.getElementById('edit-fail')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	});
	
	$('#editFailClose').on('click', function() {
		let successAlert = document.getElementById('edit-success')
		let failAlert = document.getElementById('edit-fail')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	});
	
});
