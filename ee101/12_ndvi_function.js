// NDVI as a function
function addNdvi(input) {
  var ndvi = input.normalizedDifference(['B5', 'B4']);
  return input.addBands(ndvi);
}

var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_207023_20130403')
var with_ndvi = addNdvi(image)
Map.addLayer(with_ndvi, {bands:['nd'], min:0, max:1});