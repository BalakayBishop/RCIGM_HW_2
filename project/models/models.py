# project/models/models.py
from project import db

class User(db.Model):
	__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	first_name = db.Column(db.String(50))
	last_name = db.Column(db.String(50))
	username = db.Column(db.String(50), unique=True)
	
	files = db.relationship('UserFiles', backref='files', lazy='dynamic', cascade='all, delete')
	
	def __init__(self, first_name, last_name, username):
		self.first_name = first_name
		self.last_name = last_name
		self.username = username
	
	def as_dict(self):
		user = {
			'id': self.id,
			'firstName': self.first_name,
			'lastName': self.last_name,
			'userName': self.username
		}
		return user
	
	
class UserFiles(db.Model):
	__tablename__ = 'files'
	
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
	file_path = db.Column(db.String(255))
	
	def __init__(self, user_id, file_path):
		self.user_id = user_id
		self.file_path = file_path
		
	def as_dict(self):
		file = {
			'id': self.id,
			'user_id': self.user_id,
			'file_path': self.file_path
		}
		return file
