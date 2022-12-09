# project/models/models.py
from project import db

class User(db.Model):
	__tablename__ = 'user'
	id = db.Column(db.Integer, primary_key=True, autoincrement=True)
	first_name = db.Column(db.String(50))
	last_name = db.Column(db.String(50))
	username = db.Column(db.String(50))
	
	def __init__(self, first_name, last_name, username):
		self.first_name = first_name
		self.last_name = last_name
		self.username = username
	
	def __repr__(self):
		return f"ID: {self.id}, First Name: {self.first_name}, Last Name: {self.last_name}, Username: {self.username}"
