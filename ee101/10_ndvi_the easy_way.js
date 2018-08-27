// Easier NDVI
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_207023_20130403')
var ndvi = image.normalizedDifference(['B5', 'B4']);
Map.addLayer(ndvi, {min:0, max:1}, 'NDVI');

