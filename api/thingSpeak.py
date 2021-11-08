import urllib
import json
import re
from datetime import datetime, timedelta


def getFieldsNames(channelID, readKey):
    try:
        response = urllib.request.urlopen(
            'https://api.thingspeak.com/channels/{channelID}/feeds.json?api_key={readKey}'.format(channelID=channelID, readKey=readKey))
        the_page = json.loads(response.read())
        channel = the_page['channel']
        result = {key: channel[key]
                  for key in channel if re.match(r"field\d+", key)}
        return result
    except urllib.error.HTTPError:
        return 'Ne postoje polja sa zadatim ID: ' + str(channelID) + ' i API: ' + readKey


def updateMeasurementsTable(mysql):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `id`,`channel_id`,`read_key` 
    FROM `agricultural_land` 
    WHERE `channel_id` IS NOT NULL 
    AND `read_key` IS NOT NULL""")

    lands = cursor.fetchall()

    now = datetime.now()
    last_hour = now - timedelta(hours=1)
    now = now.strftime("%Y-%m-%d%%20%H:%M:%S")
    last_hour = last_hour.strftime("%Y-%m-%d%%20%H:%M:%S")

    for land in lands:
        channel_id = land.get('channel_id')
        read_key = land.get('read_key')
        url = """https://api.thingspeak.com/channels/{channel_id}/feeds.json?api_key={read_key}&start={last_hour}&end={now}""".format(
            channel_id=channel_id, read_key=read_key, last_hour=last_hour, now=now)
        try:
            response = urllib.request.urlopen(url)
            the_page = json.loads(response.read())
            land_feeds = the_page['feeds']
            for row in land_feeds:
                datetime_store = str_date_time(row.get('created_at'))
                id = row.get("entry_id")
                field1 = row.get("field1")
                field2 = row.get("field2")
                field3 = row.get("field3")
                field4 = row.get("field4")
                field5 = row.get("field5")
                field6 = row.get("field6")
                field7 = row.get("field7")
                field8 = row.get("field8")
                land_id = land.get('id')

                cursor.execute("""INSERT INTO `measurements` (`id`, `land_id`, `field1`, `field2`, `field3`, `field4`, `field5`, `field6`, `field7`, `field8`, `date_time`) 
                VALUES ('{id}', '{land_id}', '{field1}', '{field2}', '{field3}', '{field4}',
                '{field5}', '{field6}', '{field7}', '{field8}', '{datetime}');""".format(
                    id=id, land_id=land_id, field1=field1,
                    field2=field2, field3=field3, field4=field4,
                    field5=field5, field6=field6, field7=field7,
                    field8=field8, datetime=datetime_store
                ))
                mysql.connection.commit()
        except urllib.error.HTTPError as http_error:
            if http_error.code == 404:
                print(
                    'Greška kod 404. Stranica nije pronađena, jer ID kanala ili API kod je neispravan.')
            else:
                print('HTTP greška')
                print('HTTP code: ' + str(http_error.code))
                print('Razlog: ' + str(http_error.reason))
    cursor.close()


def str_date_time(datetime):
    slice_obj = slice(-1)
    datetime = datetime[slice_obj]
    date_time_list = datetime.split('T')
    datetime = date_time_list[0] + ' ' + date_time_list[1]
    return datetime
