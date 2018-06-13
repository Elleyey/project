
window.onload = function() {

  queue()
    .defer(d3.json, 'Europe.json')
    .awaitAll(getData);

    function getData(error, response) {
      console.log(response);
      var dataEurope = response[0]["All_data"];
      if (error) throw error;
      filterMap(dataEurope);
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
        //makeBars(dataYear);
        }
      };

    function makeMap(dataMap) {
      console.log(dataMap);
        var map = new Datamap({
          element: document.getElementById("container"),
          scope:'world',
          setProjection: function(element){
            var projection = d3.geo.equirectangular()
                                .center([5, 50])
                                .rotate([4.4, 0])
                                .scale(350)
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
                .selectAll('datamaps-subunit')
                .on('click', function(d){
                  makeBars(dataMap);
                });
          }
        });
        // set legend -DOES IT TWICE?
        map.legend();

      // close make map
      };

    function makeBars(dataMap) {

      console.log(dataMap);

      var width = 300;
      var height = 200;
      var barPadding = 4;
      var heightMargin = 75;
      var widthMargin = 50;
      var maxValue = 10;
      var variables = 8;

      var svg = d3.select("container")
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

      // scale axis to make sure bars start at the bottom
      var axisScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([height, 0]);

      // set x axis according to xScale
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(variables)
                    .tickFormat(function(d, i) {
                       return d;
                     });

      // set y axis according to axisScale
      var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left")
                    .ticks(10);

      // create SVG Barchart
      svg.selectAll(".bar")
           .data(dataMap)
           .enter()
           .append("rect")
           .attr("class", "bar")
           // .attr("id", function(d){
           //   return d;
           // })
           .attr("x", function(d, i) {
             return i * (width / variables) + widthMargin;
           })
           .attr("y", function (d){
             return height + heightMargin - y(5);
           })
           .attr("width", width / countriesLength - barPadding)
           .attr("height", function(d) {
             return y(4);
           });

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
              .text( function (d) {
                "yolo"
              });

          // append xAxis title
          svg.append("text")
                .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
                .style("font-size", "12px")
                .style("font-weight", "bold")
                .style("font-family", "calibri")
                .style("text-anchor", "middle")
                .text("Countries in South America");

      };

// close window onload
}
