
var widget = ui.Label({
  value: 'Detection of items on the ocean surface (Experimental)',
  style: {width: '520px', height: '50px', fontSize: '20px', color: '484848', textAlign : 'center'}
});
Map.add(widget);

Map.centerObject(geometry1)

function maskS2clouds(image) {
  var qa = image.select('QA60');
  

  // Bits 10 and 11 are clouds and cirrus, respectively.
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
      .and(qa.bitwiseAnd(cirrusBitMask).eq(0));

  return image.updateMask(mask).divide(10000);
}

var dataset = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2019-05-05', '2019-05-08')
                  // Pre-filter to get less cloudy granules.
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE',50))
                  .filterBounds(geometry1)
                  .map(maskS2clouds)
                  .first();

//print (dataset)

////////////////////////////////////////


var visualization_0 = {
  min: 0.0,
  max: 0.3,
  bands: ['B4', 'B3', 'B2'],
};


Map.addLayer(dataset, visualization_0, 'RGB');

////////////////////////////////////////

var ndwi = dataset.normalizedDifference(['B3','B8']).rename('NDWI')
var ndwi_added =  dataset.addBands(ndwi)

//print (ndwi_added)

var visParams = {
  min: -1,
  max: 1
}
    
Map.addLayer(ndwi_added.select('NDWI'),visParams,'NDWI', false)

var mask = ndwi_added.select('NDWI').gt(0.15);
var maskedComposite = ndwi_added.updateMask(mask);

Map.addLayer(maskedComposite, visParams, 'masked', false);

var PI = maskedComposite.expression(
  'b8/(b8+b4)',{
    'b8' : maskedComposite.select('B8'),
    'b4' : maskedComposite.select('B4')
  }).rename('PI');

var PI_added = maskedComposite.addBands(PI)
//print (PI_added)

var palettes = require('users/gena/packages:palettes');
var palette = palettes.kovesi.linear_grey_0_100_c0[7];

Map.addLayer(PI_added.select('PI'), {min: 0.45, max: 0.50, palette: palette}, 'PI', false);

var Debri_Mask = PI_added.select('PI').gt(0.45).and(PI_added.select('PI').lt(0.50)).rename('debri_mask')
var maskedDebri_Mask = PI_added.updateMask(Debri_Mask);

//print (maskedDebri_Mask)

var visParams2 = {
  min: -1,
  max: 1
}

Map.addLayer(maskedDebri_Mask, visParams, 'maskedDebri_Mask', false);

Map.centerObject(geometry, 15)

//buffer around mangroves 
var buffer = ee.Image(1)
    .cumulativeCost({
      source: maskedDebri_Mask.select('PI'), 
      maxDistance: 25,
    }).lt(25);

var params = {min: 0, max: 10, palette: ['red']};
Map.addLayer(buffer.mask(buffer), params, 'buffer');


//////////////////////////////
/////////////////////////////////////////

// set position of panel
var legend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});
 
// Create legend title
var legendTitle = ui.Label({
  value: 'Legend',
  style: {
    fontWeight: 'bold',
    fontSize: '18px',
    margin: '0 0 4px 0',
    padding: '0'
    }
});
 
// Add the title to the panel
legend.add(legendTitle);
 
// Creates and styles 1 row of the legend.
var makeRow = function(color, name) {
 
      // Create the label that is actually the colored box.
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          // Use padding to give the box height and width.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Create the label filled with the description text.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // return the panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });im
};
 
//  Palette with the colors
//var palette =['696969', '32CD32', '00FFFF', '0000ff', '00022e', '008509'];
var palette = ['ff0000']
 
// name of the legend
var names = ['PotentialTargets'];
 
// Add color and and names
for (var i = 0; i < 1; i++) {
  legend.add(makeRow(palette[i], names[i]));
  }  
 
// add legend to map (alternatively you can also print the legend to the console)
Map.add(legend);