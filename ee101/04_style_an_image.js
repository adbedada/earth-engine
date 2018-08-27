// Style an image.
var srtm = ee.Image("CGIAR/SRTM90_V4");
Map.addLayer(srtm, {min:0, max:1000});