# project/replica/views.py

from flask import render_template, Blueprint, request, jsonify
from project.models.models import User, UserFiles
from project.core.methods import is_valid, convert_join
from sqlalchemy.orm import sessionmaker
from project.config import engine

Session = sessionmaker(bind=engine)
session = Session()

replica = Blueprint('replica', __name__)

@replica.route('/replica')
def replica_home():
	return render_template('replica.html')