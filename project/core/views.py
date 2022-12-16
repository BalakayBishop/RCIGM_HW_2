# project/core/views.py
from flask import render_template, Blueprint, request, redirect, url_for, jsonify
from project.models.models import User
from project import db

core = Blueprint('core', __name__)

@core.route('/')
def index():
	user = User.query.all()
	return render_template('index.html', user=user)


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
			if existingUser:
				return jsonify({'border': 'solid 2px #5cd65c'})
			else:
				return jsonify({'border': 'solid 2px #f11b2b'})


@core.route('/api', methods=['GET', 'POST'])
def api():
	form_data = request.form
	user = User(
		first_name=form_data['firstName'],
		last_name=form_data['lastName'],
		username=form_data['userName']
	)
	db.session.add(user)
	db.session.commit()
	return redirect(url_for('core.index'))
