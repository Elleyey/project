import csv
import json
import sys

array = []
counter = 0

with open('Nederland2012-2017CSV.csv', 'r') as csvNL:
    csvReader = csv.reader(csvNL, delimiter=';')
    for row in csvReader:
        counter = counter + 1
        if counter > 4:
            data = dict()
            data["Year"] = row[2]
            data["Humanity"] = row[3]
            data["Churches"] = row[4]
            data["Justice"] = row[5]
            data["Press"] = row[6]
            data["Police"] = row[7]
            data["Parliament"] = row[8]
            data["Civil servant"] = row[9]
            data["Bank"] = row[10]
            data["Companies"] = row[11]
            data["Europe"] = row[12]

            array.append(data)

datagroot = {"All_data": array}

with open('Netherlands.json', 'w') as jsonNetherlands:
    json.dump(datagroot, jsonNetherlands)
