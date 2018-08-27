// This script extracts image from Landsat 4 Surface Reflectence

var raw_image = ee.ImageCollection("LANDSAT/LE07/C01/T1_SR")


// Get the boundary of country from Publicly avalibale Fusion Table (spreadsheet)

var Mali = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
  .filter(ee.Filter.eq('Country', 'Mali'));


// Set the locaiton of the place
Map.setCenter(-5.89, 14.09, 7)


// Function to cloud mask from the Fmask band of Landsat  data.
function maskLsr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(4).int();
  var cloudsBitMask = ee.Number(2).pow(2).int();

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}


// Define time period and cloud masking
var image_collection = raw_image.filterDate('2001-01-01', '2001-12-31')
                  //.filterBounds(Mali)
                   //.filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 50))
                   .map(maskLsr)
                   .median()



var mali_collection = image_collection.clip(Mali);

Map.addLayer(mali_collection, {bands: ["B3", "B2", "B1"], min:0, max:0.3}, "Raw_image" )


//Export
Export.image.toDrive({
  image:mali_collection,
  description:"Metro_DC",
  scale:10,
  crs: "EPSG:4326",
  maxPixels:200000000
})
