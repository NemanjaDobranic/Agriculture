from MySQLdb import cursors
from MySQLdb import IntegrityError
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Mail, Message
import string
import secrets


def getTowns(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `opstine`;""")

    towns = cursor.fetchall()
    cursor.close()
    return towns


def addUserToDB(mysql, user):
    password = user.get("password")
    hashed_value = generate_password_hash(password, method="sha256")

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("""
        INSERT INTO `user` 
        (`name`, `surname`, `email`, `password`, `phone`, `town`, `place`, `street`, `street_num`, `user_type`, `temp_password`) 
        VALUES 
        ('{name}', '{surname}', '{email}' , '{password}', '{phone}', '{town}', '{place}', '{street}', '{street_num}', 'pro', NULL);"""
                       .format(name=user.get("name"), surname=user.get("surname"), email=user.get("email"),
                               password=hashed_value, phone=user.get("phone"), town=user.get("town"),
                               place=user.get("place"), street=user.get("street"), street_num=user.get("street_num")))

        mysql.connection.commit()
    except IntegrityError as e:
        message = user.get("email") + ' već postoji u bazi podataka!\n'
        message += 'Promijenite adresu e-pošte.'
        return message

    cursor.close()
    return 'Uspješno ste se prijavili!'


def doesUserExist(mysql, email):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `user` WHERE `email` = '{email}'"""
                   .format(email=email))

    exist = cursor.fetchone()
    cursor.close()
    if exist is None:
        return False
    else:
        return True


def generateTempPass():
    """
    Forcing length to be 12 characters
    Forcing at least 2 lower case character
    Forcing at least 2 upper case characters
    Forcing at least 2 digits
    """
    alphabet = string.ascii_letters + string.digits + '-_'
    while True:
        password = ''.join(secrets.choice(alphabet) for i in range(12))
        if (sum(c.islower() for c in password) >= 2
                and sum(c.isupper() for c in password) >= 2
                and sum(c.isdigit() for c in password) >= 2):
            break
    return password


def sendEmail(email, temp_password, mail):
    body = "Privremena lozinka: " + temp_password
    msg = Message(subject='Nova privremena lozinka',
                  sender=mail.username, recipients=[email], body=body)
    mail.send(msg)


def setTempPasswordDB(mysql, email, mail):
    if doesUserExist(mysql, email):
        temp_password = generateTempPass()
        hashed_value = generate_password_hash(temp_password, method="sha256")

        cursor = mysql.connection.cursor()
        cursor.execute("""
        UPDATE `user` SET `temp_password` = '{temp_password}' WHERE `user`.`email` = '{email}';"""
                       .format(email=email, temp_password=hashed_value))
        mysql.connection.commit()
        cursor.close()
        sendEmail(email, temp_password, mail)
        return 'Privremena lozina je poslata. Provjerite prijemno sanduče.'
    else:
        return email + ' nije pronađen u bazi podataka!'


def hasTempPassword(mysql, email):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT * FROM `user` WHERE `email` = '{email}' AND `temp_password` != 'NULL'"""
                   .format(email=email))

    exist = cursor.fetchone()
    cursor.close()
    if exist is None:
        return None
    else:
        return exist


def loginDB(mysql, user):
    email = user.get("email")

    if doesUserExist(mysql, email) == False:
        message = email + ' ne postoji u bazi podataka! \n'
        message += "Molimo registrujte se."
        return {'answer': message}

    exist = hasTempPassword(mysql, email)
    if exist == None:
        cursor = mysql.connection.cursor()
        cursor.execute("""SELECT * FROM `user` WHERE `email` = '{email}'"""
                       .format(email=email))

        dataRow = cursor.fetchone()
        cursor.close()
        if check_password_hash(dataRow.get('password'), user.get('password')):
            data = {'answer': 'OK', 'role': dataRow.get('user_type')}
            return data
        else:
            return {'answer': 'Lozinka je netačna!'}
    else:
        if check_password_hash(exist.get('temp_password'), user.get('password')):
            return {'answer': 'Privremena lozinka'}
        else:
            return {'answer': 'Lozinka je netačna!'}


def setNewPasswordDB(mysql, user):
    exist = hasTempPassword(mysql, user.get("email"))
    if exist != None:
        password = user.get("password")
        hashed_value = generate_password_hash(password, method="sha256")

        cursor = mysql.connection.cursor()

        cursor.execute("""UPDATE `user` SET `password` = '{password}', `temp_password` = NULL WHERE `user`.`email` = '{email}';"""
                       .format(email=user.get("email"), password=hashed_value))

        mysql.connection.commit()
        cursor.close()
        return 'Lozinka je promijenjena. Sada se možete prijaviti.'
    else:
        return user.get("email")
