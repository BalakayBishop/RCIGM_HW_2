# project/core/views.py
from flask import render_template, Blueprint, request, redirect, url_for
from project.models.models import User
from project import db

core = Blueprint('core', __name__)

@core.route('/')
def index():
	user = User.query.all()
	return render_template('index.html', user=user)


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
