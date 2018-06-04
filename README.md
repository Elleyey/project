# Project Data Visualisatie - Ellemijke Donner 10734198

## Probleemstelling

 ### Inleiding:

>*'We vertrouwen erlkaar niet meer', zo zei [Jan Terlouw](https://nos.nl/video/2146366-de-toespraak-van-jan-terlouw-bij-dwdd.html) in zijn veelbesproken bericht aan het volk in december 2016. Volgens Terlouw zou het lak aan vertouwen de oorzaak zijn van veel kwaad: Trump, het niet aanpakken van klimaat vervuiling en de Brexit. Het lijkt alsof er steeds meer tegenstellingen ontstaan onder de bevolking, en de enige uitweg geboden wordt door populistische politici. Ook buiten Nederland staan veel landen op een keerpunt, zie Spanje, Italië en Engeland. De wereld staat in brand en er is niets wat we kunnen doen, zo lijkt het.*

### Gebrek aan informatie:

Is het een terrecht gevoel, wat Terlouw en met hem velen anderen hebben: is er weinig vertouwen in de Nederlandse samenleving? Deze data visualisatie schept duidelijkheid over het vertrouwen in de (Nederlandse) politiek, voor iedereen die daarin geïnteresseerd is. De data komt van het Centraal Bureau van Statistiek.

## Oplossing:

*In één zin:*

De visualisatie zal laten zien hoe het met het vertrouwen in Nederland gesteld is en hoe dit zich verhoudt tot de rest van Europa. 

*Schets van de visualisatie:*

- een referentie naar het bekende 'touwtje in de deur' om op de website te komen. Misschien zet ik hiet nog wat achtergrond informatie neer. 

![Startpagina](docs/pagina1.jpg)

- De eerste pagina laat de landkaart van Europa zien, de kleuren van de landen verwijzen naar het vertrouwen in de medemens van dat land. Wanneer iemand op een land klikt, komt er een barchart OF **scatterplot** tevoorschijn. Er is mogelijkheid te kiezen uit verschillende jaren. 
 - Nog een grafiek toevoegen voor het geklikte land om te zien hoe het vertrouwen is toe/afgenomen in de jaren (wanneer op een bepaalde variabele in de barchart/scatterplot geklikt wordt). 

![Pagina 1](docs/pagina2.jpg)

- De tweede pagina, waar men kan komen via een menu boven aan de site, laat de data van Nederland zien. De precieze data kan gekozen worden via een dropdown button, naar gender, leeftijd, migratie achtergrond, onderwijs niveau, stedelijkheid en partij keuze. Wellicht maak ik daar nog wat minder keuzes van. 

![Pagina 2](docs/pagina3.png)

*Belangrijkste kenmerken:*
 - on click (op landen Europa, verschijnt correcte barchart/scatterplot)
 - on hoover, tooltip (barchart/scatterplot geeft exacte percentages of variabele)

*Optioneel:*

- Pagina met make your own chart, waarin je de data zelf kan filteren (bijvoorbeeld Engeland en Nederland vergelijken op gebied van vertrouwen in Europa, politici en politie). 

## Benodigdheden:

**Data:** 
[CBS, Nederland](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/71719NED/table?dl=8CA2), [CBS, Europa](https://opendata.cbs.nl/statline/#/CBS/nl/dataset/80518NED/table?ts=1528103408258). Beschikbaar in JSON, CSV en API. 

**External Components:**
   - d3
   - d3-tip
   - datamaps
   - topojson
   - dropdown

**Revieuw(s):** 
www.thehappyforecast.com/, houdt het erg simpel en meer informatie te krijgen door door te klikken. Is goede manier om niet te veel informatie in één keer te presenteren. 
 
**Moeilijkste onderdelen:**
 - Ik verwacht dat het lastigste onderdeel het linken van alle verschillende pagina's wordt. 
 - Ook moet ik een goede datascructuur opbouwen waarbij de gekozen data doorgegeven wordt en niet steeds werken met if statements. 
 

