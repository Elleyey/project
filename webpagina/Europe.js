window.onload = function() {

  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    function getData(error, response) {

       var dataEurope = response[0]["All_data"];
       if (error) throw error;
       var countriesLength = 29;
       var dataArray = [];
       var obj = {};
       console.log(dataEurope);

       // iterate over data, add the right data to a certain country
       for (var i = 0; i < countriesLength; i++)
       {

         var countryName = dataEurope[i].Country;
         var year = dataEurope[i].Year;
         var trustHumanity = dataEurope[i].Humanity;
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
              country: countryName,
              countryISO: countryISOlist[countryName],
              trustHumanity: trustHumanity,
              trustParliament: trustParliament,
              trustJustice: trustJustice,
              trustEuropeanParliament: trustEuropeanParliament,
              trustPolice: trustPolice,
              trustParties: trustParties,
              trustPoliticians: trustPoliticians,
              trustUN: trustUN
            });

          obj[countryISOlist[countryName]] =
          {
            trust: trustHumanity
          };
        // closes for loop
      }
        // closes getData
        makeMap();
      }

    function makeMap() {
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
          }
       });
    }

// close window onload
}
