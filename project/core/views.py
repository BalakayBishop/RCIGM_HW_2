# project/core/views.py
from flask import render_template, Blueprint, request, jsonify
from project.models.models import User, UserFiles
from project.core.methods import is_valid, get_file, convert_join
from project import db

core = Blueprint('core', __name__)

# -------------------- ROUTE: INDEX --------------------
@core.route('/')
def home():
	return render_template('home.html')
	
# -------------------- ROUTE: INDEX --------------------
@core.route('/index', methods=['GET', 'POST'])
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
		db.session.flush()
		db.session.commit()
		
		return jsonify({
			'status': 'success',
			'id': user.user_id,
			'userName': user.username,
			'firstName': user.first_name,
			'lastName': user.last_name
		})
	
	return jsonify({ 'status': 'fail' }), 400


# -------------------- ROUTE: UPDATE USER --------------------
@core.route('/update_user', methods=['POST'])
def update_user():
	form_data = request.get_json()
	first_name = form_data['firstName'],
	last_name = form_data['lastName'],
	username = form_data['userName']
	user_id = form_data['current_userid']
	
	if len(first_name) != 0 and len(last_name) != 0 and len(username) != 0:
		user = User.query.filter_by(user_id=user_id).one_or_none()
		if user is not None:
			user.first_name = first_name
			user.last_name = last_name
			user.username = username
			
			db.session.commit()
			
			return jsonify({
				'status': 'success',
				'id': user.user_id,
				'userName': user.username,
				'firstName': user.first_name,
				'lastName': user.last_name
			})
	
	return jsonify({'status': 'fail'}), 400


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
		
	return jsonify({'status': 'fail'}), 400


# -------------------- ROUTE: GET ALL USERS IN DICT --------------------
@core.route('/users', methods=['GET'])
def users():
	from sqlalchemy.orm import sessionmaker
	from project.config import engine
	Session = sessionmaker(bind=engine)
	session = Session()
	query = session.query(User).outerjoin(UserFiles).all()
	result = convert_join(query)
	if result is not None:
		return jsonify(result), 200
	return jsonify({"status": "fail"}), 400
	
# -------------------- ROUTE: UPLOAD FILE --------------------
@core.route('/upload', methods=['POST'])
def upload():
	data = request.get_json()
	userName = data['userName']
	fileName = data['fileName']
	file_path = 'D:\\Projects\\Files\\' + fileName
	user = User.query.filter_by(username=userName).one_or_none()
	if user is not None:
		newFile = UserFiles (
			user_id=user.id,
			file_path=file_path
		)
		db.session.add(newFile)
		db.session.flush()
		new_file_id = newFile.id
		db.session.commit()
		file = get_file(new_file_id)
		if file is not None:
			return jsonify({
				'status': 'success',
				'path': newFile.file_path,
				'file_id': newFile.id
			})
	
	return jsonify({'status': 'fail'}), 400

# -------------------- ROUTE: UPLOAD FILE --------------------
@core.route('/delete_file', methods=['POST'])
def delete_file():
	data = request.get_json()
	file_id = data['file_id']
	file = UserFiles.query.filter_by(id=file_id).one_or_none()
	if file is not None:
		db.session.delete(file)
		db.session.commit()
		return jsonify({'status': 'success'})
	
	return jsonify({'status': 'fail'}), 400
