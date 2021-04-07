//////////////////////////////////////////////////////////////////////////////////////
//var landsat8Collection = ee.ImageCollection("LANDSAT/LC08/C01/T1_TOA")
Map.setOptions('SATELLITE');
Map.setCenter(74, 3, 6);

//var atolls = ee.FeatureCollection ('users/zubba1989/atoll_admin_bund');
//var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD')

var era5_2mt = ee.ImageCollection('ECMWF/ERA5/DAILY')
// Scale to Kelvin and convert to Celsius, set image acquisition time.
var era5_2mt_c_to_k = era5_2mt.map(function(img) {
  return img
    .subtract(273.15)
    //.subtract(273.15)
    .copyProperties(img, ['system:time_start']);
});

//////////////////////////////////////////////////////////////////////////////////////

var panel = ui.Panel({style: {width:'800px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Atoll Daily Temperature Explorer ||',
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



panel.add(ui.Label({value: 'The islands of the Maldives and the surrounding ocean area, is dependent on the constant temperature which fluctuates very little across the year. Monitoring of Temperature extrema is essential for a varierty of reasons, ranging from monitoring drought as well as oceanic temperatures for bleaching events. This tool is more geared for meterological purposes, another tool is available specifically for oceanic observations. Select the adminstrative Atoll from the drop down menu to get approximate daily mean and temperature extrema across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll, or select a different temporal scale. Daily maximum and the minimum tempearture is derived from the  ERA5 dataset from the ECMWF/Copernicus Climate Change Service, with the temporal scale in Days. To select a new atoll press the reset button.',
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




panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of Precipitation. To reduce processsing time and minimize resources, use a suitable time frame.',
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
var selectEndYear = ui.Textbox({placeholder: 'End',  value: '2019-12-31',
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


var islandSelect = ui.Select({
  items : [
    
    {label:'Haa Alif Atoll (Thiladhunmathi Uthuruburi)', value : 'Haa_Dhaal'},
    {label:'Haa Dhaal Atoll (Thiladhunmathi Dhekunuburi)', value : 'Haa_Dhaal'},
    {label:'Shaviyani Atoll (Miladhunmadulu Uthuruburi)', value : 'Shaviyani'},
    {label:'Noonu Atoll (Miladhunmadulu Dhekubunuru)', value : 'Shaviyani'},
    {label:'Raa Atoll (Maalhosmadulu Uthuruburi)', value : 'Shaviyani'},
    {label:'Baa Atoll (Maalhosmadulu Dhekunuburi)', value : 'Baa'},
    {label:'Lhaviyani Atoll (Faadhippolhu)', value : 'Baa'},
    {label:'Kaafu Atoll (Maale atholhu)', value : 'Kaafu'},
    {label:'Alif_Alif Atoll (Ari atholhu Uthuruburi)', value : 'Alif_Alif'},
    {label:'Alif_Dhaal Atoll (Ari atholhu Dhekunuburi)', value : 'Alif_Alif'},
    {label:'Vaavu Atoll (Felidhe Atolhu)', value : 'Alif_Alif'},
    {label:'Meemu Atoll (Mulakatholhu)', value : 'Meemu'},
    {label:'Faafu Atoll (Nilandhe Atholhu Uthuruburi)', value : 'Meemu'},
    {label:'Dhaalu Atoll (Nilandhe Atholhu Dhekunuburi)', value : 'Dhaalu'},
    {label:'Thaa Atoll (Kolhumadulu)', value : 'Laamu'},
    {label:'Laamu Atoll (Hadhunmathi)', value : 'Laamu'},
    {label:'Gaafu_Alif Atoll (Huvadhu Atholhu Uthuruburi)', value : 'Gaafu_Alif'},
    {label:'Gaafu_Dhaalu Atoll (Huvadhu Atholhu Dhekunuburi)', value : 'Gaafu_Alif'},
    {label:'Gnaviyani Atoll (Fuvahmulaku)', value : 'Gaafu_Alif'},
    {label:'Seenu Atoll (Addu Atholhu)', value : 'Gaafu_Alif'},
    {label:'BIOT', value : 'chagos'}],
    
    onChange : function(value){
    var selected_atoll =  (atolls.filter(ee.Filter.eq("name", value)));
    
    var prec_min = era5_2mt_c_to_k.filterBounds(selected_atoll).filter(ee.Filter.date('1980-01-01', '2019-12-31')).select('minimum_2m_air_temperature');
    var prec_max = era5_2mt_c_to_k.filterBounds(selected_atoll).filter(ee.Filter.date('1980-01-01', '2019-12-31')).select('maximum_2m_air_temperature');
    var prec_mean = era5_2mt_c_to_k.filterBounds(selected_atoll).filter(ee.Filter.date('1980-01-01', '2019-12-31')).select('mean_2m_air_temperature');
    
    Map.centerObject(selected_atoll, 10);
    Map.clear();
    
    //Map.addLayer(selected_atoll, {color: '#FFFF00'},  'planar polygon');
    
    
    /*
    
    var image = ee.Image((landsat8Collection)
    // Filter to get only images under the region of interest.
    .filterBounds(selected_atoll)
    // Filter to get only one year of images.
    .filterDate('2018-01-01', '2018-12-31')
    // Select just the optical bands
    .select(['B[1-7]'])
    // Sort by scene cloudiness, ascending.
    .sort('CLOUD_COVER')
    // Get the first (least cloudy) scene.
    .first());
    
    Map.addLayer(image, {bands: ['B4', 'B3', 'B2'], max: 0.5, gamma: 2}, 'Better L8 Image');
    
    */
    
    var start = selectStartYear.getValue();
    var end = selectEndYear.getValue();
    
    var precip1_min=prec_min.filterDate(start, end);
    var precip1_max=prec_max.filterDate(start, end);
    var precip1_mean=prec_mean.filterDate(start, end);
    
    var TS2 = ui.Chart.image.series(
    precip1_min, selected_atoll,  ee.Reducer.mean(), 1000000, 'system:time_start')
    .setOptions({
          title: 'Minimum daily temperature across '+value+' atoll from '+start+' to '+end,
          hAxis: {title: 'Time'},
          vAxis: {title: 'Temperature (Celcius)'}
    });
    
    var TS3 = ui.Chart.image.series(
    precip1_max, selected_atoll,  ee.Reducer.mean(), 1000000, 'system:time_start')
    .setOptions({
          title: 'Maximum daily temperature across '+value+' atoll from '+start+' to '+end,
          hAxis: {title: 'Time'},
          vAxis: {title: 'Temperature (Celcius)'}
    });
    
    var TS4 = ui.Chart.image.series(
    precip1_mean, selected_atoll,  ee.Reducer.mean(), 1000000, 'system:time_start')
    .setOptions({
          title: 'Mean daily temperature across '+value+' atoll from '+start+' to '+end,
          hAxis: {title: 'Time'},
          vAxis: {title: 'Temperature (Celcius)'}
    });
    
    //print (TS2)
    panel.insert(7,TS4);
    panel.insert(6,TS2);
    panel.insert(8,TS3);
    
    //Map.add(prec)

//////////////////////////////////////////////////////////////////////////////////////    
    
  
    
    panel.add(ui.Button('RESET', function () {
      //Map.clear();
      //ui.root.clear()
      panel.clear()
      //ui.root.insert(0,panel);
      ui.root.widgets().get(1)
      //panel.clear(islandSelect);
      
panel.add(ui.Label({value: '||  Atoll Minimum Temperature Estimator ||',
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


panel.add(ui.Label({value: 'The islands of the Maldives and the surrounding ocean area, is dependent on the constant temperature which fluctuates very little across the year. Monitoring of Temperature extrema is essential for a varierty of reasons, ranging from monitoring drought as well as oceanic temperatures for bleaching events. This tool is more geared for meterological purposes, another tool is available specifically for oceanic observations. Select the adminstrative Atoll from the drop down menu to get approximate daily mean and temperature extrema across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll, or select a different temporal scale. Daily maximum and the minimum tempearture is derived from the  ERA5 dataset from the ECMWF/Copernicus Climate Change Service, with the temporal scale in Days. To select a new atoll press the reset button.',
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



panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of Precipitation. To reduce processsing time and minimize resources, use a suitable time frame.',
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

panel.add(startRange_subtext).add(nextRow);

      
      panel.widgets().insert(5, islandSelect);
      
    }));
    
}});

islandSelect.setPlaceholder('Select Administrative Atoll Boundary');
//print (islandSelect)

//////////////////////////////////////////////////////////////////////////////////////

//panel.insert(5,islandSelect);
panel.widgets().set(5, islandSelect);

panel.add(ui.Label({value: 'To export the chart press the export icon in the top right corner of each chart which will open a popup window, and can be exported as a png or csv file. To clear the charts press the reset button.',
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





