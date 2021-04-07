
//var atolls = ee.FeatureCollection ('users/zubba1989/atoll_admin_bund');

Map.setOptions('MAP');
Map.setCenter(74, 3, 6);
var panel = ui.Panel({style: {width:'500px', position: 'bottom-left' }});
ui.root.add(panel);
panel.add(ui.Label({value: '||  Atoll Shoreline Explorer ||',
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
panel.add(ui.Label({value: 'Faced with erosion and accretion due to natural and anthropogenic reasons, monitoring of shoreline is critical for the islands of the Maldives. Here we derive the shorelines using the standard NDWI from Sentinel-2. The image series start from mid 2016 to present. To plot the shorelines of an atoll select the atoll. At present, to plot a different time frame for the same atoll, select another atoll and reselect the atoll with the new time frame. Modify the smoothing factor to smoothen shorelines. We recommend a range between 1 - 25, with larger values taking more time to process.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'sans',
    color: '#000000',
    //border : '1px solid black',
    padding: '15px'
    }
}));
panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot the median shoreline contours.',
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
/////////////////////////////////////////////////////////////////////////////////////
var selectStartYear = ui.Textbox({placeholder: 'Start',  value: '2020-06-01',
  style: {width: '100px'}}); 
var selectEndYear = ui.Textbox({placeholder: 'End',  value: '2020-12-31',
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
var selectSmoothing = ui.Textbox({placeholder: 'Start',  value: '25',
  style: {width: '50px'}});
var smooth_label = ui.Label('Smoothing Factor',
  {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
var smooth_panel = ui.Panel([smooth_label, selectSmoothing],
  ui.Panel.Layout.flow('vertical'));
panel.add(smooth_panel)
//////////////////////////////////////////////////////////////////////////////////////
var islandSelect = ui.Select({
  items : [
    
    {label:'Haa Alif Atoll (Thiladhunmathi Uthuruburi)', value : 'Haa_Alif'},
    {label:'Haa Dhaal Atoll (Thiladhunmathi Dhekunuburi)', value : 'Haa_Dhaal'},
    {label:'Shaviyani Atoll (Miladhunmadulu Uthuruburi)', value : 'Shaviyani'},
    {label:'Noonu Atoll (Miladhunmadulu Dhekubunuru)', value : 'Noonu'},
    {label:'Raa Atoll (Maalhosmadulu Uthuruburi)', value : 'Raa'},
    {label:'Baa Atoll (Maalhosmadulu Dhekunuburi)', value : 'Baa'},
    {label:'Lhaviyani Atoll (Faadhippolhu)', value : 'Lhaviyani'},
    {label:'Kaafu Atoll (Maale atholhu)', value : 'Kaafu'},
    {label:'Alif_Dhaal Atoll (Ari atholhu Dhekunuburi)', value : 'Alif_Alif'},
    {label:'Alif_Alif Atoll (Ari atholhu Uthuruburi)', value : 'Ga.Dhiyadhoo'},
    {label:'Vaavu Atoll (Felidhe Atolhu)', value : 'Vaavu'},
    {label:'Meemu Atoll (Mulakatholhu)', value : 'Meemu'},
    {label:'Faafu Atoll (Nilandhe Atholhu Uthuruburi)', value : 'Faafu'},
    {label:'Dhaalu Atoll (Nilandhe Atholhu Dhekunuburi)', value : 'Dhaalu'},
    {label:'Thaa Atoll (Kolhumadulu)', value : 'Thaa'},
    {label:'Laamu Atoll (Hadhunmathi)', value : 'Laamu'},
    {label:'Gaafu_Alif Atoll (Huvadhu Atholhu Uthuruburi)', value : 'Gaafu_Alif'},
    {label:'Gaafu_Dhaalu Atoll (Huvadhu Atholhu Dhekunuburi)', value : 'Gaafu_Dhaalu'},
    {label:'Gnaviyani Atoll (Fuvahmulaku)', value : 'Gnaviyani'},
    {label:'Seenu Atoll (Addu Atholhu)', value : 'Seenu'},
    {label:'BIOT', value : 'chagos'}],
    
onChange : function(value){
    var selected_atoll =  (atolls.filter(ee.Filter.eq("name", value)));
    
    Map.centerObject(selected_atoll);
    
    var startDate_val = selectStartYear.getValue();
    var endDate_val = selectEndYear.getValue();
    var startDate = ee.Date(startDate_val);
    var endDate = ee.Date(endDate_val);
    
    var S1 = ee.ImageCollection('COPERNICUS/S2').filterBounds(selected_atoll).filterDate(startDate,endDate);
    
    var median = S1.median().clip(selected_atoll);
    
    var visualization = {
      min: 0,
      max: 0.3,
      bands: ['B4', 'B3', 'B2'],
      };
  
    Map.addLayer(median, {bands: ['B4', 'B3', 'B2'], max: 5000}, value+' Median: '+startDate_val+' to: '+endDate_val, false);
    
    var ndwi = median.normalizedDifference(['B3','B8']);
    var lines = ee.List.sequence(-0.05, 0.05, 0.002);
    
    var contourlines = lines.map(function(line) {
    
    var radius = selectSmoothing.getValue();
    var radius_n = ee.Number.parse(radius);
    
    var mycontour = ndwi
    .convolve(ee.Kernel.gaussian((radius_n,radius_n)))
    .subtract(ee.Image.constant(line)).zeroCrossing()
    .multiply(ee.Image.constant(line)).toFloat();
 
    return mycontour.mask(mycontour);
  });
 
  contourlines = ee.ImageCollection(contourlines).mosaic();
  Map.addLayer(contourlines, {min: -0.05, max: 0.05, strokeWidth: 5, palette:['#FF0000', '#FF0000']}, value+' Shoreline: '+startDate_val+' to: '+endDate_val);
    
}
});
panel.widgets().insert(6, islandSelect);
islandSelect.setPlaceholder('Select Administrative Atoll Boundary');