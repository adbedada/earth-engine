/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #ff0000 */ee.Geometry.Polygon(
        [[[-6.9488525390625, 53.556626004824615],
          [-6.9488525390625, 53.13688533380001],
          [-6.0205078125, 53.13688533380001],
          [-6.0205078125, 53.556626004824615]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
// Chart a time-series.
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B5', 'B4']))
}

var with_ndvi = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
      // Note the date changes.
      .filterDate('2015-02-01', '2015-09-01')
      .map(addNDVI)

var greenest = with_ndvi.qualityMosaic('nd')

print(ui.Chart.image.series({
  imageCollection: with_ndvi.select('nd'), 
  region: geometry, 
  reducer: ee.Reducer.mean()
}))