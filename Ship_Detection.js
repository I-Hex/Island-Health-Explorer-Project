



//////////////////////////////////////////////////////////////////////////////////////

Map.setOptions('SATELLITE');
Map.setCenter(74, 3, 6);

//////////////////////////////////////////////////////////////////////////////////////

var panel = ui.Panel({style: {width:'800px', position: 'bottom-left' }});
ui.root.add(panel);

panel.add(ui.Label({value: '||  Global Fishing Watch Ship Tracks Explorer ||',
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


panel.add(ui.Label({value: 'This app plots the ship tracks provided by the Global Fishing Watch (GFW). At the moment, data is only available from 2012 through 2016. \
                            There 2 options available for viewing on the map: \
                            Select Fishing to view tracks of fishing vessels only, and select Vessels to view tracks from all vessels available in the dataset.',
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


//////// DROPDOWN SELECTION OF YEAR EXCLUDING FIRST AND LAST ////////

var selectData = ui.Select({
  items : [
    {label:'Fishing', value : 0},
    {label:'Vessels', value : 1},],
  onChange : function(value){
    Map.clear();
    var dset_list = ee.List([ee.ImageCollection('GFW/GFF/V1/fishing_hours'),//.select('water_temp_0'), 
                             ee.ImageCollection('GFW/GFF/V1/vessel_hours')])//.select('sst'),
                             //ee.ImageCollection('NOAA/CDR/OISST/V2_1').select('sst')])
    var dataset = ee.ImageCollection(dset_list.get(value));
    var allDates = ee.List(dataset.aggregate_array('system:time_start'));
    var allDatesSimple = allDates.map(function(date){
      return ee.Algorithms.String(ee.Date(date).get('year'));
      }).distinct();//.slice(0,-1);
    
    //var chartunit_list = ee.List(['Temperature (°C) at 0.001 scale',
      //                             'Temperature (°C)',
        //                           'Temperature (°C) at 0.01 scale']);
    //var chartunit = ee.String(chartunit_list.get(value));
    var selectStartYear = ui.Textbox({placeholder: 'Start',  value: '2016-12-01',
      style: {width: '100px'}});
    var selectEndYear = ui.Textbox({placeholder: 'End',  value: '2017-01-01',
      style: {width: '100px'}});
      //style: {width: '100px'}}); 
    //var selectYear = ui.Select({
    //items: allDatesSimple.getInfo(),
    //style: {width: '100px'}
    
    //});
    //var year_label = ui.Label('Select Year',
      //{margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
    var start_label = ui.Label('Start Date',
      {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
    var end_label = ui.Label('End Date',
      {margin: '0 0 0 70px',fontSize: '12px',color: 'gray'});

    var year_subtext = ui.Panel([start_label, end_label], 
      ui.Panel.Layout.flow('horizontal'));
    var nextRow1 = ui.Panel([selectStartYear, selectEndYear],
      ui.Panel.Layout.flow('horizontal'));
    
    var yearinstr = ui.Label({value: 'Next, input the desired date range for the data (available from 2012-01-01 to 2017-01-01). Format: yyyy-mm-dd',
      style: {
        fontWeight: 'normal',
        fontSize: '15px',
        margin: '0 0 4px 0',
        fontFamily: 'sans',
        color: '#000000',
        //border : '1px solid black',
        padding: '10px'
        }
    });
    panel.widgets().set(5, yearinstr).set(6, year_subtext).set(7, nextRow1);
    var show = ui.Button('SHOW', function() {
    //onChange : function(value){
      Map.clear();
      var start = selectStartYear.getValue();
      var end = selectEndYear.getValue();
      var img = dataset.filterMetadata("country","equals","WLD")
        .filterDate(start, end)
        .sum();

      var fishing = img.expression(
      '(trawlers+drifting_longlines+purse_seines+squid_jigger+other_fishing+fixed_gear)',
      {trawlers: img.select("trawlers"),
      drifting_longlines: img.select("drifting_longlines"),
      purse_seines: img.select('purse_seines'),
      squid_jigger: img.select('squid_jigger'),
      other_fishing: img.select('other_fishing'),
      fixed_gear: img.select('fixed_gear')
      });
      
      var effort = fishing.mask(fishing.gt(0))
    // .visualize({palette: '440154FF,481567FF,482677FF,453781FF,404788FF,39568CFF,33638DFF,2D708EFF,287D8EFF,238A8DFF,1F968BFF,20A387FF,29AF7FFF,3CBB75FF,55C667FF,73D055FF,95D840FF,B8DE29FF,DCE319FF,FDE725FF'});
      .visualize({palette: '404788FF,39568CFF,33638DFF,2D708EFF,287D8EFF,238A8DFF,1F968BFF,20A387FF,29AF7FFF,3CBB75FF,55C667FF,73D055FF,95D840FF,B8DE29FF,DCE319FF,FDE725FF'});
      Map.addLayer(effort);
    });
    panel.widgets().set(8, show);
  }, //onchange
  style: {width: '100px'}
}); //selectdata

//var year_label = ui.Label('Select Year',
  //{margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});
var dataset_label = ui.Label('Select Dataset',
  {margin: '0 0 0 10px',fontSize: '12px',color: 'gray'});

var startRange_subtext = ui.Panel(dataset_label, 
  ui.Panel.Layout.flow('horizontal'));
var nextRow = ui.Panel(selectData,
  ui.Panel.Layout.flow('horizontal'));

panel.add(startRange_subtext).add(nextRow);

panel.add(ui.Label({value: '',
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

panel.add(ui.Label({value: '',
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

panel.add(ui.Label({value: '',
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

panel.add(ui.Label({value: '',
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