def getCropsDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `crops_types`.`id` AS 'tip_id',
    `crops_types`.`name` AS 'tip'
    FROM `crops_types`""")
    crops_types = cursor.fetchall()

    cursor.execute(
        """SELECT `crops`.`type_id` AS 'tip_id', `crops`.`id`, `crops`.`crop` AS 'naziv' FROM `crops`""")
    crops = cursor.fetchall()

    data = []
    for type in crops_types:
        list = []
        for crop in crops:
            if crop["tip_id"] == type["tip_id"]:
                list.append(crop)
        object = {"type": type["tip"], "options": list}
        data.append(object)

    cursor.close()
    return data


def getLandTypesDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `id`, `type` AS 'naziv' FROM `land_type`;""")

    land_types = cursor.fetchall()
    cursor.close()
    return land_types


def getMeasuredUnitsDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `measured_units`;""")

    measuredUnits = cursor.fetchall()
    cursor.close()
    return measuredUnits


def getUserType(mysql, email):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT `user_type` FROM `user` WHERE `email` = '{email}'""".format(email=email))

    user_type = cursor.fetchone().get('user_type')
    cursor.close()
    return user_type


def addLandToDB(mysql, land, email):
    cursor = mysql.connection.cursor()
    try:
        name = land.get("name")
        size = land.get("size")
        town = land.get("town")
        land_type_id = land.get('landType')
        crop_id = land.get("crop")
        place = land.get("place")
        longitude = land.get("longitude")
        latitude = land.get("latitude")
        expected_yield = land.get("expectedYield")
        realisedYield = land.get("realisedYield")
        cboxIDs = land.get("cboxIDs")
        userEmail = land.get("userEmail")

        if userEmail is None:
            id = email
            message = 'Nova površina je uspješno dodata.'
        else:
            id = userEmail
            userType = getUserType(mysql, id)
            if userType == 'pro':
                message = 'Proizvođaču {id} je uspješno dodata nova površina.'.format(
                    id=id)
            else:
                return 'Greška. Korisnik {id} nije proizvođač. Neuspješno dodavanje površine.'.format(
                    id=id)

        query = """INSERT INTO `agricultural_land` (`id`, `user_id`, `name`, `size`, `town`, `land_type_id`,`crop_id`, `place`, `longitude`, `latitude`, `expected_yield`, `realized_yield`)
        VALUES (NULL, '{user_id}', '{name}', '{size}', '{town}', '{land_type_id}', '{crop_id}',
                '{place}', '{longitude}','{latitude}', '{expected_yield}', '{realized_yield}');
        """.format(user_id=id, name=name, size=size, town=town,
                   land_type_id=land_type_id, crop_id=crop_id, place=place, longitude=longitude,
                   latitude=latitude, expected_yield=expected_yield, realized_yield=realisedYield)
        cursor.execute(query)
        mysql.connection.commit()

        cursor.execute(
            """SELECT `id` FROM `agricultural_land` ORDER BY `id` DESC LIMIT 1""")
        land_id = cursor.fetchone()['id']
        units = []
        for id in cboxIDs:
            units.append([land_id, id])
        query = """INSERT INTO `land_units` (`land_id`, `unit_id`) VALUES (%s, %s)"""
        cursor.executemany(query, units)
        mysql.connection.commit()
    except Exception as e:
        cursor.close()
        return e

    cursor.close()
    return message


def getTableDataDB(mysql, email, role):
    cursor = mysql.connection.cursor()
    if role == 'pro':
        query = """SELECT `agricultural_land`.`id`,`name`,`naziv`,CONVERT(`size`,char) AS 'size',
                `type`,`crop`,`place`, CONVERT(`expected_yield`,char) AS 'expected_yield',
                CONVERT(`realized_yield`,char) AS 'realized_yield' FROM `agricultural_land`,
                `opstine`,`land_type`,`crops`
                WHERE `town` = `opstine`.`id`
                AND `land_type_id` =`land_type`.`id`
                AND `crop_id` = `crops`.`id`
                AND `user_id` = '{email}'
                """.format(email=email)
    else:
        query = """SELECT `agricultural_land`.`id`,`name`,`naziv`,CONVERT(`size`,char) AS 'size',
                `type`,`crop`,`place`, CONVERT(`expected_yield`,char) AS 'expected_yield',
                CONVERT(`realized_yield`,char) AS 'realized_yield' FROM `agricultural_land`,
                `opstine`,`land_type`,`crops`
                WHERE `town` = `opstine`.`id`
                AND `land_type_id` =`land_type`.`id`
                AND `crop_id` = `crops`.`id`
                AND `advisor` = '{email}'
                """.format(email=email)
    cursor.execute(query)

    data = cursor.fetchall()
    cursor.close()
    return data


def deleteLandDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""DELETE FROM `land_units` WHERE `land_units`.`land_id` = {id}
    """.format(id=id))
    mysql.connection.commit()
    cursor.execute("""DELETE FROM `agricultural_land` WHERE `agricultural_land`.`id` = {id}
    """.format(id=id))
    mysql.connection.commit()
    cursor.close()


def getLandDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `name`,CONVERT(`size`,char) AS `size`,`town`,
    `land_type_id`,`crop_id`,`place`,
    CONVERT(`longitude`,char) AS `longitude`,
    CONVERT(`latitude`,char) AS `latitude`,
    CONVERT(`expected_yield`,char) AS `expected_yield`,
    CONVERT(`realized_yield`,char) AS `realized_yield`,
    CONVERT(`channel_id`,char) AS `channel_id`,
    read_key
    FROM `agricultural_land`
    WHERE `id`= {id}
    """.format(id=id))
    land = cursor.fetchone()

    cursor.execute("""SELECT `unit_id` FROM `land_units` WHERE `land_id`={id}
    """.format(id=id))

    units = {"units": cursor.fetchall()}
    land.update(units)
    cursor.close()
    return land


def updateLandDB(mysql, land, role):
    cursor = mysql.connection.cursor()
    id = land.get("id")
    name = land.get("name")
    size = land.get("size")
    town = land.get("town")
    land_type_id = land.get('landType')
    crop_id = land.get("crop")
    place = land.get("place")
    longitude = land.get("longitude")
    latitude = land.get("latitude")
    expected_yield = land.get("expectedYield")
    realized_yield = land.get("realisedYield")
    channelID = land.get("channelID")
    readKey = land.get("readKey")
    cboxIDs = land.get("cboxIDs")

    if role == 'admin':
        query = """UPDATE `agricultural_land` 
        SET `name` = '{name}', `size` = '{size}',
        `town` = '{town}', `land_type_id` = '{land_type_id}', 
        `crop_id` = '{crop_id}', `place` = '{place}',
        `longitude` = '{longitude}', `latitude` = '{latitude}',
        `expected_yield` = '{expected_yield}', `realized_yield` = '{realized_yield}',
        `channel_id` = '{channelID}',  `read_key` = '{readKey}'
        WHERE `agricultural_land`.`id` = {id};
        """.format(name=name, size=size, town=town, land_type_id=land_type_id,
                   crop_id=crop_id, place=place, longitude=longitude, latitude=latitude,
                   expected_yield=expected_yield, realized_yield=realized_yield, id=id,
                   channelID=channelID, readKey=readKey)
    else:
        query = """UPDATE `agricultural_land` 
        SET `name` = '{name}', `size` = '{size}',
        `town` = '{town}', `land_type_id` = '{land_type_id}', 
        `crop_id` = '{crop_id}', `place` = '{place}',
        `longitude` = '{longitude}', `latitude` = '{latitude}',
        `expected_yield` = '{expected_yield}', `realized_yield` = '{realized_yield}'
        WHERE `agricultural_land`.`id` = {id};
        """.format(name=name, size=size, town=town, land_type_id=land_type_id,
                   crop_id=crop_id, place=place, longitude=longitude, latitude=latitude,
                   expected_yield=expected_yield, realized_yield=realized_yield, id=id)

    cursor.execute(query)
    mysql.connection.commit()

    cursor.execute("""SELECT CONVERT(`unit_id`,char) AS 'unit_id', `field`
    FROM `land_units` WHERE `land_units`.`land_id` = {id}""".format(id=id))
    fetched_old_units = list(cursor.fetchall())
    old_units = {}
    for old_unit in fetched_old_units:
        key = old_unit['unit_id']
        value = old_unit['field']
        old_units[key] = value
    print(old_units)

    units = []
    for boxID in cboxIDs:
        if boxID in old_units:
            units.append([id, boxID, old_units[boxID]])
        else:
            units.append([id, boxID, None])

    cursor.execute("""DELETE FROM `land_units` WHERE `land_units`.`land_id` = {id}
    """.format(id=id))
    mysql.connection.commit()

    query = """INSERT INTO `land_units` (`land_id`, `unit_id`,`field`) VALUES (%s, %s,%s)"""
    cursor.executemany(query, units)
    mysql.connection.commit()

    cursor.close()


def landInDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `agricultural_land` WHERE `id` = {id}"""
                   .format(id=id))

    exist = cursor.fetchone()
    cursor.close()
    if exist is None:
        return False
    else:
        return True


def getCheckBoxNamesDB(mysql, land_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `measured_units`.`unit`, `land_units`.`field` 
    FROM `land_units` 
    INNER JOIN `measured_units` 
    ON `measured_units`.`id` = `land_units`.`unit_id` 
    WHERE `land_units`.`land_id` = '{land_id}'""".format(land_id=land_id))

    checkBoxData = cursor.fetchall()
    cursor.close()
    return checkBoxData


def saveConnectedUnitsDB(mysql, land_units):
    cursor = mysql.connection.cursor()
    land_id = land_units[0][0]
    cursor.execute("""DELETE FROM `land_units` WHERE `land_units`.`land_id` = {id}
    """.format(id=land_id))
    mysql.connection.commit()

    query = """INSERT INTO `land_units` (`land_id`, `unit_id`,`field`) 
    SELECT %s, `measured_units`.`id`, %s 
    FROM `measured_units` 
    WHERE `measured_units`.`unit` = %s"""
    cursor.executemany(query, land_units)
    mysql.connection.commit()

    cursor.close()
