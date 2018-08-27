// Load the Modis Albedo Image collection
// MCD4A3 Contains both Black and White Albedo

var modisAlbedo = ee.ImageCollection('MODIS/MCD43A3');

// Get the boundary of a country
var country_boundary = ee.FeatureCollection('ft:1tdSwUL7MVpOauSgRzqVTOwdfy17KDbw-1d9omPw')
  .filter(ee.Filter.eq('Country', 'Mauritania'));

// Center the location of image
Map.setCenter(-10.257, 20.829, 6);

// Subset Black and White Bands
var black_bands = [
                   "Albedo_BSA_Band1",
                   "Albedo_BSA_Band2",
                   "Albedo_BSA_Band3",
                   "Albedo_BSA_Band4",
                   "Albedo_BSA_Band5",
                   "Albedo_BSA_Band6",
                   "Albedo_BSA_Band7"
                 ]
var white_bands = [
                   "Albedo_WSA_Band1",
                   "Albedo_WSA_Band2",
                   "Albedo_WSA_Band3",
                   "Albedo_WSA_Band4",
                   "Albedo_WSA_Band5",
                   "Albedo_WSA_Band6",
                   "Albedo_WSA_Band7"
                 ]

// Select the time period of interest
var modAlbedo_1 = ee.ImageCollection(modisAlbedo.filterDate('2017-01-01', '2017-12-31')););

// Get the average albedo values
// clip Layers by the boundary of the country
var black_albedo_1 = modAlbedo_1.mean()
                                .select(black_bands)
                                .clip(country_boundary)
var white_albedo_1 = modAlbedo_1.mean()
                                .select(white_bands)
                                .clip(country_boundary)

// Visualize
Map.addLayer( black_albedo_1, {min:150, max:500, pallete:['green','yellow', 'red']},"Black Albedo")
Map.addLayer( white_albedo_1, {min:150, max:500, pallete:['green','yellow', 'red']},"White Albedo")


// Export Images
Export.image.toDrive({
  image:black_albedo_1,
  description:"Mauritania_black_albedo_2014",
  scale:500,
  crs: "EPSG:4326",
  //maxPixels:200000000
})

Export.image.toDrive({
  image:white_albedo_1,
  description:"Mauritania_white_albedo_2014",
  scale:500,
  crs: "EPSG:4326",
  //maxPixels:200000000
})
