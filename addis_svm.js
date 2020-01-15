// //Load Sentinel-2 TOA reflectance data
var s2 = ee.ImageCollection('COPERNICUS/S2');



var l8sr = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR');
var L5tm = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
var L7tm = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')

function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = ee.Number(2).pow(3).int();
  var cloudsBitMask = ee.Number(2).pow(5).int ();
  var qa = image.select('pixel_qa');
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask).divide(10000);
}

// Map the function over one year of data and take the median.
var composite1 = l8sr.filterDate('2018-01-01', '2018-12-31')
                    .map(maskL8sr)
                    .filterBounds(geometry); 
                    
var composite2 = L5tm.filterDate('2010-01-01', '2010-12-31')
                    .map(maskL8sr)
                    .filterBounds(geometry); 
  
 
// Use these bands for prediction.
var bandls8 = ['B2', 'B3', 'B4','B5','B6','B7'];
//var bandls5 = ['B1','B2', 'B3', 'B4','B5','B7'];


var image1 = composite1.median().select(bandls8).clip(geometry);
var image2 = composite2.median().select(bandls5).clip(geometry);


var polygons = ee.FeatureCollection([
   ee.Feature(non_urban, {'class': 0}),
   ee.Feature(addis_urban, {'class': 1})
]);

var training = image1.sampleRegions({
  collection: polygons,
  properties: ['class'],
  scale: 30
});

var classifier = ee.Classifier.svm({
  kernelType: 'RBF',
  gamma: 0.5,
  cost: 10
});

// // Train the classifier.
var trained = classifier.train(training, 'class', bandls8);

// // Classify the image.
var classified = image1.classify(trained);

print(classified)

Map.setCenter(38.7444, 8.975, 12)
//Map.addLayer(image1, {bands: ["B4","B3","B2"],min:0, max:0.3},"L8");
Map.addLayer(image1, {bands: ["B3","B2","B1"],min:0, max:0.3}, "L5");
Map.addLayer(classified, {min: 0, max: 1, palette: ['black', 'cyan']},
          'Addis Abeba');
    

// // Export.image.toDrive({
// //   image:image2,
// //   description:"NYC_1991_Landsat_5",
// //   scale:30,
// //   crs: "EPSG:4326",
// //   //maxPixels:200000000
// // })

// ////////////////////////////////////

// // Input imagery is a cloud-free Landsat 8 composite.
// var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1');

// var imagex = ee.Algorithms.Landsat.simpleComposite({
//   collection: l8.filterDate('2018-01-01', '2018-12-31'),
//   asFloat: true
// });
// var image = imagex.clip(geometry);
// // Use these bands for prediction.
// var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B10', 'B11'];

// // Make a FeatureCollection from the hand-made geometries.
// var polygons = ee.FeatureCollection([
//   ee.Feature(addis_urban, {'class': 1}),
// ]);

// // var polygons = ee.FeatureCollection([
// //   ee.Feature(addis_urban, {'class': 1}),
// // ]);

// // Get the values for all pixels in each polygon in the training.
// var training = image.sampleRegions({
//   // Get the sample from the polygons FeatureCollection.
//   collection: polygons,
//   // Keep this list of properties from the polygons.
//   properties: ['class'],
//   // Set the scale to get Landsat pixels in the polygons.
//   scale: 30
// });

// // Create an SVM classifier with custom parameters.
// var classifier = ee.Classifier.svm({
//   kernelType: 'RBF',
//   gamma: 0.5,
//   cost: 10
// });

// // Train the classifier.
// var trained = classifier.train(training, 'class', bands);

// // Classify the image.
// var classified = image.classify(trained);

// // Display the classification result and the input image.
// Map.setCenter(38.7509, 8.9345, 12)
// Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.5, gamma: 2});
// Map.addLayer(polygons, {}, 'training polygons');
// Map.addLayer(classified,
//             {min: 0, max: 2, palette: ['red', 'green']},
//             'Addis');
    
