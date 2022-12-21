# project/core/views.py
from flask import render_template, Blueprint, request, jsonify
from project.models.models import User
from methods import is_valid, get_user, convert
from project import db

core = Blueprint('core', __name__)
	

@core.route('/')
def index():
	return render_template('index.html')
	

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


@core.route('/api', methods=['GET', 'POST'])
def api():
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


@core.route('/users', methods=['GET'])
def users():
	query = User.query.all()
	if len(query) != 0:
		result = convert(query)
		return jsonify(result)
