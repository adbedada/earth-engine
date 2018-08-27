// Create an NDVI Image, the hard way.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_207023_20130403')

var red = image.select('B4');
var nir = image.select('B5');
var ndvi = nir.subtract(red).divide(nir.add(red));
Map.addLayer(ndvi, {min:0, max:1}, 'NDVI');

