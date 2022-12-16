$(document).ready(function() {
	$('.username').on('keyup', function() {
		let username = $(this).val()
		$.ajax({
			url: '/username_validation',
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify({
				input: username
			}),
			success: function(response) {
				$('.username').css(response)
			}
		})
	});
})

