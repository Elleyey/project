selectedCountry = "Netherlands";
selectedISO = "NLD";

window.onload = function() {

  // queue before showing page
  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    /* GetData to work with later, call filterMap and makeMap
    */
    function getData(error, response) {
      var dataEurope = response[0]["All_data"];
      var dataDefaultMap = dataEurope["2002"];
      var dataDefaultBar = filterData(selectedISO, selectedCountry, dataDefaultMap);
      // var dataDefaultBar = {"country": "Netherlands", "data":
      //         [{"topic": "European Parliament", "percentage": "4.7"},
      //         {"topic": "​Humanity", "percentage": "5.7"},
      //         {"topic": "Justice System", "percentage": "5.4"},
      //         {"topic": "Paliament", "percentage": "5.2"},
      //         {"topic": "Police", "percentage": "5.8"},
      //         {"topic": "Politicians", "percentage": "4.9"},
      //         {"topic": "United Nations", "percentage": "5.4"}]};


      if (error) throw error;
      filterMap(dataEurope);
      makeMap(dataDefaultMap);
      makeBars(dataDefaultBar);
      // closes getData
      }

    /* filterMap - year of map is default on 2002, change is done by user.
    This map gives year on to makeMap.
    */
    function filterMap(data) {

      // options to be chosen from by user
      var variables = ['2002', '2004', '2006', '2008', '2010', '2012', '2014'];

      // call onChange function when year is chosen
      var select = d3.select("#years-button").append('select')
                      .attr('class', 'select')
                      .on('change', onChange);

     // possible options in button
      var options = select.selectAll('option')
                    .data(variables)
                    .enter()
                    .append('option')
                    .text(function (d) {
                      return d;
                    });

        /* OnChange pass right dataset on, call MakeMap (new year)
        and makeBar (country and year)*/
        function onChange() {

          // get selected year
          var selectedYear = d3.select('select').property('value');
          var dataYear;

          // dataset change to delete 2014*
          if ('2014' == selectedYear)
          {
           dataYear = data["2014*"];
          }
          else
          {
            dataYear = data[selectedYear];
          }

          var dataFiltered = filterData(selectedISO, selectedCountry, dataYear);

          // globale variabele die geselecteeerde land bijhoud
          // filterfunctie
          UpdateMap(dataYear);
          console.log(dataYear);
          UpdateBars(dataFiltered);
          }
     // close filterMap
     };

    /* makeMap - make data map, fill colors according to values, call makeBars*/
    function makeMap(dataMap) {

        // use datamaps, zoom in on Europe
        map = new Datamap({
          element: document.getElementById("container-map"),
          scope:'world',
          height: 350,
          width: 450,
          setProjection: function(element){
            var projection = d3.geo.equirectangular()
                                .center([10, 50])
                                .rotate([4.4, 0])
                                .scale(450)
                                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                          .projection(projection);
            return {path: path, projection: projection};
          },
          fills: {
            defaultFill: 'rgb(247,252,253)',
            '<2':'rgb(191,211,230)',
            '2-4':'rgb(140,150,198)',
            '4-6':'rgb(140,107,177)',
            '6-8':'rgb(136,65,157)',
            '8-10':'rgb(77,0,75)'
          },
          data: dataMap,
          // set tooltip
          geographyConfig: {
                 highlightOnHover: false,
                 popupTemplate: function(geo, data) {
                   countryEnglish = geo.properties.name;
                   return ['Trust in humanity in ' + geo.properties.name,
                             ': ' + data.humanity].join('');
                 }
               },
          done: function(datamap) {
            datamap.svg
            .selectAll('.datamaps-subunit')
            .on('click', function(geography) {
                var myObj = JSON.parse(this.dataset.info);
                var countryCode = myObj.country;
                var ISOCode = myObj.ISO;
                selectedCountry = countryEnglish;
                selectedISO = ISOCode;

                // filter fillKey, Year and ISO out of used data for the barchart.
                // data = {"country": countryEnglish, "data":
                //         [{"topic": "European Parliament", "percentage": myObj.europeanParliament},
                //         {"topic": "​Humanity", "percentage": myObj.humanity},
                //         {"topic": "Justice System", "percentage": myObj.justiceSystem},
                //         {"topic": "Paliament", "percentage": myObj.parliament},
                //         {"topic": "Police", "percentage": myObj.police},
                //         {"topic": "Politicians", "percentage": myObj.politicians},
                //         {"topic": "United Nations", "percentage": myObj.un}]};

                var data = filterData(selectedISO, selectedCountry, dataMap);
                UpdateBars(data);

          // close onclick function
          });

        // close function dataMap
        }

        // close var Map
        });

        // set title for legend
        var legendMap = {
          legendTitle: "Trust in humanity on scale 1 to 10"
        }

        // draw lagend
        map.legend(legendMap);

      // close make map
      };

    /* makeBars - make bars according to chosen year and country*/
    function makeBars(data) {

      // remove previously drawn bars
      // d3.select("#container-bar").selectAll("svg")
      //   .remove();

        var countryData = data.data;

        //  tooltip for barchart
        var tip = d3.tip()
                    .attr("class", "d3-tip-bars-EU")
                    .offset([35, 0])
                    .html(function (d, i) {
                      return d.percentage
                    });


        // set margins
        margin = { top: 15, right: 25, bottom: 35, left: 150 },
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        // set svg margins
         svg = d3.select("#container-bar")
                  .append("class", "barchart-EU")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // show tooltip
        svg.call(tip);

        // make x scale
       xBar = d3.scale.linear()
                  .range([0, width])
                  .domain([0, 10]);

        // make y scale
       yBar = d3.scale.ordinal()
                  .rangeRoundBands([height, 0], .1)
                  .domain(countryData.map(function (d) {
                    return d.topic;
                  }));

        // set y axis according to axisScale
        var yAxis = d3.svg.axis()
                      .scale(yBar)
                      .orient("left");

        // set x axis according to xScale
        var xAxis = d3.svg.axis()
                      .scale(xBar)
                      .orient("bottom")
                      .ticks(10);

        // create Y axis
        svg.append("g")
            .attr("class", "axis")
            .call(yAxis);

        // create bars
        var bars = svg.selectAll(".bar")
                       .data(countryData)
                       .enter()
                       .append("g");

        // draw bars
        bars.append("rect")
             .attr("class", "bar")
             .attr("y", function (d){
                return yBar(d.topic);
             })
             .attr("height", yBar.rangeBand())
             .attr("x", 0)
             .attr("width", function(d) {
               return xBar(d.percentage);
             })
             .attr("fill", function(d){
               var n = +d.percentage;
               return checkBucket(n);
             })
             .on("mouseover", tip.show)
             .on("mouseout", tip.hide);

          // draw X axis
          svg.append("g")
              .attr("class","axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          // write title
          svg.append("text")
                .attr("class", "title-bar-EU")
                .attr("y", - 18)
                .attr("x", 100)
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .style("font-size", "14px")
                .style("font-family", "calibri")
                .text("Trust in " + data.country);

            // append xAxis title
            svg.append("text")
                  .attr("y", 245)
                  .attr("x", 168)
                  .style("font-size", "10px")
                  .style("font-family", "calibri")
                  .style("text-anchor", "middle")
                  .text("grades given on scale 1 - 10");

          };

// close window onload
}

function checkBucket(n){
  // give specific color accordingly to percentages
  if (n < 2) {
    return 'rgb(247,252,253)'
  }
  if (n < 3) {
    return 'rgb(224,236,244)'
  }
  if (n < 4) {
    return 'rgb(191,211,230)'
  }
  if (n < 5) {
    return 'rgb(158,188,218)'
  }
  if (n < 6) {
    return 'rgb(140,150,198)'
  }
  if (n < 7){
    return 'rgb(140,107,177)'
  }
  if (n < 8){
    return 'rgb(136,65,157)'
  }
  if (n < 9){
    return 'rgb(129,15,124)'
  }
  if (n < 10){
    return 'rgb(77,0,75)'
  }
}

function UpdateMap(dataMap) {
  map.updateChoropleth(dataMap)
}

function UpdateBars(data){

  var dataData = data.data;

  console.log(data.country);

  svg = d3.select(".barchart-EU")

  var bars = d3.selectAll(".bar")
                 .data(dataData);

   d3.selectAll(".bar")
        .transition()
        .attr("y", function (d){
          console.log(d)
           return yBar(d.topic);
        })
        .attr("height", yBar.rangeBand())
        .attr("x", 0)
        .attr("width", function(d) {
          return xBar(d.percentage);
        })
        .attr("fill", function(d){
          var n = +d.percentage;
          return checkBucket(n);
        })

    // re-write title
    svg.selectAll("title-bar-EU")
          .attr("y", - 18)
          .attr("x", 100)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .text("Trust in " + data.country);
}

function filterData(ISOCode, countryEnglish, dataMap){

  var thisData = dataMap[ISOCode];

  var data = {"country": countryEnglish, "data":
          [{"topic": "European Parliament", "percentage": thisData.europeanParliament},
          {"topic": "​Humanity", "percentage": thisData.humanity},
          {"topic": "Justice System", "percentage": thisData.justiceSystem},
          {"topic": "Paliament", "percentage": thisData.parliament},
          {"topic": "Police", "percentage": thisData.police},
          {"topic": "Politicians", "percentage": thisData.politicians},
          {"topic": "United Nations", "percentage": thisData.un}]};

   return data;
};
