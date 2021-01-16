from backend.Config import Config
from urllib.parse import urlencode
import requests


class NonUniqueError(Exception):
    pass


def do_post_request(path, params={}):
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer " +
                         Config.drchrono_access_token}
    response = requests.post(Config.drchono_base_url +
                             "/" + path, json=params, headers=headers)
    if response.status_code == 409:
        raise NonUniqueError()
    response.raise_for_status()
    return response.json()


def do_get_request(path, params={}):
    headers = {"Authorization": "Bearer " +
               Config.drchrono_access_token}
    response = requests.get(Config.drchono_base_url +
                            "/" + path + "?" + urlencode(params), headers=headers)
    response.raise_for_status()
    return response.json()


def get_default_office():
    return get_office(Config.drchrono_office_id)


def get_office(id):
    return do_get_request(f"offices/{id}")


def get_default_doctor():
    return get_doctor(Config.drchrono_doctor_id)


def get_doctor(id):
    return do_get_request(f"doctors/{id}")


def create_patient(data):
    return do_post_request(f"patients", data)


def create_appointment(data):
    return do_post_request(f"appointments", data)
