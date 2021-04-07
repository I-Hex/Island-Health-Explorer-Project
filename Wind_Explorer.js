//////////////////////////////////////////////////////////////////////////////////////
Map.setCenter(74,2,6)

var panel = ui.Panel({style: {width:'400px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Atoll Wind Explorer ||',
  style: {
    fontWeight: 'bold',
    fontFamily: 'sans',
    fontSize: '25px',
    margin: '0 0 4px 0',
    textAlign: 'Center',
    color: '#b31b1b',
    padding: '10px'
    }
}));



panel.add(ui.Label({value: 'The Maldives does not experience major cyclonic events, and the general wind patterns are heavily influenced by the Monsoons. Named in Dhivehi as Iruvai (East) and Hulhangu (West), the two seasons on the Maldives are traditionally named according to the wind direction. Research suggests that monsoonal wind patterns is a major driver in shaping the current geological form of the Maldivian atolls and the geomorphology of the islands. Three options are offered , mean, maximum and minimum which visualizes the mean, maximum or minimum wind patterns across the specified time frame. Wind patterns are derived from the  ERA5 dataset from the ECMWF/Copernicus Climate Change Service, with the temporal scale in days.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'sans',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px'
    }
}));




panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to visualize the wind. To reduce processsing time and minimize resources, use a suitable time frame.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'sans',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px'
    }
}));


//////////////////////////////////////////////////////////////////////////////////////

var selectStartYear = ui.Textbox({placeholder: 'Start',  value: '2019-01-01',
  style: {width: '100px'}}); 
var selectEndYear = ui.Textbox({placeholder: 'End',  value: '2019-03-31',
  style: {width: '100px'}}); 
var start_label = ui.Label('Start Date',
  {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
var end_label = ui.Label('End Date',
  {margin: '0 0 0 70px',fontSize: '12px',color: 'gray'});
  
var startRange_subtext = ui.Panel([start_label, end_label],
  ui.Panel.Layout.flow('horizontal'));
var nextRow = ui.Panel([selectStartYear, selectEndYear],
  ui.Panel.Layout.flow('horizontal'));
panel.add(startRange_subtext).add(nextRow);

//print (start_label, selectStartYear)
//print (end_label, selectEndYear)


//////////////////////////////////////////////////////////////////////////////////////

var dataset = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
var styleParams = {
  fillColor: 'b5ffb4',
  color: '00909F',
  width: 3.0,
};
var countries = dataset.style(styleParams);




var Mean = ui.Button({
  label: 'Calculate Mean Wind',
  onClick: function() {
    
    Map.clear()
    Map.setCenter(74,2,6)

    //var date_start = startDate.getValue();
    //var date_end= endDate.getValue();
    // ...
    // The rest of your processing code here
    // Be sure to add your new layer at the end
    // ...
    //mapPanel.addLayer(NDVI_annual_recl.select("slope").clip(AOI),BandCompViz);
    
    var start = selectStartYear.getValue();
    var end = selectEndYear.getValue();
    
    var label = ui.Label('Mean wind magnitude and wind vectors ' +start+' to '+end);
    Map.add(label);

    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    
    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    //var Mean = Time.reduce(ee.Reducer.minMax()).select(['u_component_of_wind_10m_max', 'v_component_of_wind_10m_max']);
    var Mean = Time.reduce(ee.Reducer.mean());

    //print (Mean)

    //var Mean = Time.reduce(ee.Reducer.mean());
    var study_area = Mean.clip(ROI);


    var uv10final = study_area.pow(2).reduce(ee.Reducer.sum()).sqrt();

    // Wind speed visualisation
    var windVis = {
     min: 0,
    max: 10,
    palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
  };

  Map.addLayer(uv10final.clip(ROI), windVis, 'Wind Speed (m/s)', true);
  
  var scale = Map.getScale() * 25; //25000
var numPixels = 1e10;

var samples = study_area.rename(['u10', 'v10']).sample({
  region: ROI, 
  scale: scale, 
  numPixels: numPixels, 
  geometries: true
});

var scaleVector = 0.1;

var vectors = samples.map(function(f) {
  var u = ee.Number(f.get('u10')).multiply(scaleVector);
  var v = ee.Number(f.get('v10')).multiply(scaleVector);
  
  var origin = f.geometry();

  // translate
  var proj = origin.projection().translate(u, v);
  var end = ee.Geometry.Point(origin.transform(proj).coordinates());

  // construct line
  var geom = ee.Algorithms.GeometryConstructors.LineString([origin, end], null, true);
  
  return f.setGeometry(geom);
});

//Map.addLayer(uv10final.clip(bbox), windVis, 'Wind Speed (m/s)', true);
Map.addLayer(vectors.style({ color: 'green', width: 0.5 }), {}, 'Wind vectors', true);
Map.addLayer(countries.clip(ROI), {}, 'USDOS/LSIB_SIMPLE/2017');

/************************ legend ****************************/
    

// set position of panel

var viz = {
  min: 0.0,
  max: 10.0,
  palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
};


var legend = ui.Panel({
style: {
position: 'bottom-left',
padding: '8px 15px'
}
});

// Create legend title
var legendTitle = ui.Label({
value: 'Wind Speed (m/s)',
style: {
fontWeight: 'bold',
fontSize: '18px',
margin: '0 0 4px 0',
padding: '0'
}
});


// Add the title to the panel
legend.add(legendTitle);

// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);

// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(viz['max'])
],
});

legend.add(panel);

// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'25x200'},
style: {padding: '1px', position: 'bottom-center'}
});

// add the thumbnail to the legend
legend.add(thumbnail);

// create text on top of legend
var panel = ui.Panel({
widgets: [////////////////////
ui.Label(viz['min'])
],
});

legend.add(panel);
Map.add(legend);

/************************ legend ****************************/
    
  }
});


panel.widgets().set(5, Mean);

var Max = ui.Button({
  label: 'Calculate Max Wind',
  onClick: function() {
    
    Map.clear()
    Map.setCenter(74,2,6)
    
    //var date_start = startDate.getValue();
    //var date_end= endDate.getValue();
    // ...
    // The rest of your processing code here
    // Be sure to add your new layer at the end
    // ...
    //mapPanel.addLayer(NDVI_annual_recl.select("slope").clip(AOI),BandCompViz);
    
    var start = selectStartYear.getValue();
    var end = selectEndYear.getValue();
    
    var label = ui.Label('Max wind magnitude and wind vectors '+start+' to '+end);
    Map.add(label);

    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    
    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    var Mean = Time.reduce(ee.Reducer.minMax()).select(['u_component_of_wind_10m_max', 'v_component_of_wind_10m_max']);
    //var Mean = Time.reduce(ee.Reducer.mean());

    //print (Mean)

    //var Mean = Time.reduce(ee.Reducer.mean());
    var study_area = Mean.clip(ROI);


    var uv10final = study_area.pow(2).reduce(ee.Reducer.sum()).sqrt();

    // Wind speed visualisation
    var windVis = {
     min: 0,
    max: 10,
    palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
  };

  Map.addLayer(uv10final.clip(ROI), windVis, 'Wind Speed (m/s)', true);
  
  var scale = Map.getScale() * 10; //25000
var numPixels = 1e10;

var samples = study_area.rename(['u10', 'v10']).sample({
  region: ROI, 
  scale: scale, 
  numPixels: numPixels, 
  geometries: true
});

var scaleVector = 0.1;

var vectors = samples.map(function(f) {
  var u = ee.Number(f.get('u10')).multiply(scaleVector);
  var v = ee.Number(f.get('v10')).multiply(scaleVector);
  
  var origin = f.geometry();

  // translate
  var proj = origin.projection().translate(u, v);
  var end = ee.Geometry.Point(origin.transform(proj).coordinates());

  // construct line
  var geom = ee.Algorithms.GeometryConstructors.LineString([origin, end], null, true);
  
  return f.setGeometry(geom);
});

//Map.addLayer(uv10final.clip(bbox), windVis, 'Wind Speed (m/s)', true);
Map.addLayer(vectors.style({ color: 'green', width: 0.5 }), {}, 'Wind vectors', true);
Map.addLayer(countries.clip(ROI), {}, 'USDOS/LSIB_SIMPLE/2017');

/************************ legend ****************************/
    

// set position of panel

var viz = {
  min: 0.0,
  max: 10.0,
  palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
};


var legend = ui.Panel({
style: {
position: 'bottom-left',
padding: '8px 15px'
}
});

// Create legend title
var legendTitle = ui.Label({
value: 'Wind Speed (m/s)',
style: {
fontWeight: 'bold',
fontSize: '18px',
margin: '0 0 4px 0',
padding: '0'
}
});


// Add the title to the panel
legend.add(legendTitle);

// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);

// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(viz['max'])
],
});

legend.add(panel);

// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'25x200'},
style: {padding: '1px', position: 'bottom-center'}
});

// add the thumbnail to the legend
legend.add(thumbnail);

// create text on top of legend
var panel = ui.Panel({
widgets: [////////////////////
ui.Label(viz['min'])
],
});

legend.add(panel);
Map.add(legend);

/************************ legend ****************************/
    
  }
});

//panel.add(Max)
panel.widgets().set(6, Max);


var Min = ui.Button({
  label: 'Calculate Min Wind',
  onClick: function() {
    
    Map.clear()
    Map.setCenter(74,2,6)
    //var date_start = startDate.getValue();
    //var date_end= endDate.getValue();
    // ...
    // The rest of your processing code here
    // Be sure to add your new layer at the end
    // ...
    //mapPanel.addLayer(NDVI_annual_recl.select("slope").clip(AOI),BandCompViz);
    
    var start = selectStartYear.getValue();
    var end = selectEndYear.getValue();
    
    var label = ui.Label('Min wind magnitude and wind vectors '+start+' to '+end);
    Map.add(label);

    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    
    var Data = imageCollection.select(['u_component_of_wind_10m', 'v_component_of_wind_10m']);
    var Time = Data.filter(ee.Filter.date(start, end));
    var Mean = Time.reduce(ee.Reducer.minMax()).select(['u_component_of_wind_10m_min', 'v_component_of_wind_10m_min']);
    //var Mean = Time.reduce(ee.Reducer.mean());

    //print (Mean)

    //var Mean = Time.reduce(ee.Reducer.mean());
    var study_area = Mean.clip(ROI);


    var uv10final = study_area.pow(2).reduce(ee.Reducer.sum()).sqrt();

    // Wind speed visualisation
    var windVis = {
     min: 0,
    max: 10,
    palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
  };

  Map.addLayer(uv10final.clip(ROI), windVis, 'Wind Speed (m/s)', true);
  
  var scale = Map.getScale() * 10; //25000
var numPixels = 1e10;

var samples = study_area.rename(['u10', 'v10']).sample({
  region: ROI, 
  scale: scale, 
  numPixels: numPixels, 
  geometries: true
});

var scaleVector = 0.1;

var vectors = samples.map(function(f) {
  var u = ee.Number(f.get('u10')).multiply(scaleVector);
  var v = ee.Number(f.get('v10')).multiply(scaleVector);
  
  var origin = f.geometry();

  // translate
  var proj = origin.projection().translate(u, v);
  var end = ee.Geometry.Point(origin.transform(proj).coordinates());

  // construct line
  var geom = ee.Algorithms.GeometryConstructors.LineString([origin, end], null, true);
  
  return f.setGeometry(geom);
});

//Map.addLayer(uv10final.clip(bbox), windVis, 'Wind Speed (m/s)', true);
Map.addLayer(vectors.style({ color: 'green', width: 0.5 }), {}, 'Wind vectors', true);
Map.addLayer(countries.clip(ROI), {opacity: 0.35}, 'USDOS/LSIB_SIMPLE/2017');

/************************ legend ****************************/
    

// set position of panel

var viz = {
  min: 0.0,
  max: 10.0,
  palette: ['3288bd', '66c2a5', 'abdda4', 'e6f598', 'fee08b', 'fdae61', 'f46d43', 'd53e4f'],
};


var legend = ui.Panel({
style: {
position: 'bottom-left',
padding: '8px 15px'
}
});

// Create legend title
var legendTitle = ui.Label({
value: 'Wind Speed (m/s)',
style: {
fontWeight: 'bold',
fontSize: '18px',
margin: '0 0 4px 0',
padding: '0'
}
});


// Add the title to the panel
legend.add(legendTitle);

// create the legend image
var lon = ee.Image.pixelLonLat().select('latitude');
var gradient = lon.multiply((viz.max-viz.min)/100.0).add(viz.min);
var legendImage = gradient.visualize(viz);

// create text on top of legend
var panel = ui.Panel({
widgets: [
ui.Label(viz['max'])
],
});

legend.add(panel);

// create thumbnail from the image
var thumbnail = ui.Thumbnail({
image: legendImage,
params: {bbox:'0,0,10,100', dimensions:'25x200'},
style: {padding: '1px', position: 'bottom-center'}
});

// add the thumbnail to the legend
legend.add(thumbnail);

// create text on top of legend
var panel = ui.Panel({
widgets: [////////////////////
ui.Label(viz['min'])
],
});

legend.add(panel);
Map.add(legend);

/************************ legend ****************************/
    
  }
});

//panel.add(Max)
panel.widgets().set(7, Min);

////////////////////////////
////////////////////////////

