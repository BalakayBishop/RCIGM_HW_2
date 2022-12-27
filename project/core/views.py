# project/core/views.py
from flask import render_template, Blueprint, request, jsonify
from project.models.models import User
from project.core.methods import is_valid, get_user, convert
from project import db

core = Blueprint('core', __name__)
	
# -------------------- ROUTE: INDEX --------------------
@core.route('/')
def index():
	return render_template('index.html')
	
# -------------------- ROUTE: USERNAME VALIDATION --------------------
@core.route('/username_validation', methods=['GET', 'POST'])
def username_validation():
	data = request.get_json()
	passedUsername = data['input']
	if request.is_json:
		if request.method == 'POST':
			existingUser = is_valid(passedUsername)
			if len(passedUsername) != 0:
				if existingUser:
					return jsonify({
						'class': 'success'
					})
				else:
					return jsonify({
						'class': 'fail'
					})
			else:
				return jsonify({
					'class': 'none'
				})

# -------------------- ROUTE: NEW USER --------------------
@core.route('/new_user', methods=['POST'])
def new_user():
	form_data = request.get_json()
	first_name = form_data['firstName'],
	last_name = form_data['lastName'],
	username = form_data['userName']
	if len(first_name)!= 0 and len(last_name) != 0 and len(username) != 0:
		user = User(
			first_name=first_name,
			last_name=last_name,
			username=username
		)
		db.session.add(user)
		db.session.commit()
		
		getUser = get_user(username)
		
		if getUser is not None:
			return jsonify({
				'process': 'success',
				'id': getUser[0]['id'],
				'userName': getUser[0]['userName'],
				'firstName': getUser[0]['firstName'],
				'lastName': getUser[0]['lastName']
			})
	
	return jsonify({ 'process': 'failed' })


# -------------------- ROUTE: NEW USER --------------------
@core.route('/update_user', methods=['POST'])
def update_user():
	form_data = request.get_json()
	first_name = form_data['firstName'],
	last_name = form_data['lastName'],
	username = form_data['userName']
	currentUsername = form_data['currentUsername']
	
	if len(first_name) != 0 and len(last_name) != 0 and len(username) != 0:
		user = User.query.filter_by(username=currentUsername).one_or_none()
		if user is not None:
			user.first_name = first_name
			user.last_name = last_name
			user.username = username
			
			db.session.commit()
		
			getUser = get_user(username)
			
			if getUser is not None:
				return jsonify({
					'status': 'success',
					'id': getUser[0]['id'],
					'userName': getUser[0]['userName'],
					'firstName': getUser[0]['firstName'],
					'lastName': getUser[0]['lastName']
				})
	
	return jsonify({'status': 'failure'}), 400


# -------------------- ROUTE: DELETE USER --------------------
@core.route('/delete_user', methods=['POST'])
def delete_user():
	data = request.get_json()
	username = data['userName']
	
	if len(username) != 0:
		user = User.query.filter_by(username=username).one_or_none()
		if user is not None:
			db.session.delete(user)
			db.session.commit()
			return jsonify({'status': 'success'})
		
	return jsonify({'status': 'failure'}), 400


# -------------------- ROUTE: GET ALL USERS IN DICT --------------------
@core.route('/users', methods=['GET'])
def users():
	query = User.query.all()
	if len(query) != 0:
		result = convert(query)
		return jsonify(result)
	else:
		return jsonify({"status": "failure"}), 400
