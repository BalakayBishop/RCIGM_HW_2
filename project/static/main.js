$(document).ready(function() {
	// ------------------------------------- LIST OF USERS ON PAGE LOAD -------------------------------------
	$.ajax({
		url: '/users',
		type:'GET',
		success: function(response) {
			let list = document.querySelector('#userList')
			for(let i = 0; i < response.length; i++) {
				let li = document.createElement('li')
				let uname = document.createElement('p')
				let fname = document.createElement('p')
				let lname = document.createElement('p')
				
				let pDiv = document.createElement('div')
				
				fname.innerText = "First Name: " + response[i]['firstName']
				lname.innerText = "Last Name: " + response[i]['lastName']
				uname.innerText = "Username: " + response[i]['userName']
				
				pDiv.appendChild(fname)
				pDiv.appendChild(lname)
				pDiv.appendChild(uname)
				
				li.appendChild(pDiv)
				
				let div = document.createElement('div')
				div.classList.add('buttons-div')
				
				let editButton = document.createElement('button')
				editButton.classList.add('btn', 'btn-success', 'list-buttons-edit')
				editButton.innerText = 'Edit'
				
				let deleteButton = document.createElement('button')
				deleteButton.classList.add('btn', 'btn-danger', 'list-buttons-delete')
				deleteButton.innerText = 'Delete'
				
				div.appendChild(editButton)
				div.appendChild(deleteButton)
				li.appendChild(div)
				
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
					let form = document.querySelector('#form')
					let li = document.createElement('li')
					let pDiv = document.createElement('div')
					let uname = document.createElement('p')
					let fname = document.createElement('p')
					let lname = document.createElement('p')
					
					fname.innerText = "First Name: " + response['firstName']
					lname.innerText = "Last Name: " + response['lastName']
					uname.innerText = "Username: " + response['userName']
					
					pDiv.appendChild(fname)
					pDiv.appendChild(lname)
					pDiv.appendChild(uname)
					
					li.appendChild(pDiv)
					
					let div = document.createElement('div')
					div.classList.add('buttons-div')
					
					let editButton = document.createElement('button')
					editButton.classList.add('btn', 'btn-success', 'list-buttons-edit')
					editButton.innerText = 'Edit'
					
					let deleteButton = document.createElement('button')
					deleteButton.classList.add('btn', 'btn-danger', 'list-buttons-delete')
					deleteButton.innerText = 'Delete'
					
					div.appendChild(editButton)
					div.appendChild(deleteButton)
					li.appendChild(div)
					
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
		
		let firstName = e.target.parentNode.parentNode.childNodes[0].childNodes[0].textContent
		console.log(firstName)
		firstName = firstName.replace('First Name: ', '')
		
		let lastName = e.target.parentNode.parentNode.childNodes[0].childNodes[1].textContent
		lastName = lastName.replace('Last Name: ', '')
		
		let userName = e.target.parentNode.parentNode.childNodes[0].childNodes[2].textContent
		userName = userName.replace('Username: ', '')
		
		// ------------------------------- CLICK EDIT ICON --------------------------------
		if(e.target.classList[2] === 'list-buttons-edit') {
			// MODAL OPEN
			$('.popup-overlay-edit, .popup-content-edit').addClass('active')
			
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
						let successAlert = document.querySelector('#edit-success')
						let failAlert = document.querySelector('#edit-fail')
						
						$('.popup-overlay-edit, .popup-content-edit').removeClass('active')
						form.reset()
						taken.style.display = 'none'
						available.style.display = 'none'
						usernameInput.classList.remove('fail', 'success')
						$('#modal-submitButton').prop('disabled', false)
						
						// new way to update li info after submission
						firstName = response['firstName']
						lastName = response['lastName']
						userName = response['userName']
						
						successAlert.style.display = 'flex'
						failAlert.style.display = 'none'
						
						setTimeout(function() {
							$('#edit-success').fadeOut(125)
						}, 2000);
						
						form.reset()
						usernameInput.classList.remove('fail', 'success')
						taken.style.display = 'none'
						available.style.display = 'none'
					},
					fail: function(response) {
						console.log(response)
					}
				})
			});
		}
		// ------------------------------- CLICK DELETE BUTTON --------------------------------
		else if(e.target.classList[2] === 'list-buttons-delete') {
			console.log(e)
			console.log(e.target.parentNode.parentNode) // this gives me the li grandparent to the icon clicked
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
			
			$('#deleteSuccessClose').on('click', function() {
				let successAlert = document.querySelector('#delete-success')
				let failAlert = document.querySelector('#delete-fail')
				successAlert.style.display = 'none'
				failAlert.style.display = 'none'
			});
			
			$('#deleteFailClose').on('click', function() {
				let successAlert = document.querySelector('#delete-success')
				let failAlert = document.querySelector('#delete-fail')
				successAlert.style.display = 'none'
				failAlert.style.display = 'none'
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
