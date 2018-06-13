
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

    function makeMap(dataMap) {
      console.log(dataMap);
        var map = new Datamap({
          element: document.getElementById("container"),
          scope:'world',
          setProjection: function(element){
            var projection = d3.geo.equirectangular()
                                .center([10, 50])
                                .rotate([5, 0])
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
                   return ['<strong>',
                             'Trust in humanity in ' + geo.properties.name,
                             ': ' + data.humanity,
                             '</strong>'].join('');
                 }
               }
              });
              // set legend
              map.legend();
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
          }
    }

// close window onload
}
