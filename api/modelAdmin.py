from werkzeug.security import generate_password_hash


def getAllUsersDB(mysql, email):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `email`, `user_type` FROM `user` WHERE `email` != '{email}'
    """.format(email=email))

    users = cursor.fetchall()
    cursor.close()
    return users


def deleteUserDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""DELETE FROM `user` WHERE `email` = '{id}'
    """.format(id=id))
    mysql.connection.commit()
    cursor.close()


def userInDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `user` WHERE `email` = '{id}'"""
                   .format(id=id))

    exist = cursor.fetchone()
    cursor.close()
    if exist is None:
        return False
    else:
        return True


def getUserDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `name`,`surname`,`email`,
    `phone`,`town`,`place`,
    `street`,`street_num`,
    `user_type` FROM `user` 
    WHERE `email` = '{id}'
    """.format(id=id))
    user = cursor.fetchone()
    cursor.close()
    return user


def getUserTypesFromDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """SELECT `code` as id, `name` as naziv FROM `user_types`""")

    user_types = cursor.fetchall()
    cursor.close()
    return user_types


def updateUserDB(mysql, user):
    cursor = mysql.connection.cursor()
    name = user.get("name")
    surname = user.get("surname")
    email = user.get("email")
    oldEmail = user.get("oldEmail")
    password = user.get("password")
    phone = user.get("phone")
    town = user.get("town")
    place = user.get("place")
    street = user.get("street")
    street_num = user.get("streetNum")
    user_type = user.get("role")

    query = """
        UPDATE `user` 
        SET `email` = '{email}'
         WHERE `user`.`email` = '{id}';
        """.format(email=email, id=oldEmail)

    cursor.execute(query)
    mysql.connection.commit()

    if password == '':
        query = """
        UPDATE `user` 
        SET `name` = '{name}',
        `surname` = '{surname}',
        `phone` = '{phone}',
        `town` = '{town}',
        `place` = '{place}',
        `street` = '{street}',
        `street_num` = '{street_num}',
        `user_type` = '{user_type}'
         WHERE `user`.`email` = '{id}';
        """.format(name=name, surname=surname,
                   phone=phone, town=town, place=place,
                   street=street, street_num=street_num,
                   user_type=user_type, id=email)
    else:
        hashed_value = generate_password_hash(password, method="sha256")
        query = """
        UPDATE `user` 
        SET `name` = '{name}',
        `surname` = '{surname}',
        `password`='{password}',
        `phone` = '{phone}',
        `town` = '{town}',
        `place` = '{place}',
        `street` = '{street}',
        `street_num` = '{street_num}',
        `user_type` = '{user_type}'
         WHERE `user`.`email` = '{id}';
        """.format(name=name, surname=surname,
                   password=hashed_value, phone=phone, town=town,
                   place=place, street=street, street_num=street_num,
                   user_type=user_type, id=email)

    cursor.execute(query)
    mysql.connection.commit()

    cursor.close()


def getAllLandsDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""
    SELECT `agricultural_land`.`id` AS id,
    `agricultural_land`.`name` AS name,
    CONCAT(`user`.`name`,' ',`user`.`surname`) AS pro,
    `opstine`.`naziv` as town,
    `land_type`.`type` as land_type,
    `crops`.`crop` as crop_type,
    `advisor` as advisor 
    FROM `agricultural_land` 
    INNER JOIN `opstine` 
    ON `opstine`.`id` = `agricultural_land`.`town` 
    INNER JOIN `land_type` 
    ON `land_type`.`id` = `agricultural_land`.`land_type_id` 
    INNER JOIN `crops` 
    ON `crops`.`id` = `agricultural_land`.`crop_id` 
    INNER JOIN `user` 
    ON `agricultural_land`.`user_id` = `user`.`email`
    """)

    allLands = cursor.fetchall()
    cursor.close()
    return allLands


def getAdvisorsDB(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `email` as id,
     CONCAT(`name`,' ',`surname`) AS naziv 
     FROM `user` 
     WHERE `user_type` = 'savj'""")

    advisors = cursor.fetchall()
    cursor.close()
    return advisors


def giveLandToAdvisorDB(mysql, data):
    land_id = data.get('land_id')
    advisor = data.get('advisor')

    cursor = mysql.connection.cursor()

    if advisor is not None:
        cursor.execute("""UPDATE `agricultural_land` 
        SET `advisor` = '{advisor}' 
        WHERE `agricultural_land`.`id` = {land_id};
        """.format(land_id=land_id, advisor=advisor))
    else:
        cursor.execute("""UPDATE `agricultural_land` 
        SET `advisor` = NULL 
        WHERE `agricultural_land`.`id` = {land_id};
        """.format(land_id=land_id, advisor=advisor))

    mysql.connection.commit()
    cursor.close()


def getLandInfoDB(mysql, land_id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT CONVERT(`size`,char) AS 'size',
    `agricultural_land`.`place`,
    CONVERT(`expected_yield`,char) AS 'expected_yield',
    CONVERT(`realized_yield`,char) AS 'realized_yield',
    `user_id` AS pro ,
    `agricultural_land`.`advisor` 
    FROM `agricultural_land` 
    INNER JOIN `user` 
    ON `user`.`email` = `agricultural_land`.`user_id` 
    WHERE `id` = {land_id}""".format(land_id=land_id))

    land_info = cursor.fetchone()
    cursor.close()
    return land_info
