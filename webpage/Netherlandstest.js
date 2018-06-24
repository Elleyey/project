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

      for (var i = 2; i < 8; i++)
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


      //  tooltip for barchart
      var tip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([-20, 0])
                  .html(function (d, i) {
                    return "click to see line"
                  });

      // show tooltip
      svg.call(tip);

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
          .on("click", function (d){
            makeLineBar(d, y);
          })
          .attr("fill", "pink")
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .transition()
            .delay(function (d, i) { return i* 100;})
            .duration(100)
            .attr("width", width / numberVariables - barPadding)
            .attr("height", function(d){
                return y(+data[0][d]);
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

      svg.append("text")
          //  .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
            .attr("y", 50)
            .attr("x", 170)
            .style("font-size", "14px")
          //  .style("font-weight", "bold")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("Trust in the Netherlands (2012)");

     svg.append("text")
          .attr("y", 85)
          .attr("x", 57)
          .style("font-size", "10px")
          //.attr("transform", "rotate(-90)")
          .style("font-family", "calibri")
          .style("text-anchor", "middle")
          .text("%");

              // close makeBar
            }

    function makeLine(data){
      // http://bl.ocks.org/d3noob/b3ff6ae1c120eea654b5
      // got code inspiration from above.

      var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 350 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;


      xLine = d3.scale.linear()
              .domain([2012, 2017])
              .range([0, width]);

      yLine = d3.scale.linear()
                      .domain([100000, 40000])
                      .range([0, height]);

      var xAxis = d3.svg.axis()
                    .scale(xLine)
                    .orient("bottom")
                    .ticks("6")
                    .tickFormat(function (d) {
                      return d;
                    });

      var yAxis = d3.svg.axis()
                    .scale(yLine)
                    .orient("left")
                    .ticks("6");


      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return xLine(d.year);
                        })
                        .y(function(d) {
                           return yLine(+d.burglaryRate);
                        })
                        .interpolate("basis");

         var svg = d3.select("#container-line")
                      .attr("id", "oneLine")
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

        svg.append("text")
            //  .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
              .attr("y", - 15)
              .attr("x", 120)
              .style("font-size", "14px")
            //  .style("font-weight", "bold")
              .style("font-family", "calibri")
              .style("text-anchor", "middle")
              .text("Burglary rates in the Netherlands");

      svg.append("text")
          //  .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
            .attr("y", 233)
            .attr("x", 264)
            .style("font-size", "10px")
          //  .style("font-weight", "bold")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("years");

      svg.append("text")
            .attr("y", 10)
            .attr("x", -20)
            .style("font-size", "10px")
            .attr("transform", "rotate(-90)")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("quantities");


        }

    function makeMultiLine(dataCrime){

      var margin = {top: 30, right: 12, bottom: 30, left: 50},
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


        //  tooltip for barchart
        var tip = d3.tip()
                    .attr("class", "d3-tip")
                    .offset([-20, 0])
                    .html(function (d, i) {
                      return "The Mystery of The Decreasing Crime"
                    });

        // show tooltip
        svg.call(tip);

        svg.append("text")
            //  .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
              .attr("y", -2)
              .attr("x", 170)
              .style("font-size", "14px")
            //  .style("font-weight", "bold")
              .style("font-family", "calibri")
              .style("text-anchor", "middle")
              .text("Crime in the Netherlands");

          svg.append("text")
                .attr("y", 10)
                .attr("x", -70)
                .style("font-size", "10px")
                .attr("transform", "rotate(-90)")
                .style("font-family", "calibri")
                .style("text-anchor", "middle")
                .text("Registered crime per 1000 citizens");

          svg.append("text")
              //  .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
                .attr("y", 235)
                .attr("x", 370)
                .style("font-size", "10px")
              //  .style("font-weight", "bold")
                .style("font-family", "calibri")
                .style("text-anchor", "middle")
                .text("years");


            svg.selectAll("circle")
              .data([10])
              .enter().append("circle")
              .attr("cy", 17)
              .attr("cx", 320)
              .attr("r", 5)
              .style("fill", "red")
              .on("mouseover", tip.show)
              .on("mouseout", tip.hide);


    }

    function makeLineBar(selectedBar, y){

      d3.select("#oneLine").selectAll("circle")
         .remove();

      d3.select("#oneLine").selectAll(".lineTrust")
         .remove();

        console.log(selectedBar);

      svg = d3.select("#oneLine");


      var yThisLine = d3.scale.linear()
              .domain([100, 0])
              .range([0, 240]);

      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return 50 + xLine(d.year);
                        })
                        .y(function(d) {
                           return 50 + yThisLine(+d[selectedBar]);
                        });


      var tip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([-20, 0])
                  .html(function (d) {
                    console.log(d);
                    console.log(selectedBar);
                    return "<tip-visible><span>" + (d[selectedBar]) + "% of trust in " + selectedBar + "</span>"
                  });


      svg.call(tip);

      svg.append("path")
          .attr("class", "lineTrust")
          .attr("d", valueLine(dataArrayNLLine))
          .style("stroke", "pink");

       // Add the scatterplot
       svg.selectAll("dot")
           .data(dataArrayNLLine)
            .enter()
            .append("circle")
           .attr("r", 5)
           .attr("cx", function(d) { return 50 + xLine(d.year); })
           .attr("cy", function(d) { return 50 + yThisLine(d[selectedBar]); })
           .style("fill", "red")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide);


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
