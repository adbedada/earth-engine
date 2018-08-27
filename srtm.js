// Load the SRTM 30 meters layer
var SRTM = ee.Image('USGS/SRTMGL1_003');

// Get the boundary of the country
var country_boundary = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
  .filter(ee.Filter.eq('Country', 'Kenya'));


// Set the Center of the location of interest
Map.setCenter(37.134, 0.922, 6)

// Clip Image by the boundary of the country
var srtm_1 = SRTM.clip(country_boundary)

// Visualize
Map.addLayer(srtm_1, {min: 0, max: 4500, palette: ['red', 'yellow', 'green']}, 'SRTM_2001')


// Export Image with 250 meters resolution
Export.image.toDrive({
  image:srtm_1,
  description:"Kenya_SRTM_30m",
  scale:30,
  crs: "EPSG:4326",
//  maxPixels:150000000
})
