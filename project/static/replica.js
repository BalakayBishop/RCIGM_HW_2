$(document).ready(function() {
	
	$('.back-home').on('click', function() {
		window.location.href = '/'
	})
	
	$(".content-options").on('click', ".option-item", function() {
		$(".option-item").removeClass('option-active')
		$(this).addClass('option-active')
	})
	
	// ----- TEST STATUS DATETIME -----
	$(".content-options").on('click', '#option-test-status', function() {
		$('.content-display').html(
			"<div class='content-display-inner'>" +
				"<div class='content-display-header'>" +
					"<h5>Change Test Status Completed Datetime</h5>" +
					"<i class='bi bi-x-lg close-content-display'></i>" +
				"</div>" +
				"<div class='help-block'>" +
					"<p>" +
						"An example ticket is <strong>PSD-1532</strong>. The ticket usually contains following" +
						" information: case ID, familial relationships, test types, and completed datetimes.<br>" +
						"1) Search the target records by entering case ID, familial relationship, and test type.<br>" +
						"2) If there are records matching the search filters, it will display a table with records" +
						" below. <br>" +
						"3) Use the in-line editing to edit the completed datetime in year-month-date hour:minute:second " +
						"format. e.g) 2020-07-01 13:30:00" +
					"</p>" +
				"</div>" +
				"<div class='content-display-form'>" +
					"<div class='input-group'>" +
						"<span class='input-group-text' id='caseID-input'>Case ID</span>" +
						"<input type='text' class='form-control' aria-describedby='caseID-input'>" +
					"</div>" +
					"<div class='input-group'>" +
						"<label id='label-family-relation-select' class='input-group-text' for='family-relation-select'>Fam. Rel.</label>" +
						"<select class='form-select' id='family-relation-select'>" +
							"<option selected>Choose...</option>" +
							"<option value='Daughter'>Daughter</option>" +
							"<option value='Father'>Father</option>" +
							"<option value='Maternal_Aunt'>Maternal Aunt</option>" +
							"<option value='Maternal_Grandfather'>Maternal Grandfather</option>" +
							"<option value='Maternal_Grandmother'>Maternal Grandmother</option>" +
							"<option value='Maternal_Grandmother'>Maternal Uncle</option>" +
							"<option value='Mother'>Mother</option>" +
							"<option value='Other'>Other</option>" +
							"<option value='Paternal_Aunt'>Paternal Aunt</option>" +
							"<option value='Paternal_Grandfather'>Paternal Grandfather</option>" +
							"<option value='Paternal_Grandmother'>Paternal Grandmother</option>" +
							"<option value='Paternal_Uncle'>Paternal Uncle</option>" +
							"<option value='Proband'>Proband</option>" +
							"<option value='Sibling'>Sibling</option>" +
							"<option value='Son'>Son</option>" +
						"</select>" +
					"</div>" +
					"<div class='input-group'>" +
						"<label id='label-test-type-select' class='input-group-text' for='test-type-select'>Test Type</label>" +
						"<select class='form-select' id='test-type-select'>" +
							"<option selected>Choose...</option>" +
							"<option value='BLOOD-KIT-REF'>BLOOD-KIT-REF</option>" +
							"<option value='CANCER-PANEL-REF'>CANCER-PANEL-REF</option>" +
							"<option value='COVID19-CONF'>COVID19-CONF</option>" +
							"<option value='COVID19-CONF-FFS'>COVID19-CONF-FFS</option>" +
							"<option value='CVA-CONF'>CVA-CONF</option>" +
							"<option value='CVA-CONF-REF'>CVA-CONF-REF</option>" +
							"<option value='CVA-FFS'>CVA-FFS</option>" +
							"<option value='CVA-FFS-RCIGM'>CVA-FFS-RCIGM</option>" +
							"<option value='CVA-FFS-RCIGM-REF'>CVA-FFS-RCIGM-REF</option>" +
							"<option value='CVA-FFS-REF'>CVA-FFS-REF</option>" +
							"<option value='CVA-RESEARCH'>CVA-RESEARCH</option>" +
							"<option value='DBS'>DBS</option>" +
							"<option value='DNA_ISO'>DNA_ISO</option>" +
							"<option value='DNA_REISO'>DNA_REISO</option>" +
							"<option value='DS'>DS</option>" +
							"<option value='GWES'>GWES</option>" +
							"<option value='HOLD'>HOLD</option>" +
							"<option value='ID_CHECK'>ID_CHECK</option>" +
							"<option value='LARSEQ'>LARSEQ</option>" +
							"<option value='META'>META</option>" +
							"<option value='MICRO'>MICRO</option>" +
							"<option value='MYL'>MYL</option>" +
							"<option value='NBS_RWGS'>NBS_RWGS</option>" +
							"<option value='NEXTGEN'>NEXTGEN</option>" +
							"<option value='NONE'>NONE</option>" +
							"<option value='NOONAN-PANEL-REF'>NOONAN-PANEL-REF</option>" +
							"<option value='OTHER'>OTHER</option>" +
							"<option value='PDX'>PDX</option>" +
							"<option value='PROTEO'>PROTEO</option>" +
							"<option value='REANALYSIS-FULL'>REANALYSIS-FULL</option>" +
							"<option value='REANALYSIS-TARGET'>REANALYSIS-TARGET</option>" +
							"<option value='REANALYSIS-TARGET'>REANALYSIS-TARGET</option>" +
							"<option value='RNASEQ'>RNASEQ</option>" +
							"<option value='RNA_ISO'>RNA_ISO</option>" +
							"<option value='RWGS'>RWGS</option>" +
							"<option value='SALIVA-KIT-REF'>SALIVA-KIT-REF</option>" +
							"<option value='STR'>STR</option>" +
							"<option value='SVA-CONF'>SVA-CONF</option>" +
							"<option value='SVA-CONF-REF'>SVA-CONF-REF</option>" +
							"<option value='SVA-FFS'>SVA-FFS</option>" +
							"<option value='SVA-FFS-RCIGM'>SVA-FFS-RCIGM</option>" +
							"<option value='TGS'>TGS</option>" +
							"<option value='URWGS'>URWGS</option>" +
							"<option value='WES-REF'>WES-REF</option>" +
							"<option value='WGS'>WGS</option>" +
							"<option value='WGS-REF'>WGS-REF</option>" +
							"<option value='XENO'>XENO</option>" +
						"</select>" +
					"</div>" +
				"</div>" +
				"<div class='arrow-icon-div'>" +
					"<i class='bi bi-arrow-right-circle-fill arrow-icon'></i>" +
				"</div>" +
			"</div>"
		)
	});
	
	// ----- REMOVE INDIVIDUAL -----
	$('.content-options').on('click', '#remove-individual', function() {
		$('.content-display').html(
			"<div class='content-display-inner'>" +
				"<div class='content-display-header'>" +
					"<h5>Remove Individual</h5>" +
					"<i class='bi bi-x-lg close-content-display'></i>" +
				"</div>" +
				"<div class='help-block'>" +
					"<p>" +
						"An example JIRA ticket is <strong>PSD-1559</strong>. The ticket should contain Ind ID.<br>" +
						"1) This feature will remove an individual and all its children including the metadata bound to all children.<br>" +
						"2) Thus, it will dynamically check and delete all bindings whether an individual contains true or TBD sample.<br>" +
						"3) The system will block an individual from being deleted if at least one of the test bound to this individual is accessioned." +
					"</p>" +
				"</div>" +
				"<div id='removeIND-display-form' class='content-display-form sm-row-form'>" +
					"<div id='removeIND-input-group' class='input-group w400'>" +
						"<span class='input-group-text' id='indID-input'>Ind ID</span>" +
						"<input type='text' class='form-control' aria-describedby='indID-input'>" +
					"</div>" +
				"</div> " +
				"<div class='arrow-icon-div w400'><i class='bi bi-arrow-right-circle-fill arrow-icon'></i></div>" +
			"</div>"
		)
	});
	
	// ----- REMOVE RECIPIENT -----
	$('.content-options').on('click', '#remove-recipient', function() {
		$('.content-display').html(
			"<div class='content-display-inner'>" +
				"<div class='content-display-header'>" +
					"<h5>Remove Email Notification Recipient</h5>" +
					"<i class='bi bi-x-lg close-content-display'></i>" +
				"</div>" +
				"<div class='help-block'>" +
					"<p>" +
						"This feature will delete all the entries found within the Email Notification table for the email recipient provided." +
					"</p>" +
				"</div>" +
				"<div id='remove-EmailNot-display-form' class='content-display-form sm-row-form'>" +
					"<div id='remove-EmailNot-input-group' class='input-group w400'>" +
						"<span class='input-group-text' id='notification-email-input'>Email</span>" +
						"<input type='text' class='form-control' aria-describedby='notification-email-input'>" +
					"</div>" +
				"</div> " +
				"<div class='arrow-icon-div w400'><i class='bi bi-arrow-right-circle-fill arrow-icon'></i></div>" +
			"</div>"
		);
	});
	
	// ----- CREATE USER -----
	$('.content-options').on('click', '#create-user', function() {
		$('.content-display').html(
			"<div class='content-display-inner'>" +
				"<div class='content-display-header'>" +
					"<h5>Create User</h5>" +
					"<i class='bi bi-x-lg close-content-display'></i>" +
				"</div>" +
				"<div class='help-block'>" +
					"<p>" +
						"An example JIRA ticket is GP-1791. The ticket contains the user, role, site, and study information.<br>" +
						"1) Enter user information including e-mail, first, and last name.<br>" +
						"2) Specify a site that user belongs to and assign allowed studies. Note that OPS roles won't have allowed studies.<br>" +
						"3) Specify whether you want to send a password reset instruction e-mail." +
					"</p>" +
				"</div>" +
				"<div id='create-user-display-form' class='content-display-form'>" +
					"<div id='create-user-1' class='create-user-row'>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-email-input'>Email</span>" +
							"<input type='text' class='form-control' aria-describedby='create-email-input'>" +
						"</div>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-fname-input'>First Name</span>" +
							"<input type='text' class='form-control' aria-describedby='create-fname-input'>" +
						"</div>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-lname-input'>Last Name</span>" +
							"<input type='text' class='form-control' aria-describedby='create-lname-input'>" +
						"</div>" +
					"</div>" +
					"<div id='create-user-2' class='create-user-row'>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-roles-input'>Roles</span>" +
							"<input type='text' class='form-control' aria-describedby='create-roles-input'>" +
						"</div>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-site-input'>Site</span>" +
							"<input type='text' class='form-control' aria-describedby='create-site-input'>" +
						"</div>" +
						"<div id='' class='input-group'>" +
							"<span class='input-group-text wide-label' id='create-studies-input'>Allowed Studies</span>" +
							"<input type='text' class='form-control' aria-describedby='create-studies-input'>" +
						"</div>" +
					"</div>" +
					"<div class='arrow-icon-div'><i class='bi bi-arrow-right-circle-fill arrow-icon'></i></div>" +
				"</div>" +
			"</div>"
		)
	})
	
	// ----- DEACTIVATE USER -----
	$('.content-options').on('click', '#deactivate-user', function() {
		$('.content-display').html(
			"<div class='content-display-inner'>" +
				"<div class='content-display-header'>" +
					"<h5>Deactivate User</h5>" +
					"<i class='bi bi-x-lg close-content-display'></i>" +
				"</div>" +
				"<div class='help-block'>" +
					"<p>" +
						"This feature will deactivate/activate a user from the users table.<br>" +
						"Once a user is being deactivated it will be flagged and transferred into the users_deactivated table.<br>" +
						"If the user is submitted once again it will be removed from the user_deactivated table, and they will be active again." +
					"</p>" +
				"</div>" +
				"<div id='deactivate-user-display-form' class='content-display-form sm-row-form'>" +
					"<div id='deactive-user-input-group' class='input-group w400'>" +
						"<span class='input-group-text' id='deactivate-email-input'>Email</span>" +
						"<input type='text' class='form-control' aria-describedby='deactivate-email-input'>" +
					"</div>" +
				"</div> " +
				"<div class='arrow-icon-div w400'><i class='bi bi-arrow-right-circle-fill arrow-icon'></i></div>" +
			"</div>"
		);
	})
	
	// ----- CLOSING/REMOVING DISPLAYED CONTENT -----
	$('.content-display').on('click','.close-content-display', function() {
		$('.content-display').html('')
		$(".option-item").removeClass('option-active')
	})

}) // ----- END OF DOCUMENT READY -----