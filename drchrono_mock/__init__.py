import json
import os
from flask import Flask, request
from flask.json import jsonify

app = Flask(__name__)

with open('__fixtures__/drchrono/offices.json') as f:
    offices = json.load(f)

with open('__fixtures__/drchrono/doctors.json') as f:
    doctors = json.load(f)

patients = []
appointments = []

patient_next_id = int(os.environ.get('PATIENT_NEXT_ID'))
appointment_next_id = int(os.environ.get('APPOINTMENT_NEXT_ID'))


@app.route('/offices/<int:id>', methods=['GET'])
def get_office(id):
    offices_list = [office for office in offices if office["id"] == id]
    if len(offices_list) == 0:
        return {'error': 'Not found office'}, 404
    return offices_list[0], 200


@app.route('/doctors/<int:id>', methods=['GET'])
def get_doctor(id):
    doctors_list = [doctor for doctor in doctors if doctor["id"] == id]
    if len(doctors_list) == 0:
        return {'error': 'Not found doctor'}, 404
    return doctors_list[0], 200


@app.route('/patients', methods=['POST'])
def create_patient():
    global patient_next_id
    data = request.get_json()
    data["id"] = patient_next_id
    patient_next_id += 1
    patients.append(data)
    return data


@app.route('/patients', methods=['GET'])
def get_patients():
    return jsonify(patients)


@app.route('/appointments', methods=['POST'])
def create_appointment():
    global appointment_next_id
    data = request.get_json()
    data["id"] = appointment_next_id
    appointment_next_id += 1
    appointments.append(data)
    return data


@app.route('/appointments', methods=['GET'])
def get_appointments():
    return jsonify(appointments)
