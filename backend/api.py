from backend.drchrono import NonUniqueError, create_appointment, create_patient
from flask import request, jsonify
from flask_expects_json import expects_json
from datetime import datetime
from backend import app
from backend.Config import Config


create_appointment_schema = {
    "type": "object",
    "properties": {
        "firstName": {"type": "string", "minLength": 2, },
        "lastName": {"type": "string", "minLength": 2, },
        "email": {"type": "string", "minLength": 2, format: "email"},
        "gender": {"type": "string"},
        "duration": {"type": "number", "minimum": 1},
        "scheduledTimestamp": {"type": "number", "minimum": 946656000000, "maximum": 3155731200000},
        "examRoomIndex": {"type": "number", "minimum": 1}
    },
    "required": ["firstName", "lastName", "gender",  "duration", "scheduledTimestamp", "examRoomIndex"]
}


datetime_iso_format = "%Y-%m-%dT%H:%M:00"


@app.route('/api/appointments', methods=['POST'])
@expects_json(create_appointment_schema)
def api_create_appointment():

    data = request.get_json()

    scheduled_date_time = datetime.fromtimestamp(
        int(data["scheduledTimestamp"]/1000))
    scheduled_iso_date_time = scheduled_date_time.strftime(datetime_iso_format)
    patient = create_patient({
        "first_name": data["firstName"],
        "last_name": data["lastName"],
        "email": data["email"],
        "doctor": Config.drchrono_doctor_id,
        "gender": data["gender"],
    })

    try:
        appointment = create_appointment({
            "exam_room": data["examRoomIndex"],
            "doctor": Config.drchrono_doctor_id,
            "patient": patient["id"],
            "office": Config.drchrono_office_id,
            "scheduled_time": scheduled_iso_date_time,
            "duration": data["duration"],
            "reason": data["reason"]
        })

        return jsonify({
            "appointment": {
                "id": appointment["id"],
                "scheduledDateTime": datetime.strptime(appointment["scheduled_time"], datetime_iso_format).timestamp() * 1000
            },
            "patient": {
                "firstName": patient["first_name"],
                "lastName": patient["last_name"],
            }
        })
    except NonUniqueError:
        return jsonify({}), 409
