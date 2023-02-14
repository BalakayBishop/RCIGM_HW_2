# project/core/views.py
from flask import render_template, Blueprint, request, jsonify, send_file
from project.models.models import User, UserFiles
from project.core.methods import convert_join
from sqlalchemy.orm import sessionmaker
from project.config import engine
import os

Session = sessionmaker(bind=engine)
session = Session()

core = Blueprint('core', __name__)

# -------------------- ROUTE: HOME/LOGIN --------------------
@core.route('/')
def home():
	return render_template('home.html')
	

# -------------------- ROUTE: INDEX --------------------
@core.route('/index', methods=['GET', 'POST'])
def index():
	return render_template('index.html')


# -------------------- ROUTE: GET ALL USERS IN DICT --------------------
@core.route('/users', methods=['GET'])
def users():
	session.flush()
	query = session.query(User).outerjoin(UserFiles).all()
	result = convert_join(query)
	if result is not None:
		return jsonify(result), 200
	return jsonify({"status": "fail"}), 400

	
# -------------------- ROUTE: USERNAME VALIDATION --------------------
@core.route('/username_validation', methods=['GET'])
def username_validation():
	passedUsername = request.args.get('username')
	if passedUsername != '':
		query = session.query(User).filter(User.username == passedUsername).one_or_none()
		if query is not None:
			return jsonify({'status': 'found'}), 200
		else:
			return jsonify({'status': 'not found'}), 200
	
	return jsonify({'status': 'none'}), 200
	

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
		session.add(user)
		session.commit()
		
		return jsonify({
			'status': 'success',
			'user_id': user.user_id,
			'userName': user.username,
			'firstName': user.first_name,
			'lastName': user.last_name
		}), 200
	
	return jsonify({ 'status': 'fail' }), 400


# -------------------- ROUTE: UPDATE USER --------------------
@core.route('/update_user', methods=['PUT'])
def update_user():
	form_data = request.get_json()
	first_name = form_data['firstName'],
	last_name = form_data['lastName'],
	username = form_data['userName']
	current_id = form_data['current_userid']
	
	user = session.query(User).filter(User.user_id == current_id).one_or_none()
	if user is not None:
		session.query(User).filter(User.user_id == current_id).update({
			'first_name': first_name,
			'last_name': last_name,
			'username': username
		}, synchronize_session='fetch')
		session.commit()

		return jsonify({
			'status': 'success',
			'user_id': user.user_id,
			'userName': user.username,
			'firstName': user.first_name,
			'lastName': user.last_name
		}), 200
	
	return jsonify({'status': 'fail'}), 400


# -------------------- ROUTE: DELETE USER --------------------
@core.route('/delete_user', methods=['DELETE'])
def delete_user():
	data = request.get_json()
	user_id = data['user_id']
	
	if len(user_id) != 0:
		user = session.query(User).filter(User.user_id==user_id).one_or_none()
		if user is not None:
			session.delete(user)
			session.commit()
			return jsonify({'status': 'success'}), 200
		
	return jsonify({'status': 'fail'}), 400

	
# -------------------- ROUTE: UPLOAD FILE --------------------
@core.route('/upload', methods=['POST'])
def upload():
	file = request.files['file']
	user_id = request.form['user_id']
	if file:
		file_name = file.filename
		file_path = 'D:/Projects/Files/Uploads/'
		file.save(os.path.join(file_path, file_name))
		user = session.query(User).filter(User.user_id==user_id).one_or_none()
		if user is not None:
			new_file = UserFiles (
				user_id=user.user_id,
				file_path=file_path,
				file_name=file_name
			)
			session.add(new_file)
			session.commit()
			
			return jsonify({
				'status': 'success',
				'file_name': new_file.file_name,
				'file_id': new_file.file_id
			}), 200
	
	return jsonify({'status': 'fail'}), 400


# -------------------- ROUTE: DOWNLOAD FILE --------------------
@core.route('/download_file', methods=['GET'])
def download_file():
	file_id = request.args.get('file_id')
	print(file_id)
	file = session.query(UserFiles).filter(UserFiles.file_id == file_id).one_or_none()
	if file is not None:
		file_name = file.file_name
		file_path = file.file_path
		print(file_path+file_name)
		# return send_from_directory("D:\\Projects\\Files\\Uploads\\", "text.txt", as_attachment=True)
		return send_file(file_path+file_name, as_attachment=True)
	
	return jsonify({'status': 'fail'}), 400


# -------------------- ROUTE: DELETE FILE --------------------
@core.route('/delete_file', methods=['DELETE'])
def delete_file():
	data = request.get_json()
	file_id = data['file_id']
	file = session.query(UserFiles).filter(UserFiles.file_id==file_id).one_or_none()
	if file is not None:
		session.delete(file)
		session.commit()
		return jsonify({'status': 'success'}), 200
	
	return jsonify({'status': 'fail'}), 400
