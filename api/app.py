from flask import Flask, request, session, jsonify, redirect
from databaseinit import initDb
from emailinit import initEmail
from modelLogin import getTowns, addUserToDB, setTempPasswordDB, loginDB, setNewPasswordDB
from modelHome import getCropsDB, getLandTypesDB, getMeasuredUnitsDB, addLandToDB, getTableDataDB, deleteLandDB, getLandDB, updateLandDB, landInDB, getCheckBoxNamesDB, saveConnectedUnitsDB
from modelVisualisation import getNumOfDiagramsDB, getGraphsDataDB, getPhysicalUnitsDB
from modelAdmin import getAllUsersDB, deleteUserDB, userInDB, getUserDB, getUserTypesFromDB, updateUserDB, getAllLandsDB, getAdvisorsDB, giveLandToAdvisorDB, getLandInfoDB
from thingSpeak import getFieldsNames, updateMeasurementsTable
import json
from flask_cors import CORS
from apscheduler.schedulers.background import BackgroundScheduler

# app
app = Flask(__name__)
app.config['SECRET_KEY'] = '5d3wf6cj02qaxl'
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SESSION_COOKIE_SECURE'] = True

# CORS
CORS(app, supports_credentials=True)

# MySQL
mysql = initDb(app)
mail = initEmail(app)


def midnightUpdate():
    with app.app_context():
        updateMeasurementsTable(mysql)


# Scheduler
sched = BackgroundScheduler(daemon=True)
sched.add_job(midnightUpdate, trigger='cron', minute='0')
sched.start()


@app.route('/getTowns', methods=['GET', 'POST'])
def home():
    if request.method == 'GET':
        dictTowns = getTowns(mysql)
        response = jsonify(dictTowns)
        return response


@app.route('/addUser', methods=['POST'])
def addUser():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))

    response = jsonify(addUserToDB(mysql, dict_data))
    return response


@app.route('/getTempPassword', methods=['POST'])
def getTempPassword():
    email = request.get_json(force=True)

    response = jsonify(setTempPasswordDB(mysql, email, mail))
    return response


@app.route('/login', methods=['POST'])
def login():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))

    data = loginDB(mysql, dict_data)
    response = jsonify(data.get('answer'))
    if data.get('answer') == 'OK':
        session['email'] = dict_data.get("email")
        session['role'] = data.get('role')
        session.modified = True
    return response


@app.route('/setNewPassword', methods=['POST'])
def setNewPassword():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))

    response = jsonify(setNewPasswordDB(mysql, dict_data))
    return response


@app.route('/getsession', methods=['GET'])
def getsession():
    if 'email' in session:
        response = jsonify(
            {'email': session['email'], 'role': session['role']})
    else:
        response = jsonify(False)

    return response


@app.route('/logout')
def logout():
    session.pop('email', None)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getCrops', methods=['GET', 'POST'])
def getCrops():
    if request.method == 'GET':
        crops = getCropsDB(mysql)
        response = jsonify(crops)
        return response


@app.route('/getLandTypes', methods=['GET', 'POST'])
def getLandTypes():
    if request.method == 'GET':
        land_types = getLandTypesDB(mysql)
        response = jsonify(land_types)
        return response


@app.route('/getMeasuredUnits', methods=['GET', 'POST'])
def getMeasuredUnits():
    if request.method == 'GET':
        measuredUnits = getMeasuredUnitsDB(mysql)
        response = jsonify(measuredUnits)
        return response


@app.route('/addLand', methods=['POST'])
def addLand():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))

    response = jsonify(addLandToDB(mysql, dict_data, session['email']))
    return response


@app.route('/getTableData', methods=['GET'])
def getTableData():
    email = request.args.get('email', '', type=str)
    tableData = getTableDataDB(mysql, email, session['role'])
    response = jsonify(tableData)
    return response


@app.route('/deleteLand', methods=['POST'])
def deleteLand():
    json_data = request.get_json(force=True)
    deleteLandDB(mysql, json_data)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getLand', methods=['GET'])
def getLand():

    id = request.args.get('id', 0, type=int)
    if landInDB(mysql, id):
        land = getLandDB(mysql, id)
        response = jsonify(land)
        return response
    else:
        return json.dumps({'success': True}), 302, {'ContentType': 'application/json'}


@app.route('/updateLand', methods=['POST'])
def updateLand():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))
    updateLandDB(mysql, dict_data, session['role'])
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getNumOfDiagrams', methods=['GET'])
def getNumOfDiagrams():
    id = request.args.get('id', 0, type=int)
    if landInDB(mysql, id):
        session['land_id'] = id
        units = getNumOfDiagramsDB(mysql, session['land_id'])
        response = jsonify(units)
        return response
    else:
        return json.dumps({'success': True}), 302, {'ContentType': 'application/json'}


@app.route('/getUnits', methods=['GET'])
def getPhysicalUnits():
    land_id = request.args.get('id', 0, type=int)
    physicalUnits = getPhysicalUnitsDB(mysql, land_id)
    response = jsonify(physicalUnits)
    return response


@app.route('/getGraphsData', methods=['GET'])
def getGraphsData():
    unit = request.args.get('unit', None, type=str)
    start = request.args.get('start', None, type=str)
    end = request.args.get('end', None, type=str)

    data = getGraphsDataDB(mysql, session['land_id'], unit, start, end)
    response = jsonify(data)
    return response


@app.route('/getAllUsers', methods=['GET'])
def getAllUsers():
    if session['role'] == 'admin':
        users = getAllUsersDB(mysql, session['email'])
        response = jsonify(users)
        return response


@app.route('/deleteUser', methods=['POST'])
def deleteUser():
    json_data = request.get_json(force=True)
    deleteUserDB(mysql, json_data)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getUser', methods=['GET'])
def getUser():
    id = request.args.get('id', '', type=str)
    if userInDB(mysql, id):
        user = getUserDB(mysql, id)
        response = jsonify(user)
        return response
    else:
        return json.dumps({'success': True}), 302, {'ContentType': 'application/json'}


@app.route('/getUserTypes', methods=['GET'])
def getUserTypes():
    dictUserTypes = getUserTypesFromDB(mysql)
    response = jsonify(dictUserTypes)
    return response


@app.route('/updateUser', methods=['POST'])
def updateUser():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))
    updateUserDB(mysql, dict_data)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getAllLands', methods=['GET'])
def getAllLands():
    allLands = getAllLandsDB(mysql)
    response = jsonify(allLands)
    return response


@app.route('/getAdvisors', methods=['GET'])
def getAdvisors():
    advisors = getAdvisorsDB(mysql)
    response = jsonify(advisors)
    return response


@app.route('/giveLandToAdvisor', methods=['POST'])
def giveLandToAdvisor():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))
    giveLandToAdvisorDB(mysql, dict_data)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


@app.route('/getLandInfo', methods=['GET'])
def getLandInfo():
    land_id = request.args.get('id', '', type=int)
    landData = getLandInfoDB(mysql, land_id)
    response = jsonify(landData)
    return response


@app.route('/getChannelFields', methods=['GET'])
def getChannelFields():
    channelID = request.args.get('channelID', '', type=int)
    readKey = request.args.get('readKey', '', type=str)
    fields = getFieldsNames(channelID, readKey)
    response = jsonify(fields)
    return response


@app.route('/getCheckBoxNames', methods=['GET'])
def getCheckBoxNames():
    land_id = request.args.get('land_id', '', type=int)
    checkBoxData = getCheckBoxNamesDB(mysql, land_id)
    response = jsonify(checkBoxData)
    return response


@app.route('/saveConnectedUnits', methods=['POST'])
def saveConnectedUnits():
    json_data = request.get_json(force=True)
    dict_data = json.loads(json.dumps(json_data))
    saveConnectedUnitsDB(mysql, dict_data)
    return json.dumps({'success': True}), 200, {'ContentType': 'application/json'}


if __name__ == "__main__":
    app.run()
