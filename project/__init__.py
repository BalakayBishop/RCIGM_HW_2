# project/__init__.py
from flask_sqlalchemy import SQLAlchemy
from flask import Flask

def create_app():
	app = Flask(__name__)
	app.config.from_pyfile('config.py')
	return app

# -----------------------------Assigning the created app to APP-----------------------------------
APP = create_app()

# --------------------------Initializing the SQLAlchemy with APP to db----------------------------
db = SQLAlchemy(APP)

# ---------------------------Registering the Blueprints for the views-----------------------------
from project.core.views import core
from project.replica.views import replica
APP.register_blueprint(core)
APP.register_blueprint(replica)
