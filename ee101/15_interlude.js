// Greenest Pixel Composite
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B5', 'B4']));
}

var greenest = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
      .filterDate('2015-02-01', '2015-09-01')
      .map(addNDVI)
      .qualityMosaic('nd')

Map.addLayer(greenest, {max:0.3, bands:["B4", "B3", "B2"]}, 'Greenest Pixel')