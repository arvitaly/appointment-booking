import os


class Config:
    drchrono_doctor_id = int(os.environ.get('DRCHRONO_DOCTOR_ID'))
    drchrono_office_id = int(os.environ.get('DRCHRONO_OFFICE_ID'))
    drchono_base_url = os.environ.get('DRCHRONO_BASE_URL')
    drchrono_access_token = os.environ.get('DRCHRONO_ACCESS_TOKEN')
