
window.onload = function() {

  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    function getData(error, response) {
      console.log(response);
      var dataEurope = response[0]["All_data"];
      var dataDefault = dataEurope["2002"];
      if (error) throw error;
      filterMap(dataEurope);
      makeMap(dataDefault);
      // closes getData
      }

    function filterMap(data) {
      var variables = ['2002', '2004', '2006', '2008', '2010', '2012', '2014'];

      var select = d3.select("body").append('select')
                      .attr('class', 'select')
                      .on('change', onChange);

      var options = select
                    .selectAll('option')
                    .data(variables)
                    .enter()
                    .append('option')
                    .text(function (d) {
                      return d;
                    });

        function onChange() {
          var selectedYear = d3.select('select').property('value')
          d3.select('body').selectAll('svg').remove()

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
      };

    function makeMap(dataMap) {
      console.log(dataMap);
        var map = new Datamap({
          element: document.getElementById("container-map"),
          scope:'world',
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
            defaultFill: 'rgb(238, 233, 233)',
            'none':'rgb(238, 233, 233)',
            '<2':'rgb(250, 128, 114)',
            '2-4':'rgb(255, 165, 0)',
            '4-6':'rgb(255, 255, 102)',
            '6-8':'rgb(173, 255, 47)',
            '8-10':'rgb(50, 205, 50)'
          },
          data: dataMap,
          // set tooltip
          geographyConfig: {
                 highlightOnHover: false,
                 popupTemplate: function(geo, data) {
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

            data = {"country": myObj.country, "data":
                    [{"topic": "European Parliament", "percentage": myObj.europeanParliament},
                    {"topic": "​Humanity", "percentage": myObj.humanity},
                    {"topic": "Justice System", "percentage": myObj.justiceSystem},
                    {"topic": "Paliament", "percentage": myObj.parliament},
                    {"topic": "Police", "percentage": myObj.police},
                    {"topic": "Politicians", "percentage": myObj.politicians},
                    {"topic": "United Nations", "percentage": myObj.un}]};

            makeBars(data);
       });
      }
        });


        // set legend -DOES IT TWICE?
        map.legend();

      // close make map
      };

    function makeBars(data) {

      d3.select("#container-bar").selectAll("svg")
        .remove();

      var width = 300;
      var height = 200;
      var barPadding = 4;
      var heightMargin = 75;
      var widthMargin = 50;
      var maxValue = 10;
      var variables = 6;

      var countryData = data.data;

      var svg = d3.select("#container-bar")
                  .append("svg")
                  .attr("width", width + widthMargin)
                  .attr("height", height + (2 * heightMargin))
                  .append("g");

      // make x scale
      var x = d3.scale.linear()
                    .domain([0, variables])
                    .range([widthMargin, width + widthMargin]);

      // make y scale
      var y = d3.scale.linear()
                .domain([0, maxValue])
                .range([0, height]);

      console.log(countryData)

      // scale axis to make sure bars start at the bottom
      var axisScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([height, 0]);

      // set x axis according to xScale
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(7)
                    .tickFormat(function(d) {
                      console.log(d);
                       return countryData[d].topic;
                     });

      // set y axis according to axisScale
      var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left")
                    .ticks(10);

      // create SVG Barchart
      svg.selectAll(".bar")
           .data(countryData)
           .enter()
           .append("rect")
           .attr("class", "bar")
           .attr("x", function(d, i) {
             return i * (width / variables) + widthMargin;
           })
           .attr("y", function (d, i){
             return height + heightMargin - y(d.percentage);
           })
           .attr("width", width / variables - barPadding)
           .attr("height", function(d) {
             return y(d.percentage);
           })
           .attr("fill", "blue")
           .transition();

        // create X axis
        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0," + (height + heightMargin) + ")")
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("transform", "rotate(-50)");

        // create Y axis
        svg.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(" + widthMargin + "," +
                   heightMargin + ")")
            .call(yAxis);


        // append yAxis title
        svg.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 7)
              .attr("x", - 170)
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .style("font-size", "12px")
              .style("font-family", "calibri")
              .style("font-weight", "bold")
              .text("text");

          // append xAxis title
          svg.append("text")
                .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("font-family", "calibri")
                .style("text-anchor", "middle")
                .text("this works");

      };

// close window onload
}
