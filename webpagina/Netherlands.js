window.onload = function() {

  queue()
    .defer(d3.json, 'Inbraak.json')
    .defer(d3.json, 'Netherlands.json')
    .awaitAll(getData);

function getData(error, response) {

   var dataInbraak = response[0];
   var dataNetherlands = response[1];
  // if (error) throw error;
  // var countriesLength = 29;
  // var dataArray = [];
  // var obj = {};
  //
  // // iterate over data, add the right data to a certain country
  // for (var i = 0; i < countriesLength; i++)
  // {
  //   var countryName = dataEurope[]
  // }
  console.log(dataInbraak);
  console.log(dataNetherlands);
  //console.log(dataEurope["0"]["European Parliament"]);
}

// close onload function
}
