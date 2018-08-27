// Mapping a function.
function addNDVI(input) {
  var ndvi = input.normalizedDifference(['B5', 'B4']);
  return input.addBands(ndvi);
}

var collection = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA");
var filtered = collection.filterDate('2015-02-01', '2015-09-01');
Map.addLayer(filtered, {min:0, max:0.3, bands:['B4','B3','B2']}, 'RGB');

var with_ndvi = filtered.map(addNDVI);
Map.addLayer(with_ndvi, {bands:['nd'], min:0, max:1}, 'NDVI');