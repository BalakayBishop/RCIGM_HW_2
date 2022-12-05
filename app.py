import os
from flask import Flask, request, render_template, url_for, redirect
from dotenv import load_dotenv, find_dotenv
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

load_dotenv(find_dotenv())

conn = f"mysql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}@{os.getenv('DB_HOST')}/{os.getenv('DB_NAME')}"
app.config['SQLALCHEMY_DATABASE_URI'] = conn
app.config['SQLALCHEMY_TRACK_MODIFICATION'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.secret_key = os.getenv('SECRET_KEY')
db = SQLAlchemy(app)


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


@app.route('/')
def index():
	user = User.query.all()
	return render_template('index.html', user=user)


@app.route('/api', methods=['GET', 'POST'])
def api():
	form_data = request.form
	user = User(
		first_name=form_data['firstName'],
		last_name=form_data['lastName'],
		username=form_data['userName']
	)
	db.session.add(user)
	db.session.commit()
	return redirect(url_for('index'))


if __name__ == '__main__':
	app.run()
