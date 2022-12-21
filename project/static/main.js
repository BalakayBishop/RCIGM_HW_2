$(document).ready(function() {
	
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			console.log(response)
		},
		error: function(error) {
			console.log(error)
		}
	});
	
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
	
	$('#submitButton').on('click', function(event) {
		event.preventDefault()
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		let firstName = document.querySelector('#firstName')
		let lastName = document.querySelector('#lastName')
		let userName = document.querySelector('#userName')
		$.ajax({
			url: '/api',
			type: 'POST',
			contentType: 'application/json',
			data: JSON.stringify({
				firstName: $('#firstName').val(),
				lastName: $('#lastName').val(),
				userName: $('#userName').val()
			}),
			success: function(response) {
				if (response['process'] === 'success') {
					successAlert.style.display = 'flex'
					failAlert.style.display = 'none'
					firstName.textContent = ''
					lastName.textContent = ''
					userName.textContent = ''
				}
				else if (response['process'] === 'fail') {
					successAlert.style.display = 'none'
					failAlert.style.display = 'flex'
					firstName.textContent = ''
					lastName.textContent = ''
					userName.textContent = ''
				}
			}
		})
	});
})

// <li class="list-group-item">
//
// </li>