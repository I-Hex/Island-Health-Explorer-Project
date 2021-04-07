Map.setOptions('SATELLITE');
Map.setCenter(74, 3, 6);

// change the path here to wherever you've uploaded the shapefiles
//var atolls = ee.FeatureCollection ('users/helen_situ/Aprox_Atoll_Bund');


//////////////////////////////////////////////////////////////////////////////////////
// UI Basics

var panel = ui.Panel({style: {width:'800px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Atoll Interannual Surface Sea Water Temperature Explorer ||',
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


panel.add(ui.Label({value: 'This app plots the average Sea Surface Temperature for the selected year range, region and month to compare average SST \nduring the same month across different years. \
The second plot generated is an anomaly analysis. The chart shows the number \nof instances per year in the dataset where the average SST across the region is above the coral bleaching threshold. \
\nThe bleaching threshold is defined as 1 degree Celsius above the Maximum Monthly Mean (MMM), the monthly mean for \nthe warmest month (April in this case) calculated across the entire dataset. \r\n\r\n\
There are 3 SST datasets available in this app: \r \n\
    The NOAA Climate Data Record (CDR) Program applies modern data analysis methods to historical satellite data. \r \n\
    The Hybrid Coordinate Ocean Model (HYCOM) dataset is an assimilated dataset combining observational and modeled/forecasted data. \r \n\
    The NASA Ocean Color dataset contains SST values obtained from MODIS satellite imagery. \r \n \r \n\
Please allow 1 minute for the climatology plot to load and 5-10 minutes for the anomaly analysis. \
\nIt is important to note that the temporal and spatial resolutions of the datasets differ. For the anomaly analysis, it is highly \nrecommended that the NOAA CDR dataset is selected. \
This is because the NOAA CDR dataset has regular daily data, while \nthe NASA Ocean Color and HYCOM datasets may have more irregular data. Due to the higher horizontal spatial resolutions \nof the NASA Ocean Color and HYCOM datasets, the computation will also take significantly longer and may time out.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'sans',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px',
    whiteSpace: 'pre'
    }
}));


panel.add(ui.Label({value: 'First, select the desired dataset.',
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

///////////// SELECT DATASET //////////////

var selectData = ui.Select({
  items : [
    {label:'NOAA CDR', value : 2},
    {label:'HYCOM', value : 0},
    {label:'NASA Ocean Color', value : 1}
    ],
  onChange : function(value){
    var dset_list = ee.List([ee.ImageCollection('HYCOM/sea_temp_salinity').select('water_temp_0'), 
                             ee.ImageCollection('NASA/OCEANDATA/MODIS-Aqua/L3SMI').select('sst'),
                             ee.ImageCollection('NOAA/CDR/OISST/V2_1').select('sst')]);
    var dataset = ee.ImageCollection(dset_list.get(value));
    var allDates = ee.List(dataset.aggregate_array('system:time_start'));
    var allDatesSimple = allDates.map(function(date){
      return ee.Algorithms.String(ee.Date(date).get('year'));
      }).distinct().slice(1,-1);
    
    var chartunit_list = ee.List(['Temperature (°C) at 0.001 scale and -20°C offset',
                                   'Temperature (°C)',
                                   'Temperature (°C) at 0.01 scale']);
    var chartunit = ee.String(chartunit_list.get(value));

///////////// DROPDOWN SELECTION OF MONTH AND YEARS /////////////

var selectStartYear = ui.Select({
  items: allDatesSimple.getInfo(),
  style: {width: '100px'}
});
var selectEndYear = ui.Select({
  items: allDatesSimple.getInfo(),
  style: {width: '100px'}
});
var selectMonth = ui.Select({
  items : [
    {label:'January', value : 1},
    {label:'February', value : 2},
    {label:'March', value : 3},
    {label:'April', value : 4},
    {label:'May', value : 5},
    {label:'June', value : 6},
    {label:'July', value : 7},
    {label:'August', value : 8},
    {label:'September', value : 9},
    {label:'October', value : 10},
    {label:'November', value : 11},
    {label:'December', value : 12}],
  style: {width: '100px'}
});

var start_label = ui.Label('Start Year',
  {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
var end_label = ui.Label('End Year',
  {margin: '0 0 0 70px',fontSize: '12px',color: 'gray'});
var month_label = ui.Label('Select Month',
  {margin: '0 0 0 70px',fontSize: '12px',color: 'gray'});

var yearselect_subtext = ui.Panel([start_label, end_label, month_label],
  ui.Panel.Layout.flow('horizontal'));
var yearselect_nextRow = ui.Panel([selectStartYear, selectEndYear, selectMonth],
  ui.Panel.Layout.flow('horizontal'));
panel.add(yearselect_subtext).add(yearselect_nextRow);


//////////////////////////////////////////////////////////////////////////////////////
// After an atoll is selected, the calculations begin

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
    {label:'Alif_Alif Atoll (Ari atholhu Uthuruburi)', value : 'Ga.Dhiyadhoo'},
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
    //var oceantemp = seaWaterTemperature.filterBounds(selected_atoll);//.filter(ee.Filter.date('1992-10-02', '2019-12-31'));
    var oceantemp = dataset.filterBounds(selected_atoll);    


    Map.centerObject(selected_atoll, 10);
    Map.clear();

    ////////////// CALCULATE MONTHLY MEANS FOR SELECTED YEARS /////////////

    var start = ee.Date(selectStartYear.getValue() + '-01-01');
    var end = ee.Date(selectEndYear.getValue() + '-12-31');
    var nYears = ee.Number(end.difference(start,'year')).round();

    var c_scale = ee.List([9250, 500, 27750]).get(selectData.getValue());
    var c_dname = ee.List(['water_temp_0', 'sst', 'sst']).get(selectData.getValue());
    var c_add = ee.List([1000, 1, 100]).get(selectData.getValue());

    // Average each image over atoll region
    // for calculating maximum monthly mean
    var atollMean = oceantemp.map(function(image) {
      var dic = image.reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: selected_atoll,
        scale: c_scale
      });
      return image.setMulti(dic);
    });

    var avg_byMonth = ee.ImageCollection.fromImages(
      ee.List.sequence(0, nYears.subtract(1)).map(function (m) {
        var y_start = start.advance(m, 'year');
        var y_end = y_start.advance(1, 'year').advance(-1, 'day');
        var oceantemp1year=oceantemp.filterDate(y_start, y_end);
        return oceantemp1year.filter(ee.Filter.calendarRange(selectMonth.getValue(), selectMonth.getValue(), 'month'))
                    .select(0).mean()
                    .set('year', (ee.Number.parse(selectStartYear.getValue()).add(m)));
      }));
    //print(avg_byMonth);
    
    var dic = avg_byMonth.select(0).mean().reduceRegion({
        reducer: ee.Reducer.mean(),
        geometry: selected_atoll,
        scale: c_scale
    });

    var anomalies = ee.List.sequence(0, nYears.subtract(1)).map(function (m) {
      var y_start = start.advance(m, 'year');
      var y_end = y_start.advance(1, 'year').advance(-1, 'day');
      var filt = ee.Filter.gt(c_dname, ee.Number.parse(dic.get(c_dname)).add(c_add));
      var mean1year=atollMean.filterDate(y_start, y_end).filter(filt);
      return mean1year.size();
    });

    
    
    // Generate chart
    var TS2 = ui.Chart.image.series(
    avg_byMonth, selected_atoll,  ee.Reducer.mean(), 10000, 'year')
    .setOptions({
          title: selectStartYear.getValue()+' to '+selectEndYear.getValue()+' month '+selectMonth.getValue()+' average SST across '+value+' atoll',
          hAxis: {title: 'Year'},
          vAxis: {title: chartunit.getInfo()},//'Temperature (°C) at 0.001 scale'},
          colors: ['e37d05', '1d6b99']
    });
    
    var anomChart = ui.Chart.array.values({array: anomalies, axis: 0, xLabels: avg_byMonth.aggregate_array('year')})
      .setOptions({
        title: 'Number of values above bleaching threshold by year',
        colors: ['cf513e'],
        lineWidth: 1,
        hAxis: {title: 'Year'},
        vAxis: {title: '# Values'}
      });

    var bleachTemp = ee.Number.parse(dic.get(c_dname)).add(c_add).divide(100);

    panel.insert(9,TS2);
    panel.insert(10, ui.Label({value: 'Bleaching Threshold in °C: ' + bleachTemp.getInfo().toString(),
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
    panel.insert(11,anomChart);


//////////////////////////////////////////////////////////////////////////////////////    
  

    ////////////////////////////////////////////////////////////
    }});

islandSelect.setPlaceholder('Select Administrative Atoll Boundary');
//print (islandSelect)

//////////////////////////////////////////////////////////////////////////////////////

//panel.insert(5,islandSelect);
panel.widgets().set(7, islandSelect);

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


//////////////////////////////////////////////////////////////////////
//////////////////////// RESET BUTTON //////////////////////////

panel.add(ui.Button('RESET', function () {
  panel.clear();
  ui.root.widgets().get(1);
  
panel.add(ui.Label({value: '||  Atoll Interannual Surface Sea Water Temperature Explorer ||',
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


panel.add(ui.Label({value: 'This app plots the average Sea Surface Temperature for the selected year range, region and month to compare average SST \nduring the same month across different years. \
The second plot generated is an anomaly analysis. The chart shows the number \nof instances per year in the dataset where the average SST across the region is above the coral bleaching threshold. \
\nThe bleaching threshold is defined as 1 degree Celsius above the Maximum Monthly Mean (MMM), the monthly mean for \nthe warmest month (April in this case) calculated across the entire dataset. \r\n\r\n\
There are 3 SST datasets available in this app: \r \n\
    The NOAA Climate Data Record (CDR) Program applies modern data analysis methods to historical satellite data. \r \n\
    The Hybrid Coordinate Ocean Model (HYCOM) dataset is an assimilated dataset combining observational and modeled/forecasted data. \r \n\
    The NASA Ocean Color dataset contains SST values obtained from MODIS satellite imagery. \r \n \r \n\
Please allow 1 minute for the climatology plot to load and 5-10 minutes for the anomaly analysis. \
\nIt is important to note that the temporal and spatial resolutions of the datasets differ. For the anomaly analysis, it is highly \nrecommended that the NOAA CDR dataset is selected. \
This is because the NOAA CDR dataset has regular daily data, while \nthe NASA Ocean Color and HYCOM datasets may have more irregular data. Due to the higher horizontal spatial resolutions \nof the NASA Ocean Color and HYCOM datasets, the computation will also take significantly longer and may time out.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'sans',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px',
    whiteSpace: 'pre'
    }
}));


panel.add(ui.Label({value: 'First, select the desired dataset.',
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

  
}));

},
  style: {width: '100px'}
});


var dataset_label = ui.Label('Select Dataset',
  {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});

var startRange_subtext = ui.Panel(dataset_label, 
  ui.Panel.Layout.flow('horizontal'));
var nextRow = ui.Panel(selectData,
  ui.Panel.Layout.flow('horizontal'));

panel.add(startRange_subtext).add(nextRow);


