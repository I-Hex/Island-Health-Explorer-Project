var atolls = ee.FeatureCollection("users/I-Hex/Aprox_Atoll_Bund");

//////////////////////////////////////////////////////////////////////////////////////

Map.setOptions('SATELLITE');
Map.setCenter(74, 3, 6);

//var atolls = ee.FeatureCollection ('users/zubba1989/atoll_admin_bund');
//var chirps = ee.ImageCollection('UCSB-CHG/CHIRPS/PENTAD')

var era5_2mt = ee.ImageCollection('ECMWF/ERA5/DAILY')
// Scale to Kelvin and convert to Celsius, set image acquisition time.
var era5_2mt_c_to_k = era5_2mt.map(function(img) {
  return img
    .divide(1000.0)
    //.subtract(273.15)
    .copyProperties(img, ['system:time_start']);
});

//////////////////////////////////////////////////////////////////////////////////////

var panel = ui.Panel({style: {width:'800px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Atoll Surface Pressure / MSLP Explorer ||',
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


panel.add(ui.Label({value: 'Changes to atmospheric pressure is a major driveer of the weather, understanding atmospheric pressure variation is essential to explore weather patterns. Select the adminstrative Atoll from the drop down menu to get approximate precipitation across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll. Precipitation is derived from the  ERA5 dataset from the ECMWF/Copernicus Climate Change Service, with the temporal scale in Days. Precipitation data is presented in two charts, one which shows a temporal rainfall plot across a user set time scale and another which presents the monthly mean rainfall rate from 2000 to date for the region. To select a new atoll press the reset button.',
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



panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of Precipitation. To reduce processing time and minimize resource usage it is suggested to use a suitable temporal scale.',
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
    
    {label:'Haa Alif Atoll (Thiladhunmathi Uthuruburi)', value : 'Haa_Alif'},
    {label:'Haa Dhaal Atoll (Thiladhunmathi Dhekunuburi)', value : 'Haa_Dhaal'},
    {label:'Shaviyani Atoll (Miladhunmadulu Uthuruburi)', value : 'Shaviyani'},
    {label:'Noonu Atoll (Miladhunmadulu Dhekubunuru)', value : 'Noonu'},
    {label:'Raa Atoll (Maalhosmadulu Uthuruburi)', value : 'Raa'},
    {label:'Baa Atoll (Maalhosmadulu Dhekunuburi)', value : 'Baa'},
    {label:'Lhaviyani Atoll (Faadhippolhu)', value : 'Lhaviyani'},
    {label:'Kaafu Atoll (Maale atholhu)', value : 'Kaafu'},
    {label:'Alif_Alif Atoll (Ari atholhu Uthuruburi)', value : 'Alif_Alif'},
    {label:'Alif_Dhaal Atoll (Ari atholhu Dhekunuburi)', value : 'Alif_Alif'},
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
    var sur_pres = era5_2mt_c_to_k.filterBounds(selected_atoll).filter(ee.Filter.date('1980-01-01', '2019-12-31')).select('surface_pressure');
    
    var mean_slp = era5_2mt_c_to_k.filterBounds(selected_atoll).filter(ee.Filter.date('1980-01-01', '2019-12-31')).select('mean_sea_level_pressure');
    
    Map.centerObject(selected_atoll, 10);
    Map.clear();
    
    
    
    var start = selectStartYear.getValue();
    var end = selectEndYear.getValue();
    
    
    
    var sur_pres1year=sur_pres.filterDate(start, end);
    var mean_slp1year=mean_slp.filterDate(start, end);
    
    var TS2 = ui.Chart.image.series(
    sur_pres1year, selected_atoll,  ee.Reducer.mean(), 10000, 'system:time_start')
    .setOptions({
          title: 'Daily surface_pressure across '+value+' atoll from '+start+' to '+end,
          hAxis: {title: 'Time'},
          vAxis: {title: 'Surface Pressure (kPa)'}
    });

    var TS3 = ui.Chart.image.series(
    mean_slp1year, selected_atoll,  ee.Reducer.mean(), 10000, 'system:time_start')
    .setOptions({
          title: 'Daily mean_sea_level_pressure across '+value+' atoll from '+start+' to '+end,
          hAxis: {title: 'Time'},
          vAxis: {title: 'Mean SLP (kPa)'}
    });    
    
    
    
    //print (TS2)
    panel.insert(6,TS2);
    panel.insert(7,TS3);
    
    //Map.add(prec)
    
    

//////////////////////////////////////////////////////////////////////////////////////    
  

    ////////////////////////////////////////////////////////////
    
    panel.add(ui.Button('RESET', function () {
      //Map.clear();
      //ui.root.clear()
      panel.clear()
      //ui.root.insert(0,panel);
      ui.root.widgets().get(1)
      //panel.clear(islandSelect);
      
panel.add(ui.Label({value: '||  Atoll Surface Pressure / MSLP Explorer ||',
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

panel.add(ui.Label({value: 'Changes to atmospheric pressure is a major driveer of the weather, understanding atmospheric pressure variation is essential to explore weather patterns. Select the adminstrative Atoll from the drop down menu to get approximate precipitation across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll. Precipitation is derived from the  ERA5 dataset from the ECMWF/Copernicus Climate Change Service, with the temporal scale in Days. Precipitation data is presented in two charts, one which shows a temporal rainfall plot across a user set time scale and another which presents the monthly mean rainfall rate from 2000 to date for the region. To select a new atoll press the reset button.',
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


panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of Precipitation. To reduce processing time and minimize resource usage it is suggested to use a suitable temporal scale.',
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





