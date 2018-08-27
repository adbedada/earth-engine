// This script demonestrates image classification using Random Forest

      """
        Sample training and testing data were created in QGIS.
       and then uploaded to Google's Fusion Tables
       """

// Load Landsat 8 surface reflectance data
var l8sr = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');

// Load boundary of the Study Area
var SL_western = ee.FeatureCollection('ft:137DnocmFqHYNEpZXvWwzMn0ctvHjcf2Zz9MW4crm')

// Set the Center of the location of interest
Map.setCenter(79.8953, 6.9326, 6)

// Function to cloud mask from the Fmask band of Landsat 8 SR data.
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(3).int();
  var cloudsBitMask = ee.Number(2).pow(5).int();

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Return the masked image, scaled to [0, 1].
  return image.updateMask(mask).divide(10000);
}

// Map the function over one year of data and take the median.
var composite = l8sr.filterDate('2016-01-01', '2016-12-31')
                    .map(maskL8sr)
                    .filterBounds(Sri_Lanka)
                    .median();

// Select the Blue, Green, Red, NIR, SWIR-1 and SWIR-2 Bands
var bands = ['B2','B3', 'B4','B5', 'B6','B7'];

// Load an image over a portion of southern California, USA.
var image = composite.select(bands)
                      .clip(SL_western);

// Load training polygons from a Fusion Table.
var training_polygons = ee.FeatureCollection('ft:1aDSAiJ3webPitvbadXYEwY5YaAlrDmKSVB_LLBid');
var testing_polygons = ee.FeatureCollection('ft:1yLYIjazK9-74vDyJoNbG6Dti-X0M8Y_QJp3Pb8YX');


// Get the training data
var training_data = image.sampleRegions({
  collection: training_polygons,

  // The 'class' property stores known class labels.
  properties: ['class'],

  scale: 30
});

  // Get the sample from the polygons FeatureCollection.
var test_data = image.sampleRegions({

  collection: testing_polygons,
  // Keep this list of properties from the polygons.
  properties: ['class'],
  // Set the scale to get Landsat pixels in the polygons.
  scale: 30
});

//print (training_data)

// Set RF classifier with 10 trees
// train the classifier
var classifier = ee.Classifier.randomForest(10);
var on_train_data = classifier.train(training_data, 'class', bands);


// Classify the image using the trained classifer
var classified_image = image.classify(on_train_data);


// Get accuracy report for predicted outputs
var trainAccuracy = classifier.confusionMatrix();
print('Resubstitution error matrix: ', trainAccuracy);
print('Training overall accuracy: ', trainAccuracy.accuracy());


//Train classifier on testing data
var on_test_data = test_data.classify(classifier);

//  Get Testing accuracy report.
var testAccuracy = validated.errorMatrix('class', 'classification');
print('Testing error matrix: ', testAccuracy);
print('Testing overall accuracy: ', testAccuracy.accuracy());

// Set Color pallete for Classified image
var palette = [
  'e06368', // urban
  '80ce58', //vegetation
  '25aacc', //water
  'dbbf1d' // Soil/Baren/open_land

];

// Visualize
Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], min: 0, max: 0.2}, 'Original Image');
Map.addLayer(classified, {min: 1, max: 4, palette: palette}, 'Classified Image');
