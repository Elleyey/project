
window.onload = function() {

  // queue before showing page
  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    /* GetData to work with later, call filterMap and makeMap
    */
    function getData(error, response) {
      var dataEurope = response[0]["All_data"];
      var dataDefault = dataEurope["2002"];

      if (error) throw error;
      filterMap(dataEurope);
      makeMap(dataDefault);
      // closes getData
      }

    /* filterMap - year of map is deafault on 2002, change is done by user.
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
          var selectedYear = d3.select('select').property('value')
          d3.select('body').selectAll('svg').remove()

          // check which year, pass on right dataset.
          if ('2002' == selectedYear)
          {
            dataYear = data["2002"];
          }
          if ('2004' == selectedYear)
          {
           dataYear = data["2004"];
          }
          if ('2006' == selectedYear)
          {
           dataYear = data["2006"];
          }
          if ('2008' == selectedYear)
          {
           dataYear = data["2008"];
          }
          if ('2010' == selectedYear)
          {
           dataYear = data["2010"];
          }
          if ('2012' == selectedYear)
          {
           dataYear = data["2012"];
          }
          if ('2014' == selectedYear)
          {
           dataYear = data["2014*"];
          }

          makeMap(dataYear);
          makeBars(dataYear);
          }
     // close filterMap
     };

     /* makeMap - make data map, fill colors according to values, call makeBars*/
    function makeMap(dataMap) {

        // use datamaps, zoom in on Europe
        var map = new Datamap({
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
            defaultFill: 'rgb(255, 255, 255)',
            '<2':'rgb(255, 153, 255)',
            '2-4':'rgb(255, 102, 255)',
            '4-6':'rgb(204, 0, 204)',
            '6-8':'rgb(153, 0, 153)',
            '8-10':'rgb(102, 0, 102)'
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

                // filter fillKey, Year and ISO out of used data for the barchart.
                data = {"country": countryEnglish, "data":
                        [{"topic": "European Parliament", "percentage": myObj.europeanParliament},
                        {"topic": "​Humanity", "percentage": myObj.humanity},
                        {"topic": "Justice System", "percentage": myObj.justiceSystem},
                        {"topic": "Paliament", "percentage": myObj.parliament},
                        {"topic": "Police", "percentage": myObj.police},
                        {"topic": "Politicians", "percentage": myObj.politicians},
                        {"topic": "United Nations", "percentage": myObj.un}]};

                makeBars(data);

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
      d3.select("#container-bar").selectAll("svg")
        .remove();

        var countryData = data.data;

        // set margins
        margin = { top: 15, right: 25, bottom: 35, left: 150 },
        width = 400 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        // set svg margins
        var svg = d3.select("#container-bar")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // make x scale
        var x = d3.scale.linear()
                  .range([0, width])
                  .domain([0, 10]);

        // make y scale
        var y = d3.scale.ordinal()
                  .rangeRoundBands([height, 0], .1)
                  .domain(countryData.map(function (d) {
                    return d.topic;
                  }));

        // set y axis according to axisScale
        var yAxis = d3.svg.axis()
                      .scale(y)
                      .orient("left");

        // set x axis according to xScale
        var xAxis = d3.svg.axis()
                      .scale(x)
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
                return y(d.topic);
             })
             .attr("height", y.rangeBand())
             .attr("x", 0)
             .attr("width", function(d) {
               return x(d.percentage);
             })
             .attr("fill", "pink");

          // draw X axis
          svg.append("g")
              .attr("class","axis")
              .attr("transform", "translate(0," + height + ")")
              .call(xAxis);

          // write title
          svg.append("text")
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
