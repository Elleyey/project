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
      console.log(dataArrayNL);
      console.log(dataArrayInbraak);
      makeBar(dataArrayNL);
      makeLines(dataArrayInbraak);
      // close getData function
      }

    function makeBar(data){
      // set width and height of chart, of svg, set margins etc.
      var width = 400;
      var height = 200;
      var barPadding = 4;
      var heightMargin = 50;
      var widthMargin = 50;
      var maxValue = 100;
      var numberVariables = 10;

      // make the SVG
      var svg = d3.select("body")
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
                      .domain([0, maxValue])
                      .range([widthMargin, width + widthMargin]);

      var y = d3.scale.linear()
                      .domain([0, numberVariables])
                      .range([height, 0]);

      // set axis
      var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .ticks(10);

      var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left")
                    .ticks(numberVariables);

        var data2012 = data["0"];
        console.log(data2012);
        console.log(data2012.keys());
      // create SVG barchart
      svg.selectAll(".bar")
          .data(data)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("y", function (d, i) {
            return y(d.police);
          })
          .attr("x", 0)
          .attr("height", width / numberVariables - barPadding)
          .attr("width", function(d){
            console.log(d);
            return x(+d);
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
      
    }
// close onload function
}
