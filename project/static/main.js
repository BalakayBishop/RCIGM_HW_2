$(document).ready(function() {
	
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			let list = document.querySelector('#userList')
			for(let i = 0; i < response.length; i++) {
				let li = document.createElement('li')
				li.innerText =
					"ID: " + response[i]['id']
					+ ", Username: " + response[i]['userName']
					+ ", First Name: " + response[i]['firstName']
					+ ", Last Name: " + response[i]['lastName']
				
				li.classList.add('list-group-item')
				list.appendChild(li)
			}
		},
		error: function() {
			let list = document.querySelector('#userList')
			let li = document.createElement('li')
			li.classList.add('list-group-item', 'fail-list')
			li.innerText = 'Error loading list of users'
			
			list.appendChild(li)
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
		let form = document.querySelector('form')
		let usernameInput = document.querySelector('.username')
		let taken = document.querySelector('#taken')
		let available = document.querySelector('#available')
		
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
					
					let list = document.querySelector('#userList')
					let li = document.createElement('li')
					
					li.innerText = "ID: " + response['id']
					+ ", Username: " + response['userName']
					+ ", First Name: " + response['firstName']
					+ ", Last Name: " + response['lastName']
					
					li.classList.add('list-group-item')
					list.appendChild(li)
					
					successAlert.style.display = 'flex'
					failAlert.style.display = 'none'
					
					form.reset()
					usernameInput.classList.remove('success')
					available.style.display = 'none'
					taken.style.display = 'none'
					
					setTimeout(function() {
						$('#successAlert').fadeOut('fast')
					}, 2000);
				}
				else if (response['process'] === 'fail') {
					
					successAlert.style.display = 'none'
					failAlert.style.display = 'flex'
					
					form.reset()
					usernameInput.classList.remove('fail')
					available.style.display = 'none'
					taken.style.display = 'none'
					
					setTimeout(function() {
						$('#failAlert').fadeOut('fast')
					}, 2000);
					
				}
			}
		})
	});
	
	$('#successClose').on('click', function() {
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	})
	
	$('#failClose').on('click', function() {
		let successAlert = document.getElementById('successAlert')
		let failAlert = document.getElementById('failAlert')
		
		successAlert.style.display = 'none'
		failAlert.style.display = 'none'
	})
})

