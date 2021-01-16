from flask import render_template

from backend import app

from backend.drchrono import get_default_doctor, get_default_office


@app.route('/', methods=['GET'])
def index():
    doctor = get_default_doctor()
    office = get_default_office()
    exam_rooms = []
    for exam_room in office["exam_rooms"]:
        if exam_room["online_scheduling"] == True:
            exam_rooms.append(
                {"index": exam_room["index"], "name": exam_room["name"]})
    data = {
        "apiBaseUrl": "api",
        "apiAccessToken": "",
        "office": {
            "name": office["name"],
            "address": office["address"],
            "startTime": office["start_time"],
            "endTime": office["end_time"],
            "phone": office["phone_number"]
        },
        "doctor": {
            "firstName": doctor["first_name"],
            "lastName": doctor["last_name"],
            "specialty": doctor["specialty"],
            "photo": doctor["profile_picture"]
        },
        "examRooms": exam_rooms
    }
    return render_template('index.html', title="Dr. " + doctor["last_name"], data=data)
