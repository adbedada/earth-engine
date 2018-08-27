// This script calcuates NDVI and creates time-series chart
// Load Sentinel-2 TOA reflectance data
var s2 = ee.ImageCollection('COPERNICUS/S2');

// Function to mask clouds using the Sentinel-2 QA band.
function maskS2clouds(image) {
  var qa = image.select('QA60');// QA = 60 meters
  var cloudBitMask = ee.Number(2).pow(10).int();
  var cirrusBitMask = ee.Number(2).pow(11).int();
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
             qa.bitwiseAnd(cirrusBitMask).eq(0));

  // Return the masked and scaled data
  return image.updateMask(mask).divide(10000)
  .copyProperties(image, ["system:time_start"]);
}

// Select time frame, filter using boundary and cloud masker
// Get the median values
var sr_collection = s2.filterDate('2017-01-01', '2018-03-31')
                  .filterBounds(study_area)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 3))
                  .map(maskS2clouds)
                  .median()

// Select bands with 10 meters resolution
var bands = ['B2', 'B3', 'B4', 'B8'];

// Create a mosaic of image collections
var image = ee.ImageCollection([
  sr_collection.select(bands).clip(study_area),
]).mosaic();

// Chart NDVI time-series
// Built-in function to calculate NDVI
function addNDVI(image) {
  return image.addBands(image.normalizedDifference(['B8', 'B4']))
}

// Run NDVI on image with no cloud mask
var ndvi_report = s2.filterDate('2017-01-01', '2018-03-31')
                  .map(addNDVI)
                  .filterBounds(study_area);

// print chart
print(ui.Chart.image.series({
  imageCollection: ndvi_report.select('nd'),
  region: study_area,
  reducer: ee.Reducer.mean()
}))

// Visualize Original Image
Map.addLayer(image,  {bands: ['B8', 'B4', 'B3'], max: 0.3}, 'Sentinel 2');

// Visualize the NDVI Layer
var ndvi_layer = image.normalizedDifference(['B8', 'B4'])
Map.addLayer(ndvi_layer, {min: -1, max: 1, palette: ['red', 'yellow', 'green']}, 'NDVI');


// Export the NDVI Layer
Export.image.toDrive({
  image:ndvi,
  description:"SL_ndvi_2017",
  scale:10,
  crs: "EPSG:4326",
})
