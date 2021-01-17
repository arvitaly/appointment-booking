# Appointment Booking Test

![CI workflow](https://github.com/arvitaly/appointment-booking/workflows/ci/badge.svg)

An application for making an appointment with Drchrono based on Flask and React. Flask is used for backend (views and api). React + Antd is used for frontend-logic and UI.

## Install

1. Activate Python Virtual Environment

Example, for MacOS:
```bash
source ./bin/activate
```
2. Install Python requirements
```bash
pip install -r requirements.txt
```
3. Install NodeJS dependencies
```bash
npm install
```
4. Build the client bundle
```bash
npm run build
```
5. Create and fill `.env` file, for example:

```env
DRCHRONO_BASE_URL=https://app.drchrono.com/api
DRCHRONO_OFFICE_ID=305581
DRCHRONO_DOCTOR_ID=287652
DRCHRONO_ACCESS_TOKEN=4t2yCvvnb4TUIUEHFSUDfhDfw
```

## Development

Python server:
```bash
flask run
```

Frontend:

```bash
npm run webdev
```

Webpack will proxy to flask server on port 8000

## Testing

```bash
npm test
```

## Deployment

There is the file `Procfile`, so you can deploy this application on Heroku.