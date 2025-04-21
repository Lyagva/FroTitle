import os
import json

import flask
from flask import Flask, render_template, send_from_directory, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Importing CORS
from flask.json import jsonify
from jinja2 import Environment, FileSystemLoader

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="http://127.0.0.1:5000")

# Enable CORS for all routes
CORS(app, origins="http://127.0.0.1:5000")  # Allow requests from the same domain

# Path to the modules directory
MODULES_DIR = './modules'


@app.route('/program')
def program():
    modules = []
    modules_list = [i.replace("\n", "") for i in open("modules/enabled_modules.txt", mode="r+", encoding="UTF-8").readlines()]

    for module_name in modules_list:
        module_path = os.path.join(MODULES_DIR, module_name)
        if os.path.isdir(module_path):
            modules.append(module_name)
    print(modules)
    return render_template('program.html', modules=modules)


@app.route('/modules/<module_name>')
def serve_module(module_name):
    modeule_env = Environment(loader=FileSystemLoader(f'./modules/{module_name}'))
    template = modeule_env.get_template("index.html")

    return template.render(static_path=f"/modules/{module_name}/static")

@app.route("/modules/<module_name>/static/<filename>")
def serve_module_static_file(module_name, filename):
    module_path = os.path.join(MODULES_DIR, module_name)
    return send_from_directory(module_path, filename)

@app.route("/module_loader")
def module_loader():
    return flask.send_file("static/module.js")


@app.route('/control')
def control():
    # Read all modules' public configurations
    modules_config = {}
    modules_list = [i.replace("\n", "") for i in open("modules/enabled_modules.txt", mode="r+", encoding="UTF-8").readlines()]

    for module_name in modules_list:
        module_path = os.path.join(MODULES_DIR, module_name, 'module.json')
        if os.path.isfile(module_path):
            with open(module_path, 'r', encoding="UTF-8") as file:
                modules_config[module_name] = json.load(file)
    return render_template('control.html', modules_config=modules_config)


@socketio.on('triggerAnimation')
def handle_trigger(data):
    emit(f'triggerAnimation', data, broadcast=True)


@socketio.on('updateField')
def handle_update_field(data):
    emit(f'updateField', data, broadcast=True)


@socketio.on('updateProperty')
def handle_update_property(data):
    emit(f'updateProperty', data, broadcast=True)


if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
