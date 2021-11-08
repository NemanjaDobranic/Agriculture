def getNumOfDiagramsDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT DISTINCT `jedinica` AS unit 
    FROM `measured_units` 
    INNER JOIN `land_units` 
    ON `land_units`.`unit_id` = `measured_units`.`id` 
    WHERE `land_units`.`land_id` = {id} 
    AND `field` IS NOT NULL""".format(id=id))

    units = cursor.fetchall()
    cursor.close()
    return units


def getGraphsDataDB(mysql, id, unit, start, end):
    cursor = mysql.connection.cursor()
    cursor.execute(""" 
    SELECT `field` FROM `land_units` 
    INNER JOIN `measured_units` 
    ON `land_units`.`unit_id` = `measured_units`.`id` 
    WHERE `land_units`.`land_id` = {land_id} 
    AND `measured_units`.`jedinica` = '{unit}'
    AND `field` IS NOT NULL
    """.format(land_id=id, unit=unit))

    fields = cursor.fetchall()
    columns = ''
    for field in fields:
        columns += str(field.get('field')) + ', '

    columns = columns[0:-2]

    cursor.execute(""" 
    SELECT {columns},date_time AS x
    FROM `measurements` 
    WHERE `land_id` = {land_id}
    AND `date_time` > '{start}' 
    AND `date_time` < '{end}'
    """.format(land_id=id, start=start, end=end, columns=columns))

    dataGraph = cursor.fetchall()

    cursor.close()
    return dataGraph


def getPhysicalUnitsDB(mysql, id):
    cursor = mysql.connection.cursor()
    cursor.execute("""SELECT `unit`,`min`,`max`,`field` 
    FROM `measured_units` 
    INNER JOIN `land_units` 
    ON `land_units`.`land_id` = {id} 
    AND `land_units`.`unit_id` = `measured_units`.`id` 
    WHERE `field` IS NOT NULL""".format(id=id))
    data = cursor.fetchall()
    cursor.close()

    return data
