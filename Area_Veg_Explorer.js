

//var islands = ee.FeatureCollection ('users/zubba1989/islands_mv');

var panel = ui.Panel({style: {width: '500px', position: 'bottom-right'}});
panel.add(ui.Label({value: 'Island Vegetation and Area Calculator.',
  style: {
    fontWeight: 'bold',
    fontFamily: 'times',
    fontSize: '25px',
    margin: '0 0 4px 0',
    textAlign: 'left',
    color: '#b31b1b',
    padding: '10px'
    }
}));

panel.add(ui.Label({value: 'Select region in the form of Atoll.Island from the drop down menu to plot the island area over time and the area of vegetaion over time for the island. A second graph shows the percentage of vegetation across the island for the duration.  Currently only the inhabited islands of the Maldives within coverage of Sentinel-2 imagery are listed.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'times',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px'
    }
}));


var islandSelect = ui.Select({
  items : [
    
    {label:'S.Hithadhu,Maradhu,Feydhu,Gan', value : 'S.Hithadhu,Maradhu,Feydhu,Gan'},
    {label:'S.Meedhu,Hulhudhu', value : 'S.Meedhu,Hulhudhu'},
    {label:'Gn.Fuvahmulah', value : 'Fuvahmulah'},
    {label:'Ga.Villingilli', value : 'Ga.Villingilli'},
    //{label:'Ga.Kooddoo', value : 'Ga.Kooddoo'},
    {label:'Ga.Maamendhu', value : 'Ga.Maamendhu'},
    {label:'Ga.Nilandhu', value : 'Ga.Nilandhu'},
    {label:'Ga.Dhaandhu', value : 'Ga.Dhaandhu'},
    {label:'Ga.Kondey', value : 'Ga.Kondey'},
    {label:'Ga.Dhiyadhoo', value : 'Ga.Dhiyadhoo'},
    {label:'Ga.Gemanafushi', value : 'Ga.Gemanafushi'},
    {label:'GDh.Gahdhoo', value : 'GDh.Gahdhoo'},
    {label:'GDh.Vaadhoo', value : 'GDh.Vaadhoo'},
    {label:'Gdh.FaresMaathoda', value : 'Gdh.FaresMaathoda'},
    {label:'GDh.Fiyori', value : 'GDh.Fiyori'},
    {label:'GDh.Rathafandhoo', value : 'GDh.Rathafandhoo'},
    {label:'GDh.Nadella', value : 'GDh.Nadella'},
    {label:'Gdh.Hoadedhoo', value : 'Gdh.Hoadedhoo'},
    {label:'GDh.Madaveli', value : 'GDh.Madaveli'},
    {label:'GDh.Kaadedhoo', value : 'GDh.Kaadedhoo'},
    {label:'GDh.Thinadhoo', value : 'GDh.Thinadhoo'},
    {label:'GA.Kolamaafushi', value : 'GA.Kolamaafushi'},
    {label: 'L.Gan,Kahdhoo,Funadho', value : 'L.Gan,Kahdhoo,Funadho'},
    {label:'L.Hithadhoo', value : 'L.Hithadhoo'},
    {label:'L.Kunahandhoo', value : 'L.Kunahandhoo'},
    {label:'L.Maamendhoo', value : 'L.Maamendhoo'},
    {label:'L.Kalhaidhoo', value : 'L.Kalhaidhoo'},
    {label:'L.Mundoo', value : 'L.Mundoo'},
    {label:'L.Maabaidhoo', value : 'L.Maabaidhoo'},
    {label:'L.Isdhoo', value : 'L.Isdhoo'},
    {label:'L.Dhanbidhoo', value : 'L.Dhanbidhoo'},
    {label:'L.Maavah', value : 'L.Maavah'},
    {label:'Th.Omadhoo', value : 'Th.Omadhoo'},
    {label:'Th.Kinbidhoo', value : 'Th.Kinbidhoo'},
    {label:'Th.Veymandoo', value : 'Th.Veymandoo'},
    {label:'Th.Thimrafushi', value : 'Th.Thimrafushi'},
    {label:'Th.Gaadhiffushi', value : 'Th.Gaadhiffushi'},
    {label:'Th.Dhiyamigili', value : 'Th.Dhiyamigili'},
    {label:'Th.Madifushi', value : 'Th.Madifushi'},
    {label:'Th.Vilufushi', value : 'Th.Vilufushi'},
    {label:'Th.Buruni', value : 'Th.Buruni'},
    {label:'Th.Kandoodhoo', value : 'Th.Kandoodhoo'},
    {label:'Th.Vandhoo', value : 'Th.Vandhoo'},
    {label:'Th.Hirilandhoo', value : 'Th.Hirilandhoo'},
    {label:'Dh.Kudahuvadhoo', value : 'Dh.Kudahuvadhoo'},
    {label:'Dh.Maaemboodhoo', value : 'Dh.Maaemboodhoo'},
    {label:'Dh.Hulhudheli', value : 'Dh.Hulhudheli'},
    {label:'Dh.Meedhoo', value : 'Dh.Meedhoo'},
    {label:'Dh.Bandhidhoo', value : 'Dh.Bandhidhoo'},
    {label:'Dh.Rinbidhoo', value : 'Dh.Rinbidhoo'},
    {label:'F.Nilandhoo', value : 'F.Nilandhoo'},
    {label:'F.Dharanboodhoo', value : 'F.Dharanboodhoo'},
    {label:'F.Magoodhoo', value : 'F.Magoodhoo'},
    {label:'F.Bileydhoo', value : 'F.Bileydhoo'},
    {label:'F.Feeali', value : 'F.Feeali'},
    {label:'M.Kolhufushi', value : 'M.Kolhufushi'},
    {label:'M.Muli', value : 'M.Muli'},
    {label:'M.Naalaafushi', value : 'M.Naalaafushi'},
    {label:'M.Mulah', value : 'M.Mulah'},
    {label:'M.Veyvah', value : 'M.Veyvah'},
    {label:'M.Raimendhoo', value : 'M.Raimendhoo'},
    {label:'M.Dhiggaru', value : 'M.Dhiggaru'},
    {label:'M.Naalaafushi', value : 'M.Naalaafushi'},
    {label:'ADh.Fenfushi', value : 'ADh.Fenfushi'},
    {label:'ADh.Maamigili', value : 'ADh.Maamigili'},
    {label:'ADh.Dhigurah', value : 'ADh.Dhigurah'},
    {label:'ADh.Mahibadhoo', value : 'ADh.Mahibadhoo'},
    {label:'ADh.Kumburudhoo', value : 'ADh.Kumburudhoo'},
    {label:'ADh.Omadhoo', value : 'ADh.Omadhoo'},
    {label:'ADh.Hangnaameedhoo', value : 'ADh.Hangnaameedhoo'},
    {label:'Aa.Ulkulhas', value : 'Aa.Ulkulhas'},
    {label:'Aa.Mathiveri', value : 'Aa.Mathiveri'},
    {label:'Aa.Bodufulhadhoo', value : 'Aa.Bodufulhadhoo'},
    {label:'Aa.Feridhoo', value : 'Aa.Feridhoo'},
    {label:'Aa.Maalhos', value : 'Aa.Maalhos'},
    {label:'Aa.Himandhoo', value : 'Aa.Himandhoo'},
    {label:'ADh.Mandhoo', value : 'ADh.Mandhoo'},
    {label:'Aa.Rasdhoo', value : 'Aa.Rasdhoo'},
    {label:'Aa.Rasdhoo', value : 'Aa.Rasdhoo'},
    {label:'K.Guraidhoo', value : 'K.Guraidhoo'},
    {label:'K.Maafushi', value : 'K.Maafushi'},
    {label:'K.Gulhi', value : 'K.Gulhi'},
    {label:'K.Male', value : 'K.Male'},
    {label:'K.Hulhumale', value : 'K.Hulhumale'},
    {label:'K.Villingilli', value : 'K.Villingilli'},
    {label:'K.Gulhifalhi', value : 'K.Gulhifalhi'},
    {label:'K.Thulusdhoo', value : 'K.Thulusdhoo'},
    {label:'K.Himmafushi', value : 'K.Himmafushi'},
    {label:'K.Huraa', value : 'K.Huraa'},
    {label:'K.Thulusdhoo', value : 'K.Thulusdhoo'},
    {label:'K.Dhiffushi', value : 'K.Dhiffushi'},
    {label:'K.Gaafaru', value : 'K.Gaafaru'},
    {label:'K.Kaashidhoo', value : 'K.Kaashidhoo'},
    {label:'B.Goidhoo', value : 'B.Goidhoo'},
    {label:'B.Fhendhoo', value : 'B.Fhendhoo'},
    {label:'B.Fulhadhoo', value : 'B.Fulhadhoo'},
    {label:'B.Thulhaadhoo', value : 'B.Thulhaadhoo'},
    {label:'B.Hithaadhoo', value : 'B.Hithaadhoo'},
    {label:'B.Eydhafushi', value : 'B.Eydhafushi'},
    {label:'B.Maalhos', value : 'B.Maalhos'},
    {label:'B.Dharavandhoo', value : 'B.Dharavandhoo'},
    {label:'B.Dhonfanu', value : 'B.Dhonfanu'},
    {label:'B.Kihaadhoo', value : 'B.Kihaadhoo'},
    {label:'B.Kamadhoo', value : 'B.Kamadhoo'},
    {label:'B.Kudarikilu', value : 'B.Kudarikilu'},
    {label:'B.Kendhoo', value : 'B.Kendhoo'},
    {label:'R.Kinolhas', value : 'R.Kinolhas'},
    {label:'R.Fainu', value : 'R.Fainu'},
    {label:'R.Inguraidhoo', value : 'R.Inguraidhoo'},
    {label:'R.Meedhoo', value : 'R.Meedhoo'},
    {label:'R.Maduvvari', value : 'R.Maduvvari'},
    {label:'R.Innamaadhoo', value : 'R.Innamaadhoo'},
    {label:'R.Rasmaadhoo', value : 'R.Rasmaadhoo'},
    {label:'R.Maakurathu', value : 'R.Maakurathu'},
    {label:'R.Dhuvaafaru', value : 'R.Dhuvaafaru'},
    {label:'R.Ungoofaaru', value : 'R.Ungoofaaru'},
    {label:'R.Ifuru', value : 'R.Ifuru'},
    {label:'R.Hulhudhuffaaru', value : 'R.Hulhudhuffaaru'},
    {label:'R.Angolhitheemu', value : 'R.Angolhitheemu'},
    {label:'R.Rasgetheemu', value : 'R.Rasgetheemu'},
    {label:'R.Vaadhoo', value : 'R.Vaadhoo'},
    {label:'R.Alifushi', value : 'R.Alifushi'},
    {label:'R.Olhuvelifushi', value : 'R.Olhuvelifushi'},
    {label:'Lh.Kurendhoo', value : 'Lh.Kurendhoo'},
    {label:'Lh.Madivaru', value : 'Lh.Madivaru'},
    {label:'Lh.Naifaru', value : 'Lh.Naifaru'},
    {label:'Lh.Hinnavaru', value : 'Lh.Hinnavaru'},
    {label:'N.Velidhoo', value : 'N.Velidhoo'},
    {label:'N.Fohdhoo', value : 'N.Fohdhoo'},
    {label:'N.Holhudhoo', value : 'N.Holhudhoo'},
    {label:'N.Manadhoo', value : 'N.Manadhoo'},
    {label:'N.Magoodhoo', value : 'N.Magoodhoo'},
    {label:'N.Miladhoo', value : 'N.Miladhoo'},
    {label:'N.Lhohi', value : 'N.Lhohi'},
    {label:'N.Maafaru', value : 'N.Maafaru'},
    {label:'N.Landhoo', value : 'N.Landhoo'},
    {label:'N.Maalhendhoo', value : 'N.Maalhendhoo'},
    {label:'N.Kudafari', value : 'N.Kudafari'},
    {label:'N.Kendhikulhudhoo', value : 'N.Knedhikulhudhoo'},
    {label:'N.Henbadho', value : 'N.Henbadho'},
    {label:'Sh.Maaungoodhoo', value : 'Sh.Maaungoodhoo'},
    {label:'Sh.Funadhoo', value : 'Sh.Funadhoo'},
    {label:'Sh.Komandoo', value : 'Sh.Komandoo'},
    {label:'Sh.Lhaimagu', value : 'Sh.Lhaimagu'},
    {label:'Sh.Maroshi', value : 'Sh.Maroshi'},
    {label:'Sh.Narudhoo', value : 'Sh.Narudhoo'},
    {label:'Sh.Milandhoo', value : 'Sh.Milandhoo'},
    {label:'Sh.Feevah', value : 'Sh.Feevah'},
    {label:'Sh.Foakaidhoo', value : 'Sh.Foakaidhoo'},
    {label:'Sh.Bileifahi', value : 'Sh.Bileifahi'},
    {label:'Sh.Feydhoo', value : 'Sh.Feydhoo'},
    {label:'Sh.Noomaraa', value : 'Sh.Noomaraa'},
    {label:'Sh.Goihdoo', value : 'Sh.Goihdoo'},
    {label:'Sh.Kanditheemu', value : 'Sh.Kanditheemu'},
    {label:'Sh.Makunudhoo', value : 'Sh.Makunudhoo'},
    {label:'HDh.Vaikaradhoo', value : 'HDh.Vaikaradhoo'},
    {label:'HDh.Neykurendhoo', value : 'HDh.Neykurendhoo'},
    {label:'HDh.Kumundhoo', value : 'HDh.Kumundhoo'},
    {label:'HDh.Kulhuduffushi', value : 'HDh.Kulhuduffushi'},
    {label:'HDh.Nolhivaran', value : 'HDh.Nolhivaran'},
    {label:'HDh.Kurinbi', value : 'HDh.Kurinbi'},
    {label:'HDh.Nolhivaranfaru', value : 'HDh.Nolhivaranfaru'},
    {label:'HDh.Nellaidhoo', value : 'HDh.Nellaidhoo'},
    {label:'HDh.Naavaidhoo', value : 'HDh.Naavaidhoo'},
    {label:'HDh.Hirimaradhoo', value : 'HDh.Hirimaradhoo'},
    {label:'HDh.Hanimaadhoo', value : 'HDh.Hanimaadhoo'},
    {label:'Ha.Maarandhoo', value : 'Ha.Maarandhoo'},
    {label:'Ha.Thakandhoo', value : 'Ha.Thakandhoo'},
    {label:'Ha.Utheemu', value : 'Ha.Utheemu'},
    {label:'Ha.Muraidhoo', value : 'Ha.Muraidhoo'},
    {label:'Ha.Baarah', value : 'Ha.Baarah'},
    {label:'Ha.Dhidhoo', value : 'Ha.Dhidhoo'},
    {label:'Ha.Vashafaru', value : 'Ha.Vashafaru'},
    {label:'Ha.Kelaa', value : 'Ha.Kelaa'},
    {label:'Ha.Filladhoo', value : 'Ha.Filladhoo'}],
    //{label:'Ha.Ihavandhoo', value : 'Ha.Ihavandhoo'},
    //{label:'Ha.Hoarafushi', value : 'Ha.Hoarafushi'},
    //{label:'Ha.Thuraakunu', value : 'Ha.Thuraakunu'},
    //{label:'Ha.Uligan', value : 'Ha.Uligan'},
    //{label:'Ha.Mulhadhoo', value : 'Ha.Mulhadhoo'}],
    
    
    
    onChange : function(value){
    var selected_island =  (islands.filter(ee.Filter.eq("name", value)));
    Map.centerObject(selected_island);
    Map.clear();
    //Map.addLayer(selected_island, {color : 'FF0000'}, value);
    
    var S1 = ee.ImageCollection('COPERNICUS/S2').filterBounds(selected_island).filterDate('2016-01-01','2020-09-01');
    var filtered = S1.filterMetadata('CLOUD_COVERAGE_ASSESSMENT', 'less_than', 10)
    
    //CREATE THE CLOUD MASK
  
    function maskS2clouds(image) {
      var qa = image.select('QA60');
      // Both flags should be set to zero, indicating clear conditions.
      var cloudBitMask = ee.Number(2).pow(10).int();
      var cirrusBitMask = ee.Number(2).pow(11).int();
      var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(qa.bitwiseAnd(cirrusBitMask).eq(0));
      return image.updateMask(mask);
    }  
    
    //For total Land Area Calculate NDWI, add NDWI, Create Land Sea Mask, and add Land as a band
    
    var calcNdwi = function(img) {
      var cloud_less = maskS2clouds(img)
      var ndwi = cloud_less.normalizedDifference(['B3','B8']).rename('NDWI')
    return img.addBands(ndwi)
    }
    
    S1 = filtered.map(calcNdwi)
    
    var clasifyNDWI = function(img){
      var ndwi = img.select('NDWI')
      var land = ndwi.lt(0.1).rename('Land')
      land = land.updateMask(land)
    return img.addBands(land)
    }
    
    
    S1 = S1.map(clasifyNDWI)
    
    //print (S1)
    

    //CALCULATE NDVI, ADD THE NDVI BAND, CLASSIFY THE NDVI AND map NDVI Derived Veg to add it as a band
    
    var calcNdVI = function(img) {
      var cloud_less = maskS2clouds(img)
      var ndvi = cloud_less.normalizedDifference(['B8','B4']).rename('NDVI')
    return img.addBands(ndvi)
    }
    
    S1 = S1.map(calcNdVI)
    
    var clasifyNDVI = function(img){
      var ndvi = img.select('NDVI')
      var veg_ndvi = ndvi.lt(0.9).and(ndvi.gt(0.40)).rename('Veg_NDVI')
      veg_ndvi = veg_ndvi.updateMask(veg_ndvi)
    return img.addBands(veg_ndvi)
    }
    
    S1 = S1.map(clasifyNDVI)
  
   var classification = S1.median().clip(selected_island).select('Veg_NDVI'); 
   
   var visParams = {
      min: -1,
      max: 1,
      palette: ['#FFFF00','#FFFF00']
    }
    
    Map.addLayer(classification,visParams,'Veg_NDVI')
    
    //CALCULATE EVI, ADD THE EVI BAND, CLASSIFY THE EVI AND map EVI Derived Veg to add it as a band
    
     var calcEVI = function(img){
      var cloudless = maskS2clouds(img)
      var calc = cloudless.expression(
    '2.5 * ((NIR - RED) / (NIR + (2.4 *RED) + 10000))', {
      'NIR': img.select('B8'),
      'RED': img.select('B4'),
      'BLUE': img.select('B2')
    })//.rename('EVI') //.copyProperties(img, ['system:time_start'])
      var evi = calc.rename('EVI')
      evi = evi.updateMask(evi)
    return img.addBands(evi)
    }
    
    S1 = S1.map(calcEVI)
    
        var clasifyEVI = function(img){
      var evi = img.select('EVI')
      var veg_Evi = evi.lt(0.9).and(evi.gt(0.25)).rename('Veg_EVI')
      veg_Evi = veg_Evi.updateMask(veg_Evi)
    return img.addBands(veg_Evi)
    }
    
    S1 = S1.map(clasifyEVI)
    
     //print (S1)
     
    var visParams2 = {
      min: -1,
      max: 1,
      palette: [' #008000','  #008000']
    }
    
    
    var classification2 = S1.median().clip(selected_island).select('Veg_EVI'); 
    Map.addLayer(classification2,visParams2,'Veg_EVI')
    
    ///Create Chart

var vegIndices = S1.select(['Veg_NDVI', 'Veg_EVI', 'Land']);


// Define the chart and print it to the console.
var chart =
    ui.Chart.image
        .series({
          imageCollection: vegIndices,
          region: selected_island,
          reducer: ee.Reducer.sum(),
          scale: 100,
          xProperty: 'system:time_start'
        })
        .setSeriesNames(['Land', 'Veg_EVI', 'Veg_NDVI'])
        .setOptions({
          title: 'Vegetation and Total Area over Time',
          hAxis: {title: 'Date', titleTextStyle: {italic: false, bold: true}},
          vAxis: {
            title: 'Area (Hectares)',
            titleTextStyle: {italic: false, bold: true},
        //    viewWindow:{
        //  max:500,
        //  min:0}
          },
          lineWidth: 0.5,
          colors: ['e37d05','#008000', '#FF0000'],
          pointSize: 2.0,
          curveType: 'function'
        });
        
//print(chart);

panel.insert(6,chart);

var calcArea = function(img) {
      var Vegg = img.clip(selected_island).select('Veg_EVI');
      var Landd = img.clip(selected_island).select('Land');
      
      var stats = Vegg.reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: selected_island,
        scale: 100
      });
      
      var st1 = ee.Number(stats.get('Veg_EVI'));
      
      var stats2 = Landd.reduceRegion({
        reducer: ee.Reducer.sum(),
        geometry: selected_island,
        scale: 100
      });
      
      var st2 = ee.Number(stats2.get('Land'));
      
      var s3 = ee.Number(st1).divide(st2).multiply(100);
      
      return img.addBands(s3)
      
    }

S1 = S1.map(calcArea)

var S1_1 = S1.select(
    ['constant'], // old names
    ['Percent_Vegetation']               // new names
);


var ClassChart = ui.Chart.image.series({
      imageCollection: S1_1.select('Percent_Vegetation'),
      region: selected_island,
      reducer: ee.Reducer.median(),
      scale: 10000,
    })
  .setOptions({
      title: 'Percentage of island vegetation over time',
      fontSize: 12.5,
      hAxis: {'title': 'Date'},
      vAxis: {'title': 'Percentage of Vegetation over time'},
      lineWidth: 0.15,
      pointSize: 2.0,
      color: '#FF0000'
    })
    .setChartType('ScatterChart');

//print (ClassChart)

panel.insert(7,ClassChart);

panel.add(ui.Button('RESET', function () {
      //Map.clear();
      //ui.root.clear()
      panel.clear()
      //ui.root.insert(0,panel);
      ui.root.widgets().get(1)
      //panel.clear(islandSelect);
      
      panel.add(ui.Label({value: 'Island Vegetation and Area Calculator.',
  style: {
    fontWeight: 'bold',
    fontFamily: 'times',
    fontSize: '25px',
    margin: '0 0 4px 0',
    textAlign: 'left',
    color: '#b31b1b',
    padding: '10px'
    }
}));

panel.add(ui.Label({value: 'Select region in the form of Atoll.Island from the drop down menu to plot the island area over time and the area of vegetaion over time for the island. A second graph shows the percentage of vegetation across the island for the duration. Currently only the inhabited islands of the Maldives within coverage of Sentinel-2 imagery are listed.',
  style: {
    fontWeight: 'normal',
    fontSize: '15px',
    margin: '0 0 4px 0',
    fontFamily: 'times',
    color: '#000000',
    //border : '1px solid black',
    padding: '10px'
    }
}));

panel.widgets().set(2, islandSelect);


      
      
      
}))


    
  
  }
});

ui.root.add(panel);

panel.widgets().set(2, islandSelect);
islandSelect.setPlaceholder('Select Administrative Atoll Boundary');