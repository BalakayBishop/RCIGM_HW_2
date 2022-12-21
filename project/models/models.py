# project/models/models.py
from project import db

class User(db.Model):
	__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	first_name = db.Column(db.String(50))
	last_name = db.Column(db.String(50))
	username = db.Column(db.String(50), unique=True)
	
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
