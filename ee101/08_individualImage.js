// Display 1 image from the collection.
var image = ee.Image('LANDSAT/LC08/C01/T1_TOA/LC08_207023_20130403')
Map.addLayer(image, {min:0, max:0.3, bands:['B4','B3','B2']}, 'RGB');
