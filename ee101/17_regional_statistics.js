/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = /* color: #ff0000 */ee.Geometry.Polygon(
        [[[-6.9488525390625, 53.556626004824615],
          [-6.9488525390625, 53.13688533380001],
          [-6.0205078125, 53.13688533380001],
          [-6.0205078125, 53.556626004824615]]], null, false);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
          
// Regional statistics
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B5', 'B4']));
}

var greenest = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
      .filterDate('2015-02-01', '2015-09-01')
      .map(addNDVI)
      .qualityMosaic('nd');

var stats = greenest.select('nd')
    .reduceRegion(ee.Reducer.mean(), geometry, 100);
    
print(stats)