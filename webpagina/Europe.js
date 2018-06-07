var map = new Datamap({
  element: document.getElementById("container"),
  scope:'world',
  setProjection: function(element){
    var projection = d3.geo.equirectangular()
                        .center([10, 50])
                        .rotate([4.4, 0])
                        .scale(350)
                        .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
    var path = d3.geo.path()
                  .projection(projection);
    return {path: path, projection: projection};
  }
});
