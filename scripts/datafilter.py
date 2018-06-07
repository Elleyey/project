import csv
import json
import sys

array = []
counter = 0

with open('EU2002-2012.csv', 'r') as csvEurope:
    csvReader = csv.reader(csvEurope, delimiter=';')
    for row in csvReader:
        counter = counter + 1
        if counter > 4:
            data = dict()
            data["Country"] = row[1]
            data["Year"] = row[2]
            data["Humanity"] = row[3]
            data["Justice system"] = row[4]
            data["Police"] = row[5]
            data["Politicians"] = row[6]
            data["Parliament"] = row[7]
            data["Political Parties"] = row[8]
            data["European Parliament"] = row[9]
            data["UN"] = row[10]

            array.append(data)

datagroot = {"All_data": array}

with open('Europe.json', 'w') as jsonEurope:
    json.dump(datagroot, jsonEurope)
