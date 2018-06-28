/*JavaScript for page about Europe
By Ellemijke Donner
10734198,
for final project programmeren.*/

// define global values to use later
selectedCountry = "Netherlands";
selectedISO = "NLD";

/*window onload to make sure there are no errors. Calls filterMap, makeMap and makeBars*/
window.onload = function() {

  // queue before showing page
  queue()
    .defer(d3.json, 'data/Europe.json')
    .awaitAll(getData);

    /* GetData to work with later, call filterMap and makeMap
    */
    function getData(error, response) {

      var dataEurope = response[0]["All_data"];
      var dataDefaultMap = dataEurope["2002"];
      var dataDefaultBar = filterData(selectedISO, selectedCountry, dataDefaultMap);

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

      /* OnChange pass right dataset on, call updateMap (new year)
      and updateBar (country and year)*/
      function onChange() {

        // get selected year
        var selectedYear = d3.select('select').property('value');
        var dataYear;

        // dataset change to 2014*
        if ('2014' == selectedYear)
        {
         dataYear = data["2014*"];
        }
        else
        {
          dataYear = data[selectedYear];
        }

        var dataFiltered = filterData(selectedISO, selectedCountry, dataYear);

        updateMap(dataYear);
        updateBars(dataFiltered);
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
          // set colors of map
          defaultFill: 'rgb(247, 247, 247)',
          '<2':'rgb(178, 24, 43)',
          '2-4':'rgb(239, 138, 98)',
          '4-6':'rgb(209, 229, 240)',
          '6-8':'rgb(103, 169, 207)',
          '8-10':'rgb(33, 102, 172)'
        },
        data: dataMap,
        // set tooltip
        geographyConfig: {
               highlightOnHover: false,
               popupTemplate: function(geo, data) {
                 countryEnglish = geo.properties.name;
                 return ['<div class="tooltipMapEU"> Trust in humanity in ' + geo.properties.name,
                           ': ' + data.humanity, '</div>'].join('');
               }
             },
        // when clicked, update global variables and call filterData and updateBars.
        done: function(datamap) {
          datamap.svg
          .selectAll('.datamaps-subunit')
          .on('click', function(geography) {
              var myObj = JSON.parse(this.dataset.info);
              var countryCode = myObj.country;
              var ISOCode = myObj.ISO;

              // change global variables
              selectedCountry = countryEnglish;
              selectedISO = ISOCode;

              var data = filterData(selectedISO, selectedCountry, dataMap);
              updateBars(data);

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

    /* makeBars - make bars according to defaultData*/
    function makeBars(data) {

      var countryData = data.data;

      //  tooltip for barchart
      var tip = d3.tip()
                  .attr("class", "tooltipBarEU")
                  .offset([25, 0])
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
            .text("Trust in " + selectedCountry);

      // append xAxis title
      svg.append("text")
            .attr("y", 245)
            .attr("x", 168)
            .style("font-size", "10px")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("grades given on scale 1 - 10");

     // close makeBars
     };

// close window onload
}

/*checkBucket function to give color to barchart*/
function checkBucket(n){

  // give specific color accordingly to grades
  if (n < 2) {
    return 'rgb(178,24,43)'
  }
  if (n < 3) {
    return 'rgb(214,96,77)'
  }
  if (n < 4) {
    return 'rgb(244,165,130)'
  }
  if (n < 5) {
    return 'rgb(253,219,199)'
  }
  if (n < 6) {
    return 'rgb(209,229,240)'
  }
  if (n < 7){
    return 'rgb(146,197,222)'
  }
  if (n < 8){
    return 'rgb(67,147,195)'
  }
  if (n < 9){
    return 'rgb(33,102,172)'
  }
  if (n < 10){
    return 'rgb(5,48,97)'
  }
}

/*updateMap colors*/
function updateMap(dataMap) {
  map.updateChoropleth(dataMap)
}

/*updateBar functions*/
function updateBars(data){

  var dataData = data.data;

  // select right barchart
  svg = d3.select(".barchart-EU")

  // adjust data used
  var bars = d3.selectAll(".bar")
                 .data(dataData);
  // change bars
  d3.selectAll(".bar")
        .transition()
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

  // re-write title
  d3.select(".title-bar-EU")
          .attr("y", - 18)
          .attr("x", 100)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .text("Trust in " + data.country);

 // close updateBars
 }

/*filterData to filter certain things out of given data*/
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
