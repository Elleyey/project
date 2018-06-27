import csv
import json
import sys



def giveMapColor (n):
    try:
        if float(n) < 2:
            return "<2"
        if float(n) < 4:
            return "2-4"
        if float(n) < 6:
            return "4-6"
        if float(n) < 8:
            return "6-8"
        if float(n) < 10:
            return "8-10"
        return "none"
    except Exception as e:
        return "none"


array = {}
counter = 0
ISOcodes = {"Belgie" : "BEL",
"Bulgarije" : "BGR",
"Cyprus" : "CYP",
"Denemarken" : "DNK",
"Duitsland" : "DEU",
"Estland" : "EST",
"Finland" : "FIN",
"Frankrijk" : "FRA",
"Griekenland" : "GRC",
"Hongarije" : "HUN",
"Ierland" : "IRL",
"IJsland" : "ISL",
"Italie" : "ITA",
"Kosovo" : "XKX",
"Kroatie" : "HRV",
"Litouwen" : "LTU",
"Nederland" : "NLD",
"Noorwegen" : "NOR",
"Oekraine" : "UKR",
"Oostenrijk" : "AUT",
"Polen" : "POL",
"Portugal" : "PRT",
"Slovenie" : "SVN",
"Slowakije" : "SVK",
"Spanje" : "ESP",
"Tsjechie" : "CZE",
"Verenigd Koninkrijk" : "GBR",
"Zweden" : "SWE",
"Zwitserland" : "CHE" }


with open('/data/EU2002-2012.csv', 'r') as csvEurope:
    csvReader = csv.reader(csvEurope, delimiter=';')
    for row in csvReader:
        counter = counter + 1
        if counter > 4:
            data = dict()
            data["country"] = row[1]
            data["year"] = row[2]
            data["humanity"] = row[3]
            data["justiceSystem"] = row[4]
            data["police"] = row[5]
            data["politicians"] = row[6]
            data["parliament"] = row[7]
            data["politicalParties"] = row[8]
            data["europeanParliament"] = row[9]
            data["un"] = row[10]
            data["ISO"] = ISOcodes[data["country"]]
            data["fillKey"] = giveMapColor(data["humanity"])

            if data["year"] not in array:
                array[data["year"]] = {}
            array[data["year"]][data["ISO"]] = data


datagroot = {"All_data": array}

with open('Europe.json', 'w') as jsonEurope:
    json.dump(datagroot, jsonEurope)
