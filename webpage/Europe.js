
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

      var select = d3.select("#years-button").append('select')
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
      console.log(data);
      d3.select("#container-bar").selectAll("svg")
        .remove();

        var countryData = data.data;

        margin = { top: 15, right: 25, bottom: 20, left: 100 },
        width = 350 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

        var svg = d3.select("#container-bar")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // make y scale
      var x = d3.scale.linear()
                .range([0, width])
                .domain([0, 10]);

      // make x scale
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

      // create SVG Barchart
      var bars = svg.selectAll(".bar")
                     .data(countryData)
                     .enter()
                     .append("g");

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

        // create X axis
        svg.append("g")
            .attr("class","axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

      };

// close window onload
}
