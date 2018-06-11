function giveMapColor(n) {

  if (n < 3) {
    return "red"
  }
  if (n > 3 && n < 6) {
    return "orange"
  }
  if (n > 6 && n < 9) {
    return "green"
  }
  if (n > 9) {
    return "blue"
  }
}

window.onload = function() {

  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    function getData(error, response) {

       var dataEurope = response[0]["All_data"];
       if (error) throw error;
       var countriesLength = 203;
       var dataArray = [];
       var obj = {};
       console.log(dataEurope);

       // iterate over data, add the right data to a certain country
       for (var i = 0; i < countriesLength; i++)
       {
         var countryName = dataEurope[i].Country;
         var year = dataEurope[i].Year;
         var trustHumanity = dataEurope[i].Humanity;
         var fillKey = giveMapColor(trustHumanity);
         var trustEuropeanParliament = dataEurope[i]["European Parliament"];
         var trustJustice = dataEurope[i]["Justice system"];
         var trustParliament = dataEurope[i].Parliament;
         var trustPolice = dataEurope[i].Police;
         var trustParties = dataEurope[i]["Political Parties"];
         var trustPoliticians = dataEurope[i].Politicians;
         var trustUN = dataEurope[i].UN;
         var countryISOlist = { "Belgie" : "BEL",
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
                                "Ijsland" : "ISL",
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
                                "Zwitserland" : "CHE"
                              };
          // put the data in dataArray
          dataArray.push(
            { 
              countryISO: countryISOlist[countryName],
              year: year,
              trustHumanity: trustHumanity,
              trustParliament: trustParliament,
              trustJustice: trustJustice,
              trustEuropeanParliament: trustEuropeanParliament,
              trustPolice: trustPolice,
              trustParties: trustParties,
              trustPoliticians: trustPoliticians,
              trustUN: trustUN,
              fillKey: fillKey
            });
          //
          // obj[countryISOlist[countryName]] =
          // {"2002" : {}, "2014*" : {}};
          // obj[countryISOlist[countryName]][year] = {
          //   trust: trustHumanity,
          //   fillKey: giveMapColor(trustHumanity)
          // }
        // closes for loop
      }
      console.log(dataArray);
      console.log(obj);
        // closes getData
        makeMap();
      }

    function makeMap(dataArray) {

        var map = new Datamap({
          element: document.getElementById("container"),
          scope:'world',
          setProjection: function(element){
            var projection = d3.geo.equirectangular()
                                .center([10, 50])
                                .rotate([4.4, 0])
                                .scale(350)
                                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                          .projection(projection);
            return {path: path, projection: projection};
          },
          fills: {
            defaultFill: 'rgb(255, 192, 203)',
            'red':'rgb(255, 0, 0)',
            'orange': 'rgb(255, 127, 80)',
            'green': 'rgb(152, 251, 152)',
            'blue': '	rgb(171, 167, 254)',
          },
          data: dataArray,
          // set tooltip
          geographyConfig: {
                 // highlightOnHover: false,
                 popupTemplate: function(geo, data) {
                   highlightBar(geo.id, data);
                   return ['<div class="tooltip"><strong>',
                             'Trust in humanity in ' + geo.properties.name,
                             ': ' + data.trust,
                             '</strong></div>'].join('');
                 }
               }
              });
    }

// close window onload
}
