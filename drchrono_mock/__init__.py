import json
from flask import Flask
from flask.json import jsonify

app = Flask(__name__)

with open('__fixtures__/drchrono/offices.json') as f:
    offices = json.load(f)

with open('__fixtures__/drchrono/doctors.json') as f:
    doctors = json.load(f)


@app.route('/offices/<int:id>', methods=['GET'])
def get_office(id):
    offices_list = [office for office in offices if office["id"] == id]
    if len(offices_list) == 0:
        return {'error': 'Not found office'}, 404
    return jsonify(offices_list[0]), 200


@app.route('/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    doctors_list = [doctor for doctor in doctors if doctor["id"] == id]
    if len(doctors_list) == 0:
        return {'error': 'Not found doctor'}, 404
    return jsonify(doctors_list[0]), 200
