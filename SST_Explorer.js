Map.setOptions('SATELLITE');
Map.setCenter(74, 3, 6);

var atolls = ee.FeatureCollection ('users/zubba1989/atoll_admin_bund');
var sst = ee.ImageCollection('NASA/OCEANDATA/MODIS-Aqua/L3SMI').select('sst');


//////////////////////////////////////////////////////////////////////////////////////

var panel = ui.Panel({style: {width:'800px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Atoll SST Explorer ||',
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


panel.add(ui.Label({value: 'Built on top of coral reefs which are susceptible to fluctuations in temperature, monitoring of Sea Surface Temperature (SST), is crucial for the Maldives. Research suggests small fluctuations above the threshold of ~30.5 C can cause mass bleaching. Select the adminstrative Atoll from the drop down menu to get approximate SST across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll. SST is derived from MODIS-Aqua/L3SMI dataset, with the temporal scale in Months. SST data is presented in two charts, one which shows a temporal SST plot and another which presents the SST for each day of the year, for the selected time frame. To select a new atoll press the reset button.',
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



panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of SST .',
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

var selectStartYear = ui.Textbox({placeholder: 'Start',  value: '2015-01-01',
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
    {label:'Seenu Atoll (Addu Atholhu)', value : 'Seenu'}],
    
onChange : function(value){
    var selected_atoll =  (atolls.filter(ee.Filter.eq("name", value)));
    var sst_monthly = sst.filterBounds(selected_atoll).filter(ee.Filter.date('2002-01-01', '2019-12-31'));
    
    Map.centerObject(selected_atoll, 10);
    Map.clear();
    
    var startDate_val = selectStartYear.getValue();
    var endDate_val = selectEndYear.getValue();

    var startDate = ee.Date(startDate_val);
    var endDate = ee.Date(endDate_val);

    // calculate the number of months to process
    var nMonths = ee.Number(endDate.difference(startDate,'month')).round();
  
    var sst_p1 = sst_monthly.filterDate(startDate, endDate);
    
    var byMonth = ee.ImageCollection(
  // map over each month
  ee.List.sequence(0,nMonths).map(function (n) {
    // calculate the offset from startDate
    var ini = startDate.advance(n,'month');
    // advance just one month
    var end = ini.advance(1,'month');
    // filter and reduce
    return sst_p1.filterDate(ini,end)
                .select(0).mean()
                .set('system:time_start', ini);
}));

// plot full time series
var TS2 = (
  ui.Chart.image.series({
    imageCollection: byMonth,
    region: selected_atoll,
    reducer: ee.Reducer.mean(),
    scale: 1000
  }).setOptions({
    title: 'Time series of monthly SST across '+value+' from '+startDate_val+' to '+endDate_val,
    hAxis:{
      title: 'Month and Year', //titleTextStyle: {italic: false, bold: true}
    },
    vAxis:{
      title: 'Mean Temperature (Celcius)', //titleTextStyle: {italic: false, bold: true}
    },    
    
    
  })
);

panel.insert(6,TS2);

// plot a line for each year in series
var chartDaily = (
  ui.Chart.image.doySeriesByYear({
    imageCollection: byMonth,
    bandName:'sst',
    region: selected_atoll,
    regionReducer: ee.Reducer.mean(),
    scale: 1000
  }).setOptions({
    title: 'SST variance across '+value+' from '+startDate_val+' to '+endDate_val
    
  })
);

panel.insert(7,chartDaily);


  panel.add(ui.Button('RESET', function () {
      //Map.clear();
      //ui.root.clear()
      panel.clear()
      //ui.root.insert(0,panel);
      ui.root.widgets().get(1)
      //panel.clear(islandSelect);
      
      
panel.add(ui.Label({value: '||  Atoll SST Explorer ||',
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
  
  panel.add(ui.Label({value: 'Built on top of coral reefs which are susceptible to fluctuations in temperature, monitoring of Sea Surface Temperature (SST), is crucial for the Maldives. Research suggests small fluctuations above the threshold of ~30.5 C can cause mass bleaching. Select the adminstrative Atoll from the drop down menu to get approximate SST across the atoll over time. The atoll boundaries are presented as approximate adminstrative boundaries and coverage is provided for nearly all of the atolls. Where data is not available, it is suggested to use estimates from the nearest atoll. SST is derived from MODIS-Aqua/L3SMI dataset, with the temporal scale in Months. SST data is presented in two charts, one which shows a temporal SST plot and another which presents the SST for each day of the year, for the selected time frame. To select a new atoll press the reset button.',
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

panel.add(ui.Label({value: 'Select the start and end dates (YYYY-MM-DD) to plot time series of SST .',
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
  

}))
  
}});

islandSelect.setPlaceholder('Select Administrative Atoll Boundary');

//print (islandSelect)

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





