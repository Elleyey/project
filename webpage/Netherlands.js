var dataArrayCrimeTotal;
var xMulti;
var yMulti;

window.onload = function() {

  queue()
    .defer(d3.json, 'Inbraak.json')
    .defer(d3.json, 'Netherlands.json')
    .defer(d3.json, 'crimeRatesTotals.json')
    .awaitAll(getData);

    function getData(error, response) {
       var dataInbraak = response[0].All_data;
       var dataNetherlands = response[1].All_data;
       var dataCrimeTotal = response[2].value;

       if (error) throw error;
       var dataArrayInbraak = [];
       var dataArrayInbraakScatter =[];
       dataArrayNLLine =[];
       dataArrayCrimeTotal = [];
       dataArrayNLBar = [];

       // iterate over data, add the right data to a certain country
       for (var i = 0; i < 70; i++)
       {
         var year = dataCrimeTotal[i].Perioden;
         var violenceCrime = Number(dataCrimeTotal[i].Geweldsmisdrijven_8);
         var totalCrime = Number(dataCrimeTotal[i].MisdrijvenTotaal_7);
         var capitalCrime = Number(dataCrimeTotal[i].Vermogensmisdrijven_9);
         var vandalismCrime = Number(dataCrimeTotal[i].VernielingenMisdrOpenbOrdeGezag_10);

       dataArrayCrimeTotal.push(
         {
           year: Number(year.slice(0, 4)),
           violenceCrime: violenceCrime,
           totalCrime: totalCrime,
           capitalCrime: capitalCrime,
           vandalismCrime: vandalismCrime
         });
       // sluit for loop
       }

      // iterate over data, add the right data to a certain country
      for (var i = 2; i < 8; i++)
      {
        var year = Number(dataInbraak[i].Year);
        var burglaryRate = Number(dataInbraak[i].Burglary);

      dataArrayInbraakScatter.push(
        {
          year: year,
          burglaryRate: burglaryRate
        });
      // sluit for loop
      }
      console.log(dataArrayInbraakScatter);

      for (var i = 0; i < 8; i++)
      {
        var year = Number(dataInbraak[i].Year);
        var burglaryRate = Number(dataInbraak[i].Burglary);

      dataArrayInbraak.push(
        {
          year: year,
          burglaryRate: burglaryRate
        });
      // sluit for loop
      }

      for (var i = 0; i < 6; i++)
      {
        var year = dataNetherlands[i].Year;
        var bank = dataNetherlands[i].Bank;
        var church = dataNetherlands[i].Churches;
        var civilServant = dataNetherlands[i]["Civil servant"];
        var companies = dataNetherlands[i].Companies;
        var europe = dataNetherlands[i].Europe;
        var humanity = dataNetherlands[i].Humanity;
        var justice = dataNetherlands[i].Justice;
        var parliament = dataNetherlands[i].Parliament;
        var police = dataNetherlands[i].Police;
        var press = dataNetherlands[i].Press;

        dataArrayNLLine.push(
          {
            year: year,
            bank: bank,
            church: church,
            civilServant: civilServant,
            companies: companies,
            europe: europe,
            humanity: humanity,
            justice: justice,
            parliament: parliament,
            police: police,
            press: press
          });
      // close second for loop
      }

      for (var i = 0; i < 6; i++)
      {
        var bank = dataNetherlands[i].Bank;
        var church = dataNetherlands[i].Churches;
        var civilServant = dataNetherlands[i]["Civil servant"];
        var companies = dataNetherlands[i].Companies;
        var europe = dataNetherlands[i].Europe;
        var humanity = dataNetherlands[i].Humanity;
        var justice = dataNetherlands[i].Justice;
        var parliament = dataNetherlands[i].Parliament;
        var police = dataNetherlands[i].Police;
        var press = dataNetherlands[i].Press;

        dataArrayNLBar.push(
          {
            bank: bank,
            church: church,
            civilServant: civilServant,
            companies: companies,
            europe: europe,
            humanity: humanity,
            justice: justice,
            parliament: parliament,
            police: police,
            press: press
          });
      // close second for loop
      }

      makeBar(dataArrayNLBar);
      makeLine(dataArrayInbraak);
      makeMultiLine(dataArrayCrimeTotal);
      //makeScatter(dataArrayNL, dataArrayInbraakScatter);
      // close getData function
    }

    function makeBar(data){

      // set width and height of chart, of svg, set margins etc.
      var width = 300;
      var height = 200;
      var barPadding = 4;
      var heightMargin = 75;
      var widthMargin = 50;
      var maxValue = 100;
      var numberVariables = 10;


      // make the SVG
      var svg = d3.select("#container-bar")
                  .append("svg")
                  .attr("width", width + widthMargin)
                  .attr("height", height + (2 * heightMargin))
                  .append("g")
                  .attr("id", "nederlandVertrouwen");


      // tooltip for barchart
      // var tip = d3.tip()
      //             .attr("class", "d3-tip")
      //             .offset([-20, 0])
      //             .html(function (d, i) {
      //               return "<strong>tip working</strong>"
      //             })
      //
      // // show tooltip
      // svg.call(tip);

      // define scales
      var x = d3.scale.linear()
                      .domain([0, numberVariables])
                      .range([widthMargin, width + widthMargin]);


      var y = d3.scale.linear()
                      .domain([0, maxValue])
                      .range([0, height]);

      var axisScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([height, 0]);

      var temp = Object.keys(data[0]);

      // set axis
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(10)
                    .tickFormat(function (d) {
                      return temp[d];
                    });

      var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left");

      var dataBar = Object.keys(data[0]);

      // create SVG barchart
      svg.selectAll(".bar")
          .data(dataBar)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function (d, i){
            return i * (width / numberVariables) + widthMargin;
          })
          .attr("y", function (d, i) {
            return height + heightMargin - y(+data[0][d]);
          })
          .attr("width", width / numberVariables - barPadding)
          .attr("height", function(d){
            return y(+data[0][d]);
          })
          .on("click", function (d){
            makeLineBar(d, y);
          })
          .attr("fill", "pink");

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
            .text("joejoe");

        // append xAxis title
        svg.append("text")
              .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
              .style("font-size", "12px")
              .style("font-weight", "bold")
              .style("font-family", "calibri")
              .style("text-anchor", "middle")
              .text("variables");


              // close makeBar
            }

    function makeLine(data){
      // http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
      // got code inspiration from above.

      var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 350 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;


      var x = d3.scale.linear()
              .domain([2010, 2017])
              .range([0, width]);

      var y = d3.scale.linear()
                      .domain([100000, 40000])
                      .range([0, height]);


      var years = ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    // .ticks("7")
                    .tickFormat(function (d, i) {
                      return years[i];
                    });

      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks("6");


      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return x(d.year);
                        })
                        .y(function(d) {
                           return y(+d.burglaryRate);
                        })
                        .interpolate("basis");

         var svg = d3.select("#container-line")
                      .append("svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom)
                      .append("g")
                      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("path")
            .attr("class", "line")
            .attr("d", valueLine(data));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call (yAxis);

        }

    function makeMultiLine(dataCrime){

      var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 470 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

      xMulti = d3.scale.linear()
              .domain([1948, 2017])
              .range([0, width]);

      yMulti = d3.scale.linear()
                      .domain([100, 0])
                      .range([0, height]);

      var xAxis = d3.svg.axis()
                    .scale(xMulti)
                    .orient("bottom")
                    //.ticks(1948, 2017)
                    .tickValues([1948, 1958, 1968, 1978, 1988, 1998, 2008, 2017])
                    .tickFormat(d3.format(".0"));


      var yAxis = d3.svg.axis()
                    .scale(yMulti)
                    .orient("left")
                    .ticks("10");


      var svg = d3.select("#container-line-multi")
                     .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                     .attr("id", "nederlandMisdaad");


      var lineOne = d3.svg.line()
                      .x(function (d) {
                        return xMulti(d.year);
                      })
                      .y(function (d) {
                        return yMulti(+d.totalCrime);
                      });

        svg.append("path")
            .attr("class", "line")
            .attr("d", lineOne(dataCrime))
            .style("stroke", "red");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call (yAxis);

        var lineThree= d3.svg.line()
                        .x(function (d) {
                          return xMulti(d.year);
                        })
                        .y(function (d) {
                          return yMulti(+d.vandalismCrime);
                        });

          svg.append("path")
              .attr("id", "lineThree")
              .attr("d", lineThree(dataCrime))
              .style("stroke", "blue")
              .attr("visibility", "visible");

        var lineTwo = d3.svg.line()
                    .x(function (d) {
                      return xMulti(d.year);
                    })
                    .y(function (d) {
                      return yMulti(+d.capitalCrime);
                    });

        svg.append("path")
          .attr("id", "lineTwo")
          .attr("d", lineTwo(dataCrime))
          .style("stroke", "pink")
          .attr("visibility", "visible");


        var lineFour= d3.svg.line()
                        .x(function (d) {
                          return xMulti(d.year);
                        })
                        .y(function (d) {
                          return yMulti(+d.violenceCrime);
                        });

        svg.append("path")
            .attr("id", "lineFour")
            .attr("d", lineFour(dataCrime))
            .style("stroke", "light-blue")
            .attr("visibility", "visible");


    }

    function makeLineBar(selectedBar, y){

      d3.select("#nederlandVertrouwen").selectAll("circle")
        .remove();

      d3.select("#nederlandVertrouwen").selectAll(".line")
        .remove();

      svg = d3.select("#nederlandVertrouwen");

      var x = d3.scale.linear()
              .domain([2012, 2017])
              .range([50, 350]);

      var xAxis = d3.svg.axis()
                    .scale(x)
                    .tickValues([2012, 2013, 2014, 2015, 2016, 2017])
                    .tickFormat(d3.format(".0"));

      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return x(d.year);
                        })
                        .y(function(d) {
                           return 275 - y(+d[selectedBar]);
                        });

      var tip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([-20, 0])
                  .html(function (d) {
                    return "<span>" + d.year + "</span>"
                  });

      svg.call(tip);

       // Add the scatterplot
       svg.selectAll("dot")
           .data(dataArrayNLLine)
            .enter().append("circle")
           .attr("r", 3.5)
           .attr("cx", function(d) { return x(d.year); })
           .attr("cy", function(d) { return 275 - y(d[selectedBar]); })
           .style("fill", "blue")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide);

        svg.append("path")
            .attr("class", "line")
            .attr("d", valueLine(dataArrayNLLine));

    }

    // function makeScatter(dataNL, dataIB){
    //   console.log(dataNL);
    //
    //   var margin = {top: 100, right: 100, bottom: 60, left: 100},
    //      width = 700 - margin.left - margin.right,
    //      height = 600 - margin.top - margin.bottom;
    //
    //   var svg = d3.select("#container-scatter")
    //               .append("svg")
    //               .attr("width", width + margin.left + margin.right)
    //               .attr("height", height + margin.top + margin.bottom)
    //               .append("g")
    //               .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    //
    //   var y = d3.scale.linear()
    //             .domain([0, 100])
    //             .range([height, 0]);
    //
    //   var x = d3.scale.linear()
    //             .domain([0, 100])
    //             .range([0, width]);
    //
    //   var xAxis = d3.svg.axis()
    //                 .scale(x)
    //                 .orient("bottom");
    //
    //
    //   var yAxis = d3.svg.axis()
    //                 .scale(y)
    //                 .orient("left");
    //
    //
    //   svg.selectAll(".dot")
    //       .data(dataNL)
    //       .enter()
    //       .append("circle")
    //       .attr("cx", function (d){
    //         return x(d.bank);
    //       })
    //       .attr("cy", function (d){
    //         return y(d.church);
    //       })
    //       .attr("r", 4);
    //
    //   svg.append("g")
    //       .attr("class", "axis")
    //       .attr("transform", "translate(0," + height + ")")
    //       .call(xAxis);
    //
    //   svg.append("g")
    //       .attr("class", "axis")
    //       .call(yAxis);
    //

// close onload function
}



function hideLineThree(){

  line = d3.select("#lineThree")
  if (line.attr("visibility") == "visible") {
    line.attr("visibility", "hidden");
  } else {
    line.attr("visibility", "visible")
  }

}

function hideLineTwo(){

  line = d3.select("#lineTwo")
  if (line.attr("visibility") == "visible") {
    line.attr("visibility", "hidden");
  } else {
    line.attr("visibility", "visible")
  }

}

function hideLineFour(){

  line = d3.select("#lineFour")
  if (line.attr("visibility") == "visible") {
    line.attr("visibility", "hidden");
  } else {
    line.attr("visibility", "visible")
  }

}