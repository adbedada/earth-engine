// Greenest Pixel Composite
function addNDVI(input) {
  var ndvi = input.normalizedDifference(['B5', 'B4']);
  return input.addBands(ndvi);
}

var collection = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA");
var filtered = collection.filterDate('2015-02-01', '2015-09-01');
Map.addLayer(filtered, {min:0, max:0.3, bands:['B4','B3','B2']}, 'RGB');

var with_ndvi = filtered.map(addNDVI);
var greenest = with_ndvi.qualityMosaic('nd');
Map.addLayer(greenest, {max:0.3, bands:["B4", "B3", "B2"]}, 'Greenest Pixel');
