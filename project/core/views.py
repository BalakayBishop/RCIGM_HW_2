# project/core/views.py
from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project.models.models import User
from project import db
import json

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
		return jsonify({ 'process': 'success' })
	
	return jsonify({ 'process': 'failed' })


def convert(lst):
	result = {lst[i]: lst[i+1] for i in range(0, len(lst), 2)}


@core.route('/users', methods=['GET'])
def users():
	query = User.query.all()
	
	return "Test"
