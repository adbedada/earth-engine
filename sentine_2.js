//Load Sentinel-2 TOA reflectance data
var s2 = ee.ImageCollection('COPERNICUS/S2');

// Get the boundary of Sri Lanka from Google's Fusion Table
// Change Country name for different location
var Sri_Lanka = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
  .filter(ee.Filter.eq('Country', 'Sri Lanka'));


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
                  .filterBounds(Sri_Lanka)
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 3))
                  .map(maskS2clouds)
                  .median()

// Select bands with 10 meters resolution
var bands = ['B2', 'B3', 'B4', 'B8'];

// Create a mosaic of image collections
var image = ee.ImageCollection([
  sr_collection.select(bands),
]).mosaic();

// Visualize
Map.addLayer(image,  {bands: ['B4', 'B3', 'B2'], max: 0.3}, 'Sentinel 2');

// Export image
Export.image.toDrive({
  image:image,
  description:"SL_mosaic_2017",
  scale:10,
  crs: "EPSG:4326",
  //maxPixels:2000000000 ( pass max value if needed)
})
