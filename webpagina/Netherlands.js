window.onload = function() {

  queue()
    .defer(d3.json, 'Inbraak.json')
    .defer(d3.json, 'Netherlands.json')
    .awaitAll(getData);

    function getData(error, response) {
       var dataInbraak = response[0].All_data;
       var dataNetherlands = response[1].All_data;
       if (error) throw error;
       var dataArrayInbraak = [];
       var dataArrayNL =[];
       console.log(dataInbraak);
       console.log(dataNetherlands)

      // iterate over data, add the right data to a certain country
      for (var i = 0; i < 8; i++)
      {
        var year = dataInbraak[i].Year;
        var burglaryRate = dataInbraak[i].Burglary;

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

        dataArrayNL.push(
          {
            //year: year,
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
      makeBar(dataArrayNL);
      makeLines(dataArrayInbraak);
      // close getData function
    }

    function makeBar(data){
      console.log(data);

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
                  .append("g");

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

      console.log(Object.keys(data[0]));

      var temp = Object.keys(data[0]);
      console.log(temp);

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

      // create SVG barchart
      svg.selectAll(".bar")
          .data(Object.keys(data[0]))
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
          .attr("fill", "#2ca25f");

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
              .text("Percentages");
              // close makeBar
            }

    function makeLines(data){
      console.log(data);

      var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = 600 - margin.left - margin.right,
      height = 270 - margin.top - margin.bottom;


      var x = d3.time.scale()
              .domain([2010, 2017])
              .range([0, width]);

      var y = d3.scale.linear()
                      .domain([40000, 100000])
                      .range([0, height]);


      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks("8");

      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks("6");

      var valueLine = d3.svg.line()
                        .x(function(d) {
                          console.log(d.year);
                          x(d.year);
                        })
                        .y(function(d) {
                          console.log(+d.burglaryRate);
                          y(+d.burglaryRate);
                        });

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
// close onload function
}
