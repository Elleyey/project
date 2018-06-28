/*JavaScript for page about Netherlands
By Ellemijke Donner
10734198
for final project programmeren.*/

window.onload = function() {

  queue()
    .defer(d3.json, '../data/Burglary.json')
    .defer(d3.json, '../data/Netherlands.json')
    .defer(d3.json, '../data/crimeRatesTotals.json')
    .awaitAll(getData);

    /*getData to reformat data, to be able to use it in different graphs. Calls
    makeBar, makeLine, makeMultiLine*/
    function getData(error, response) {

      // get responses
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

      // close for loop
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

      // close for loop
      }

      // iterate over data, add the right data
      for (var i = 2; i < 8; i++)
      {
        var year = Number(dataInbraak[i].Year);
        var burglaryRate = Number(dataInbraak[i].Burglary);

      dataArrayInbraak.push(
        {
          year: year,
          burglaryRate: burglaryRate
        });

      // close for loop
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
            Bank: bank,
            Church: church,
            Administrators: civilServant,
            Companies: companies,
            Europe: europe,
            Humanity: humanity,
            Justice: justice,
            Parliament: parliament,
            Police: police,
            Press: press
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
            Bank: bank,
            Church: church,
            Administrators: civilServant,
            Companies: companies,
            Europe: europe,
            Humanity: humanity,
            Justice: justice,
            Parliament: parliament,
            Police: police,
            Press: press
          });

      // close for loop
      }

      makeBar(dataArrayNLBar);
      makeLine(dataArrayInbraak);
      makeMultiLine(dataArrayCrimeTotal);

      // close getData function
    }

    /*makeBar makes static barchar (data from 2012), does not call other functions.*/
    function makeBar(data){

      // set width and height of chart, of svg, set margins etc.
      var margin = {height: 75, width: 50};
      var width = 300;
      var height = 200;
      var barPadding = 4;
      var maxValue = 100;
      var numberVariables = 10;


      var temp = Object.keys(data[0]);

      // make the SVG
      var svg = d3.select("#container-bar")
                  .append("svg")
                  .attr("width", width + margin.width)
                  .attr("height", height + (2 * margin.height))
                  .append("g")
                  .attr("id", "nederlandVertrouwen");


      // tooltip for barchart
      var tip = d3.tip()
                  .attr("class", "tooltipBarNL")
                  .html(function (d) {
                    return +data[0][d] + "%";
                  });

      // show tooltip
      svg.call(tip);

      // define x scale
      var x = d3.scale.linear()
                      .domain([0, numberVariables])
                      .range([margin.width, width + margin.width]);

      // define y scale
      var y = d3.scale.linear()
                      .domain([0, maxValue])
                      .range([0, height]);

      // make axisScale
      var axisScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([height, 0]);

      // set x axis
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(10)
                    .tickFormat(function (d) {
                      return temp[d];
                    });

      // set y axis
      var yAxis = d3.svg.axis()
                    .scale(axisScale)
                    .orient("left");

      var dataBar = Object.keys(data[0]);

      // create bars from barchart
      svg.selectAll(".bar")
          .data(dataBar)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", function (d, i){
            return i * (width / numberVariables) + margin.width;
          })
          .attr("y", function (d, i) {
            return height + margin.height - y(+data[0][d]);
          })
          .on("click", function (d){
            makeLineBar(d, y);
          })
          .attr("fill", function (d) {
            return checkBucket(+data[0][d]);
          })
          .on("mouseover", tip.show)
          .on("mouseout", tip.hide)
          .transition()
            .delay(function (d, i) { return i* 100;})
            .duration(100)
            .attr("width", width / numberVariables - barPadding)
            .attr("height", function(d){
                return y(+data[0][d]);
            });

      // draw x axis
      svg.append("g")
          .attr("class","axis")
          .attr("transform", "translate(0," + (height + margin.height) + ")")
          .call(xAxis)
          .selectAll("text")
          .style("text-anchor", "end")
          .attr("transform", "rotate(-50)");

      // draw y axis
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + margin.width + "," +
                 margin.height + ")")
          .call(yAxis);

      // append title graph
      svg.append("text")
            .attr("y", 60)
            .attr("x", 120)
            .attr("class", "title-normal")
            .text("Trust rates in 2012");

      // append graph texts
      svg.append("text")
          .attr("class", "graph-text")
          .attr("y", 85)
          .attr("x", 57)
          .text("%");

     // close makeBar
     }

    /*makeLine graph makes a single line, does not call any other functions.*/
    function makeLine(data){

      // set margins for svg
      var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 350 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

      // set x scale
      xLine = d3.scale.linear()
              .domain([2012, 2017])
              .range([0, width]);

      // set y sacle
      yLine = d3.scale.linear()
                      .domain([100000, 40000])
                      .range([0, height]);

      // make x axis
      var xAxis = d3.svg.axis()
                    .scale(xLine)
                    .orient("bottom")
                    .ticks("6")
                    .tickFormat(function (d) {
                      return d;
                    });

      // make y axis
      var yAxis = d3.svg.axis()
                    .scale(yLine)
                    .orient("left")
                    .ticks("6");

      // make line
      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return xLine(d.year);
                        })
                        .y(function(d) {
                           return yLine(+d.burglaryRate);
                        })
                        .interpolate("basis");

      // make svg
      var svg = d3.select("#container-line-NL")
                  .attr("id", "oneLine")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      // draw line
      svg.append("path")
          .attr("class", "line")
          .attr("d", valueLine(data));

      // draw x axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // draw y axis
      svg.append("g")
          .attr("class", "y axis")
          .call (yAxis);

      // append graph title
      svg.append("text")
         .attr("y", - 15)
         .attr("x", 60)
         .attr("class", "title-normal")
         .text("Home burglary rates");

      // append text to graph x axis
      svg.append("text")
            .attr("y", 235)
            .attr("x", 255)
            .attr("class", "graph-text")
            .text("Years");

      // append text to graph y axis
      svg.append("text")
            .attr("y", 10)
            .attr("x", -85)
            .attr("class", "graph-text")
            .attr("transform", "rotate(-90)")
            .text("Number of Burglaries");

        // close makeLine
        }

    /*makeMultiLine makes four lines, that appear and disseaper when user clicks
    on html button*/
    function makeMultiLine(dataCrime){

      // set margins
      var margin = {top: 40, right: 20, bottom: 40, left: 60},
      width = 670 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

      // set x for scale global, as it is used in other functions.
      xMulti = d3.scale.linear()
                .domain([1948, 2017])
                .range([0, width]);

      // set y for scale global aswell, as it is used in other functions aswell.
      yMulti = d3.scale.linear()
                .domain([100, 0])
                .range([0, height]);

      // make x axis
      var xAxis = d3.svg.axis()
                    .scale(xMulti)
                    .orient("bottom")
                    .tickValues([1948, 1958, 1968, 1978, 1988, 1998, 2008, 2017])
                    .tickFormat(d3.format(".0"));

      // make y axis
      var yAxis = d3.svg.axis()
                    .scale(yMulti)
                    .orient("left")
                    .ticks("10");

      // make svg
      var svg = d3.select("#container-line-multi")
                     .append("svg")
                     .attr("width", width + margin.left + margin.right)
                     .attr("height", height + margin.top + margin.bottom)
                     .append("g")
                     .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                     .attr("id", "nederlandMisdaad");

      // make line of total rates
      var lineTotal = d3.svg.line()
                      .x(function (d) {
                        return xMulti(d.year);
                      })
                      .y(function (d) {
                        return yMulti(+d.totalCrime);
                      });

      // draw line of total rates
      svg.append("path")
          .attr("class", "line")
          .attr("d", lineTotal(dataCrime))
          .style("stroke", "rgb(215, 25, 28)");

      // draw x axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // draw y axis
      svg.append("g")
          .attr("class", "y axis")
          .call (yAxis);

      // make line vandalism rates
      var lineVandalism = d3.svg.line()
                      .x(function (d) {
                        return xMulti(d.year);
                      })
                      .y(function (d) {
                        return yMulti(+d.vandalismCrime);
                      });

      // draw line vandalism
      svg.append("path")
          .attr("id", "lineVandalism")
          .attr("d", lineVandalism(dataCrime))
          .style("stroke", "rgb(44, 123, 182)")
          .attr("visibility", "visible");

      // make line capital
      var lineCapital = d3.svg.line()
                  .x(function (d) {
                    return xMulti(d.year);
                  })
                  .y(function (d) {
                    return yMulti(+d.capitalCrime);
                  });

      // draw line capital
      svg.append("path")
          .attr("id", "lineFraude")
          .attr("d", lineCapital(dataCrime))
          .style("stroke", "rgb(244,165,130)")
          .attr("visibility", "visible");

      // make line violence
      var lineViolence= d3.svg.line()
                      .x(function (d) {
                        return xMulti(d.year);
                      })
                      .y(function (d) {
                        return yMulti(+d.violenceCrime);
                      });

      // draw line violence
      svg.append("path")
          .attr("id", "lineViolence")
          .attr("d", lineViolence(dataCrime))
          .style("stroke", "rgb(171, 217, 233)")
          .attr("visibility", "visible");

      // write text y axis
      svg.append("text")
              .attr("y", 10)
              .attr("x", -140)
              .attr("class", "graph-text")
              .attr("transform", "rotate(-90)")
              .text("Registered crime per 1000 citizens");

      // write text x axis
      svg.append("text")
              .attr("y", 317)
              .attr("x", 567)
              .attr("class", "graph-text")
              .text("Years");

      // make single dot for link to datareport about decreasing crime
      svg.selectAll("circle")
            .data([10])
            .enter().append("circle")
            .attr("cy", 23)
            .attr("cx", 465)
            .attr("r", 5)
            .style("fill", "rgb(215, 25, 28)");

      // append first part of text, next to the dot
      svg.append("text")
            .attr("y", 24)
            .attr("x", 520)
            .style("font-size", "11px")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("The Mystery of")
            .attr("fill", "blue")
            .on("click", function() {
                  window.open("https://www.cbs.nl/nl-nl/achtergrond/2018/19/het-mysterie-van-de-verdwenen-criminaliteit");
            });

      // append second part of text, next to the dot
      svg.append("text")
            .attr("y", 34)
            .attr("x", 545)
            .style("font-size", "11px")
            .style("font-family", "calibri")
            .style("text-anchor", "middle")
            .text("the Decreasing Crime")
            .attr("fill", "blue")
            .on("click", function() {
                window.open("https://www.cbs.nl/nl-nl/achtergrond/2018/19/het-mysterie-van-de-verdwenen-criminaliteit");
            });

     // close makeMultiLine
     }

    /*makeLineBar to make the line, when clicked on certain variable on barchart*/
    function makeLineBar(selectedBar, y){

      // remove existing circles
      d3.select("#oneLine").selectAll("circle")
         .remove();

      // remove existing lines
      d3.select("#oneLine").selectAll(".lineTrust")
         .remove();

      svg = d3.select("#oneLine");

      // make y scale
      var yThisLine = d3.scale.linear()
              .domain([100, 0])
              .range([0, 240]);

      // make valueLine
      var valueLine = d3.svg.line()
                        .x(function(d) {
                          return 50 + xLine(d.year);
                        })
                        .y(function(d) {
                           return 50 + yThisLine(+d[selectedBar]);
                        });

      // make tip
      var tip = d3.tip()
                  .attr("class", "tooltipLineNL")
                  .offset([-10, 0])
                  .html(function (d) {
                    return "<tip-visible><span>" + (d[selectedBar]) + "% of trust in " + selectedBar + "</span>"
                  });

      // call tip
      svg.call(tip);

      // draw line
      svg.append("path")
          .attr("class", "lineTrust")
          .attr("d", valueLine(dataArrayNLLine))
          .style("stroke", "rgb(239,138,98)");

       // Add the dots
       svg.selectAll("dot")
           .data(dataArrayNLLine)
            .enter()
            .append("circle")
           .attr("r", 5)
           .attr("cx", function(d) { return 50 + xLine(d.year); })
           .attr("cy", function(d) { return 50 + yThisLine(d[selectedBar]); })
           .style("fill", "rgb(239,138,98)")
           .on("mouseover", tip.show)
           .on("mouseout", tip.hide);

     // close makeLineBar
     }

// close onload function
}

/*Three simular functions to hide the line, when clicked on box*/
function hideLine(id){
    console.log(id);
    line = d3.select("#line" + id)
    if (line.attr("visibility") == "visible") {
      line.attr("visibility", "hidden");
    }
    else {
      line.attr("visibility", "visible")
    }
  }

/*checkBucket to give color to barchart*/
function checkBucket(n){

  // give specific color accordingly to percentages
  if (n < 20) {
    return 'rgb(178,24,43)'
  }
  if (n < 30) {
    return 'rgb(214,96,77)'
  }
  if (n < 40) {
    return 'rgb(244,165,130)'
  }
  if (n < 50) {
    return 'rgb(253,219,199)'
  }
  if (n < 60) {
    return 'rgb(209,229,240)'
  }
  if (n < 70){
    return 'rgb(146,197,222)'
  }
  if (n < 80){
    return 'rgb(67,147,195)'
  }
  if (n < 90){
    return 'rgb(33,102,172)'
  }
  if (n < 10){
    return 'rgb(5,48,97)'
  }
}
