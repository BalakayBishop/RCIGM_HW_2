# project/core/views.py
from flask import render_template, Blueprint, request, jsonify
from project.models.models import User
from project import db

core = Blueprint('core', __name__)

@core.route('/')
def index():
	return render_template('index.html')


def is_valid(username_check):
	usernameExist = User.query.filter_by(username=username_check).one_or_none()
	if usernameExist is None:
		return True
	elif usernameExist is not None:
		return False
	

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


def convert(obj):
	lst = []
	if type(obj) == list:
		for i in range(0, len(obj)):
			lst.append(obj[i].as_dict())
	else:
		lst.append(obj.as_dict())
	return lst

def get_user(userName):
	user = User.query.filter_by(username=userName).one_or_none()
	if user is not None:
		return convert(user)
	else:
		return None


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
