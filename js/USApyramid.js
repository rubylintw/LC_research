am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var mainContainer = am4core.create("chartdiv-USApyramid", am4core.Container);
    mainContainer.width = am4core.percent(100);
    mainContainer.height = am4core.percent(100);
    mainContainer.layout = "horizontal";
    
    var usData = [
        {
          "year": "2007",
          "Charged_Off":45,
          "Fully_Paid":206
        },
        {
          "year": "2008",
          "Charged_Off":247,
          "Fully_Paid":1314
        },
        {
          "year": "2009",
          "Charged_Off":594,
          "Fully_Paid":4122
        },
        {
          "year": "2010",
          "Charged_Off":1483,
          "Fully_Paid":10038
        },
        {
          "year": "2011",
          "Charged_Off":3205,
          "Fully_Paid":16470
        },
        {
          "year": "2012",
          "Charged_Off":8084,
          "Fully_Paid":41479
        },
        {
          "year": "2013",
          "Charged_Off":14836,
          "Fully_Paid":56396
        },
        {
          "year": "2014",
          "Charged_Off":13981,
          "Fully_Paid":54713
        },
        {
          "year": "2015",
          "Charged_Off":2773,
          "Fully_Paid":22984
        },
    ];
    
    var maleChart = mainContainer.createChild(am4charts.XYChart);
    maleChart.paddingRight = 0;
    maleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var maleCategoryAxis = maleChart.yAxes.push(new am4charts.CategoryAxis());
    maleCategoryAxis.dataFields.category = "year";
    maleCategoryAxis.renderer.grid.template.location = 0;
    //maleCategoryAxis.renderer.inversed = true;
    maleCategoryAxis.renderer.minGridDistance = 15;
    
    var maleValueAxis = maleChart.xAxes.push(new am4charts.ValueAxis());
    maleValueAxis.renderer.inversed = true;
    maleValueAxis.min = 0;
    maleValueAxis.max = 50;
    maleValueAxis.strictMinMax = true;
    
    maleValueAxis.numberFormatter = new am4core.NumberFormatter();
    maleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    
    // Create series
    var maleSeries = maleChart.series.push(new am4charts.ColumnSeries());
    maleSeries.dataFields.valueX = "Charged_Off";
    maleSeries.dataFields.valueXShow = "percent";
    maleSeries.calculatePercent = true;
    maleSeries.dataFields.categoryY = "year";
    maleSeries.interpolationDuration = 1000;
    maleSeries.columns.template.tooltipText = "呆帳, year{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    //maleSeries.sequencedInterpolation = true;
    
    
    var femaleChart = mainContainer.createChild(am4charts.XYChart);
    femaleChart.paddingLeft = 0;
    femaleChart.data = JSON.parse(JSON.stringify(usData));
    
    // Create axes
    var femaleCategoryAxis = femaleChart.yAxes.push(new am4charts.CategoryAxis());
    femaleCategoryAxis.renderer.opposite = true;
    femaleCategoryAxis.dataFields.category = "year";
    femaleCategoryAxis.renderer.grid.template.location = 0;
    femaleCategoryAxis.renderer.minGridDistance = 15;
    
    var femaleValueAxis = femaleChart.xAxes.push(new am4charts.ValueAxis());
    femaleValueAxis.min = 0;
    femaleValueAxis.max = 50;
    femaleValueAxis.strictMinMax = true;
    femaleValueAxis.numberFormatter = new am4core.NumberFormatter();
    femaleValueAxis.numberFormatter.numberFormat = "#.#'%'";
    femaleValueAxis.renderer.minLabelPosition = 0.01;
    
    // Create series
    var femaleSeries = femaleChart.series.push(new am4charts.ColumnSeries());
    femaleSeries.dataFields.valueX = "Fully_Paid";
    femaleSeries.dataFields.valueXShow = "percent";
    femaleSeries.calculatePercent = true;
    femaleSeries.fill = femaleChart.colors.getIndex(4);
    femaleSeries.stroke = femaleSeries.fill;
    //femaleSeries.sequencedInterpolation = true;
    femaleSeries.columns.template.tooltipText = "全額付清, year{categoryY}: {valueX} ({valueX.percent.formatNumber('#.0')}%)";
    femaleSeries.dataFields.categoryY = "year";
    femaleSeries.interpolationDuration = 1000;
    
    
    var mapChart = mainContainer.createChild(am4maps.MapChart);
    mapChart.projection = new am4maps.projections.Mercator();
    mapChart.geodata = am4geodata_usaAlbersLow;
    mapChart.zoomControl = new am4maps.ZoomControl();
    mapChart.zIndex = -1;
    
    var polygonSeries = mapChart.series.push(new am4maps.MapPolygonSeries())
    polygonSeries.useGeodata = true;
    
    var selectedStateId = "US";
    var selectedPolygon;
    var selectedStateName;
    
    var polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.togglable = true;
    
    var hoverState = polygonTemplate.states.create("hover");
    hoverState.properties.fill = mapChart.colors.getIndex(2);
    
    var activeState = polygonTemplate.states.create("active");
    activeState.properties.fill = mapChart.colors.getIndex(6);
    
    polygonTemplate.events.on("hit", function(event) {
      var id = event.target.dataItem.dataContext.id;
      var stateId = id.split("-")[1];
      showState(stateId, event.target.dataItem.dataContext.name, event.target);
    })
    
    
    mapChart.seriesContainer.background.events.on("over", function(event) {
      showState(selectedStateId, selectedStateName, selectedPolygon);
    });
    
    
    function showState(id, stateName, polygon) {
      if(selectedStateId != id){
    
        var newData = stateData[id];
    
        if (selectedPolygon) {
          selectedPolygon.isActive = false;
        }
    
        for (var i = 0; i < femaleChart.data.length; i++) {
          femaleChart.data[i].Fully_Paid = newData[i].Fully_Paid;
          maleChart.data[i].Charged_Off = newData[i].Charged_Off;
        }
    
        femaleChart.invalidateRawData();
        maleChart.invalidateRawData();
    
        selectedStateName = stateName;
        selectedStateId = id;
        selectedPolygon = polygon;
    
        label.text = stateName + " population pyramid";
        label.hide(0);
        label.show();
       }
    }
    
    var label = mainContainer.createChild(am4core.Label);
    label.isMeasured = false;
    label.x = am4core.percent(80);
    label.horizontalCenter = "middle";
    label.y = 50;
    label.showOnInit = true;
    label.text = "US Population pyramid";
    label.hiddenState.properties.dy = -100;
    
    
    var stateData = {
        "AK":[
            {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },{
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2009,
              "Charged_Off": 2,
              "Fully_Paid": 6
          },
          {
              "year": 2010,
              "Charged_Off": 3,
              "Fully_Paid": 17
          },
          {
              "year": 2011,
              "Charged_Off": 10,
              "Fully_Paid": 37
          },
          {
              "year": 2012,
              "Charged_Off": 18,
              "Fully_Paid": 145
          },
          {
              "year": 2013,
              "Charged_Off": 35,
              "Fully_Paid": 170
          },
          {
              "year": 2014,
              "Charged_Off": 21,
              "Fully_Paid": 140
          },
          {
              "year": 2015,
              "Charged_Off": 7,
              "Fully_Paid": 50
          }],
          "AL":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 5
          },
          {
              "year": 2008,
              "Charged_Off": 3,
              "Fully_Paid": 9
          },
          {
              "year": 2009,
              "Charged_Off": 5,
              "Fully_Paid": 45
          },
          {
              "year": 2010,
              "Charged_Off": 14,
              "Fully_Paid": 129
          },
          {
              "year": 2011,
              "Charged_Off": 32,
              "Fully_Paid": 182
          },
          {
              "year": 2012,
              "Charged_Off": 125,
              "Fully_Paid": 505
          },
          {
              "year": 2013,
              "Charged_Off": 213,
              "Fully_Paid": 632
          },
          {
              "year": 2014,
              "Charged_Off": 223,
              "Fully_Paid": 698
          },
          {
              "year": 2015,
              "Charged_Off": 47,
              "Fully_Paid": 280
          }],
          "AR":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 6
          },
          {
              "year": 2009,
              "Charged_Off": 4,
              "Fully_Paid": 19
          },
          {
              "year": 2010,
              "Charged_Off": 8,
              "Fully_Paid": 62
          },
          {
              "year": 2011,
              "Charged_Off": 15,
              "Fully_Paid": 116
          },
          {
              "year": 2012,
              "Charged_Off": 71,
              "Fully_Paid": 320
          },
          {
              "year": 2013,
              "Charged_Off": 111,
              "Fully_Paid": 381
          },
          {
              "year": 2014,
              "Charged_Off": 112,
              "Fully_Paid": 364
          },
          {
              "year": 2015,
              "Charged_Off": 16,
              "Fully_Paid": 149
          }],
          "AZ":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 4
          },
          {
              "year": 2008,
              "Charged_Off": 10,
              "Fully_Paid": 30
          },
          {
              "year": 2009,
              "Charged_Off": 18,
              "Fully_Paid": 95
          },
          {
              "year": 2010,
              "Charged_Off": 24,
              "Fully_Paid": 217
          },
          {
              "year": 2011,
              "Charged_Off": 69,
              "Fully_Paid": 368
          },
          {
              "year": 2012,
              "Charged_Off": 201,
              "Fully_Paid": 929
          },
          {
              "year": 2013,
              "Charged_Off": 331,
              "Fully_Paid": 1405
          },
          {
              "year": 2014,
              "Charged_Off": 325,
              "Fully_Paid": 1385
          },
          {
              "year": 2015,
              "Charged_Off": 71,
              "Fully_Paid": 595
          }],
          "CA":[
          {
              "year": 2007,
              "Charged_Off": 2,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 60,
              "Fully_Paid": 250
          },
          {
              "year": 2009,
              "Charged_Off": 129,
              "Fully_Paid": 706
          },
          {
              "year": 2010,
              "Charged_Off": 297,
              "Fully_Paid": 1797
          },
          {
              "year": 2011,
              "Charged_Off": 629,
              "Fully_Paid": 2942
          },
          {
              "year": 2012,
              "Charged_Off": 1403,
              "Fully_Paid": 7402
          },
          {
              "year": 2013,
              "Charged_Off": 2316,
              "Fully_Paid": 9957
          },
          {
              "year": 2014,
              "Charged_Off": 2074,
              "Fully_Paid": 8988
          },
          {
              "year": 2015,
              "Charged_Off": 422,
              "Fully_Paid": 3732
          }],
          "CO":[
          {
              "year": 2007,
              "Charged_Off": 2,
              "Fully_Paid": 4
          },
          {
              "year": 2008,
              "Charged_Off": 8,
              "Fully_Paid": 39
          },
          {
              "year": 2009,
              "Charged_Off": 12,
              "Fully_Paid": 96
          },
          {
              "year": 2010,
              "Charged_Off": 35,
              "Fully_Paid": 213
          },
          {
              "year": 2011,
              "Charged_Off": 41,
              "Fully_Paid": 303
          },
          {
              "year": 2012,
              "Charged_Off": 138,
              "Fully_Paid": 794
          },
          {
              "year": 2013,
              "Charged_Off": 261,
              "Fully_Paid": 1399
          },
          {
              "year": 2014,
              "Charged_Off": 239,
              "Fully_Paid": 1370
          },
          {
              "year": 2015,
              "Charged_Off": 48,
              "Fully_Paid": 611
          }],
          "CT":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 4,
              "Fully_Paid": 21
          },
          {
              "year": 2009,
              "Charged_Off": 9,
              "Fully_Paid": 79
          },
          {
              "year": 2010,
              "Charged_Off": 23,
              "Fully_Paid": 213
          },
          {
              "year": 2011,
              "Charged_Off": 57,
              "Fully_Paid": 291
          },
          {
              "year": 2012,
              "Charged_Off": 126,
              "Fully_Paid": 655
          },
          {
              "year": 2013,
              "Charged_Off": 208,
              "Fully_Paid": 805
          },
          {
              "year": 2014,
              "Charged_Off": 151,
              "Fully_Paid": 747
          },
          {
              "year": 2015,
              "Charged_Off": 36,
              "Fully_Paid": 253
          }],
          "DC":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 6
          },
          {
              "year": 2009,
              "Charged_Off": 4,
              "Fully_Paid": 27
          },
          {
              "year": 2010,
              "Charged_Off": 1,
              "Fully_Paid": 62
          },
          {
              "year": 2011,
              "Charged_Off": 8,
              "Fully_Paid": 99
          },
          {
              "year": 2012,
              "Charged_Off": 11,
              "Fully_Paid": 153
          },
          {
              "year": 2013,
              "Charged_Off": 31,
              "Fully_Paid": 173
          },
          {
              "year": 2014,
              "Charged_Off": 24,
              "Fully_Paid": 169
          },
          {
              "year": 2015,
              "Charged_Off": 6,
              "Fully_Paid": 61
          }],
          "DE":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 4
          },
          {
              "year": 2009,
              "Charged_Off": 2,
              "Fully_Paid": 15
          },
          {
              "year": 2010,
              "Charged_Off": 4,
              "Fully_Paid": 30
          },
          {
              "year": 2011,
              "Charged_Off": 4,
              "Fully_Paid": 50
          },
          {
              "year": 2012,
              "Charged_Off": 22,
              "Fully_Paid": 86
          },
          {
              "year": 2013,
              "Charged_Off": 37,
              "Fully_Paid": 136
          },
          {
              "year": 2014,
              "Charged_Off": 42,
              "Fully_Paid": 145
          },
          {
              "year": 2015,
              "Charged_Off": 8,
              "Fully_Paid": 79
          }],
          "FL":[
          {
              "year": 2007,
              "Charged_Off": 10,
              "Fully_Paid": 16
          },
          {
              "year": 2008,
              "Charged_Off": 33,
              "Fully_Paid": 62
          },
          {
              "year": 2009,
              "Charged_Off": 56,
              "Fully_Paid": 291
          },
          {
              "year": 2010,
              "Charged_Off": 119,
              "Fully_Paid": 680
          },
          {
              "year": 2011,
              "Charged_Off": 284,
              "Fully_Paid": 1158
          },
          {
              "year": 2012,
              "Charged_Off": 691,
              "Fully_Paid": 3031
          },
          {
              "year": 2013,
              "Charged_Off": 1113,
              "Fully_Paid": 3606
          },
          {
              "year": 2014,
              "Charged_Off": 1022,
              "Fully_Paid": 3599
          },
          {
              "year": 2015,
              "Charged_Off": 196,
              "Fully_Paid": 1578
          }],
          "GA":[
          {
              "year": 2007,
              "Charged_Off": 3,
              "Fully_Paid": 7
          },
          {
              "year": 2008,
              "Charged_Off": 11,
              "Fully_Paid": 49
          },
          {
              "year": 2009,
              "Charged_Off": 26,
              "Fully_Paid": 149
          },
          {
              "year": 2010,
              "Charged_Off": 66,
              "Fully_Paid": 363
          },
          {
              "year": 2011,
              "Charged_Off": 108,
              "Fully_Paid": 554
          },
          {
              "year": 2012,
              "Charged_Off": 248,
              "Fully_Paid": 1254
          },
          {
              "year": 2013,
              "Charged_Off": 401,
              "Fully_Paid": 1778
          },
          {
              "year": 2014,
              "Charged_Off": 415,
              "Fully_Paid": 1758
          },
          {
              "year": 2015,
              "Charged_Off": 82,
              "Fully_Paid": 742
          }],
          "HI":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 6
          },
          {
              "year": 2009,
              "Charged_Off": 4,
              "Fully_Paid": 13
          },
          {
              "year": 2010,
              "Charged_Off": 8,
              "Fully_Paid": 33
          },
          {
              "year": 2011,
              "Charged_Off": 14,
              "Fully_Paid": 84
          },
          {
              "year": 2012,
              "Charged_Off": 54,
              "Fully_Paid": 245
          },
          {
              "year": 2013,
              "Charged_Off": 96,
              "Fully_Paid": 366
          },
          {
              "year": 2014,
              "Charged_Off": 79,
              "Fully_Paid": 302
          },
          {
              "year": 2015,
              "Charged_Off": 19,
              "Fully_Paid": 153
          }],
          "IA":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 4
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 1,
              "Fully_Paid": 0
          },
          {
              "year": 2014,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2015,
              "Charged_Off": 0,
              "Fully_Paid": 0
          }],
          "ID":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 5
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2014,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2015,
              "Charged_Off": 0,
              "Fully_Paid": 0
          }],
          "IL":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2008,
              "Charged_Off": 10,
              "Fully_Paid": 50
          },
          {
              "year": 2009,
              "Charged_Off": 18,
              "Fully_Paid": 163
          },
          {
              "year": 2010,
              "Charged_Off": 43,
              "Fully_Paid": 383
          },
          {
              "year": 2011,
              "Charged_Off": 124,
              "Fully_Paid": 641
          },
          {
              "year": 2012,
              "Charged_Off": 250,
              "Fully_Paid": 1631
          },
          {
              "year": 2013,
              "Charged_Off": 534,
              "Fully_Paid": 2013
          },
          {
              "year": 2014,
              "Charged_Off": 474,
              "Fully_Paid": 2027
          },
          {
              "year": 2015,
              "Charged_Off": 89,
              "Fully_Paid": 801
          }],
          "IN":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 9
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 9,
              "Fully_Paid": 12
          },
          {
              "year": 2013,
              "Charged_Off": 278,
              "Fully_Paid": 877
          },
          {
              "year": 2014,
              "Charged_Off": 282,
              "Fully_Paid": 910
          },
          {
              "year": 2015,
              "Charged_Off": 57,
              "Fully_Paid": 366
          }],
          "KS":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 14
          },
          {
              "year": 2009,
              "Charged_Off": 4,
              "Fully_Paid": 33
          },
          {
              "year": 2010,
              "Charged_Off": 3,
              "Fully_Paid": 25
          },
          {
              "year": 2011,
              "Charged_Off": 22,
              "Fully_Paid": 146
          },
          {
              "year": 2012,
              "Charged_Off": 62,
              "Fully_Paid": 395
          },
          {
              "year": 2013,
              "Charged_Off": 135,
              "Fully_Paid": 503
          },
          {
              "year": 2014,
              "Charged_Off": 100,
              "Fully_Paid": 439
          },
          {
              "year": 2015,
              "Charged_Off": 29,
              "Fully_Paid": 171
          }],
          "KY":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 6
          },
          {
              "year": 2009,
              "Charged_Off": 1,
              "Fully_Paid": 30
          },
          {
              "year": 2010,
              "Charged_Off": 9,
              "Fully_Paid": 75
          },
          {
              "year": 2011,
              "Charged_Off": 35,
              "Fully_Paid": 146
          },
          {
              "year": 2012,
              "Charged_Off": 60,
              "Fully_Paid": 359
          },
          {
              "year": 2013,
              "Charged_Off": 152,
              "Fully_Paid": 514
          },
          {
              "year": 2014,
              "Charged_Off": 157,
              "Fully_Paid": 500
          },
          {
              "year": 2015,
              "Charged_Off": 22,
              "Fully_Paid": 201
          }],
          "LA":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 16
          },
          {
              "year": 2009,
              "Charged_Off": 3,
              "Fully_Paid": 44
          },
          {
              "year": 2010,
              "Charged_Off": 22,
              "Fully_Paid": 95
          },
          {
              "year": 2011,
              "Charged_Off": 27,
              "Fully_Paid": 206
          },
          {
              "year": 2012,
              "Charged_Off": 98,
              "Fully_Paid": 501
          },
          {
              "year": 2013,
              "Charged_Off": 194,
              "Fully_Paid": 643
          },
          {
              "year": 2014,
              "Charged_Off": 186,
              "Fully_Paid": 599
          },
          {
              "year": 2015,
              "Charged_Off": 35,
              "Fully_Paid": 279
          }],
          "MA":[
          {
              "year": 2007,
              "Charged_Off": 1,
              "Fully_Paid": 27
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 39
          },
          {
              "year": 2009,
              "Charged_Off": 17,
              "Fully_Paid": 162
          },
          {
              "year": 2010,
              "Charged_Off": 51,
              "Fully_Paid": 392
          },
          {
              "year": 2011,
              "Charged_Off": 86,
              "Fully_Paid": 489
          },
          {
              "year": 2012,
              "Charged_Off": 195,
              "Fully_Paid": 1058
          },
          {
              "year": 2013,
              "Charged_Off": 318,
              "Fully_Paid": 1254
          },
          {
              "year": 2014,
              "Charged_Off": 302,
              "Fully_Paid": 1220
          },
          {
              "year": 2015,
              "Charged_Off": 45,
              "Fully_Paid": 481
          }],
          "MD":[
          {
              "year": 2007,
              "Charged_Off": 2,
              "Fully_Paid": 8
          },
          {
              "year": 2008,
              "Charged_Off": 7,
              "Fully_Paid": 35
          },
          {
              "year": 2009,
              "Charged_Off": 12,
              "Fully_Paid": 114
          },
          {
              "year": 2010,
              "Charged_Off": 46,
              "Fully_Paid": 281
          },
          {
              "year": 2011,
              "Charged_Off": 95,
              "Fully_Paid": 410
          },
          {
              "year": 2012,
              "Charged_Off": 182,
              "Fully_Paid": 909
          },
          {
              "year": 2013,
              "Charged_Off": 363,
              "Fully_Paid": 1293
          },
          {
              "year": 2014,
              "Charged_Off": 335,
              "Fully_Paid": 1295
          },
          {
              "year": 2015,
              "Charged_Off": 58,
              "Fully_Paid": 562
          }],
          "ME":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2014,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2015,
              "Charged_Off": 0,
              "Fully_Paid": 9
          }],
          "MI":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 4,
              "Fully_Paid": 25
          },
          {
              "year": 2009,
              "Charged_Off": 12,
              "Fully_Paid": 92
          },
          {
              "year": 2010,
              "Charged_Off": 26,
              "Fully_Paid": 194
          },
          {
              "year": 2011,
              "Charged_Off": 57,
              "Fully_Paid": 268
          },
          {
              "year": 2012,
              "Charged_Off": 202,
              "Fully_Paid": 910
          },
          {
              "year": 2013,
              "Charged_Off": 395,
              "Fully_Paid": 1296
          },
          {
              "year": 2014,
              "Charged_Off": 385,
              "Fully_Paid": 1415
          },
          {
              "year": 2015,
              "Charged_Off": 69,
              "Fully_Paid": 646
          }],
          "MN":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 4,
              "Fully_Paid": 23
          },
          {
              "year": 2009,
              "Charged_Off": 7,
              "Fully_Paid": 67
          },
          {
              "year": 2010,
              "Charged_Off": 24,
              "Fully_Paid": 152
          },
          {
              "year": 2011,
              "Charged_Off": 46,
              "Fully_Paid": 271
          },
          {
              "year": 2012,
              "Charged_Off": 127,
              "Fully_Paid": 683
          },
          {
              "year": 2013,
              "Charged_Off": 245,
              "Fully_Paid": 1035
          },
          {
              "year": 2014,
              "Charged_Off": 290,
              "Fully_Paid": 974
          },
          {
              "year": 2015,
              "Charged_Off": 60,
              "Fully_Paid": 452
          }],
          "MO":[
          {
              "year": 2007,
              "Charged_Off": 1,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 17
          },
          {
              "year": 2009,
              "Charged_Off": 10,
              "Fully_Paid": 52
          },
          {
              "year": 2010,
              "Charged_Off": 41,
              "Fully_Paid": 163
          },
          {
              "year": 2011,
              "Charged_Off": 61,
              "Fully_Paid": 304
          },
          {
              "year": 2012,
              "Charged_Off": 132,
              "Fully_Paid": 626
          },
          {
              "year": 2013,
              "Charged_Off": 230,
              "Fully_Paid": 868
          },
          {
              "year": 2014,
              "Charged_Off": 255,
              "Fully_Paid": 823
          },
          {
              "year": 2015,
              "Charged_Off": 50,
              "Fully_Paid": 317
          }],
          "MS":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 7
          },
          {
              "year": 2009,
              "Charged_Off": 1,
              "Fully_Paid": 9
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2013,
              "Charged_Off": 1,
              "Fully_Paid": 1
          },
          {
              "year": 2014,
              "Charged_Off": 72,
              "Fully_Paid": 188
          },
          {
              "year": 2015,
              "Charged_Off": 11,
              "Fully_Paid": 128
          }],
          "MT":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 7
          },
          {
              "year": 2009,
              "Charged_Off": 2,
              "Fully_Paid": 5
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 20
          },
          {
              "year": 2011,
              "Charged_Off": 9,
              "Fully_Paid": 39
          },
          {
              "year": 2012,
              "Charged_Off": 23,
              "Fully_Paid": 130
          },
          {
              "year": 2013,
              "Charged_Off": 24,
              "Fully_Paid": 182
          },
          {
              "year": 2014,
              "Charged_Off": 32,
              "Fully_Paid": 190
          },
          {
              "year": 2015,
              "Charged_Off": 5,
              "Fully_Paid": 68
          }],
          "NC":[
          {
              "year": 2007,
              "Charged_Off": 5,
              "Fully_Paid": 10
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 26
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 14,
              "Fully_Paid": 70
          },
          {
              "year": 2011,
              "Charged_Off": 91,
              "Fully_Paid": 499
          },
          {
              "year": 2012,
              "Charged_Off": 242,
              "Fully_Paid": 1220
          },
          {
              "year": 2013,
              "Charged_Off": 445,
              "Fully_Paid": 1607
          },
          {
              "year": 2014,
              "Charged_Off": 424,
              "Fully_Paid": 1501
          },
          {
              "year": 2015,
              "Charged_Off": 83,
              "Fully_Paid": 680
          }],
          "ND":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2014,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2015,
              "Charged_Off": 0,
              "Fully_Paid": 8
          }],
          "NE":[
          {
              "year": 2007,
              "Charged_Off": 3,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 1,
              "Fully_Paid": 1
          },
          {
              "year": 2014,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2015,
              "Charged_Off": 0,
              "Fully_Paid": 31
          }],
          "NH":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 5
          },
          {
              "year": 2009,
              "Charged_Off": 5,
              "Fully_Paid": 18
          },
          {
              "year": 2010,
              "Charged_Off": 6,
              "Fully_Paid": 45
          },
          {
              "year": 2011,
              "Charged_Off": 13,
              "Fully_Paid": 68
          },
          {
              "year": 2012,
              "Charged_Off": 27,
              "Fully_Paid": 203
          },
          {
              "year": 2013,
              "Charged_Off": 50,
              "Fully_Paid": 283
          },
          {
              "year": 2014,
              "Charged_Off": 52,
              "Fully_Paid": 265
          },
          {
              "year": 2015,
              "Charged_Off": 3,
              "Fully_Paid": 102
          }],
          "NJ":[
          {
              "year": 2007,
              "Charged_Off": 5,
              "Fully_Paid": 10
          },
          {
              "year": 2008,
              "Charged_Off": 11,
              "Fully_Paid": 59
          },
          {
              "year": 2009,
              "Charged_Off": 27,
              "Fully_Paid": 185
          },
          {
              "year": 2010,
              "Charged_Off": 86,
              "Fully_Paid": 476
          },
          {
              "year": 2011,
              "Charged_Off": 147,
              "Fully_Paid": 739
          },
          {
              "year": 2012,
              "Charged_Off": 349,
              "Fully_Paid": 1588
          },
          {
              "year": 2013,
              "Charged_Off": 631,
              "Fully_Paid": 1978
          },
          {
              "year": 2014,
              "Charged_Off": 488,
              "Fully_Paid": 1980
          },
          {
              "year": 2015,
              "Charged_Off": 97,
              "Fully_Paid": 745
          }],
          "NM":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 8
          },
          {
              "year": 2009,
              "Charged_Off": 2,
              "Fully_Paid": 24
          },
          {
              "year": 2010,
              "Charged_Off": 10,
              "Fully_Paid": 52
          },
          {
              "year": 2011,
              "Charged_Off": 18,
              "Fully_Paid": 64
          },
          {
              "year": 2012,
              "Charged_Off": 46,
              "Fully_Paid": 214
          },
          {
              "year": 2013,
              "Charged_Off": 72,
              "Fully_Paid": 312
          },
          {
              "year": 2014,
              "Charged_Off": 107,
              "Fully_Paid": 295
          },
          {
              "year": 2015,
              "Charged_Off": 14,
              "Fully_Paid": 137
          }],
          "NV":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 4,
              "Fully_Paid": 9
          },
          {
              "year": 2009,
              "Charged_Off": 16,
              "Fully_Paid": 43
          },
          {
              "year": 2010,
              "Charged_Off": 24,
              "Fully_Paid": 96
          },
          {
              "year": 2011,
              "Charged_Off": 63,
              "Fully_Paid": 211
          },
          {
              "year": 2012,
              "Charged_Off": 131,
              "Fully_Paid": 610
          },
          {
              "year": 2013,
              "Charged_Off": 284,
              "Fully_Paid": 844
          },
          {
              "year": 2014,
              "Charged_Off": 219,
              "Fully_Paid": 825
          },
          {
              "year": 2015,
              "Charged_Off": 62,
              "Fully_Paid": 368
          }],
          "NY":[
          {
              "year": 2007,
              "Charged_Off": 8,
              "Fully_Paid": 32
          },
          {
              "year": 2008,
              "Charged_Off": 15,
              "Fully_Paid": 117
          },
          {
              "year": 2009,
              "Charged_Off": 43,
              "Fully_Paid": 405
          },
          {
              "year": 2010,
              "Charged_Off": 133,
              "Fully_Paid": 1033
          },
          {
              "year": 2011,
              "Charged_Off": 290,
              "Fully_Paid": 1549
          },
          {
              "year": 2012,
              "Charged_Off": 840,
              "Fully_Paid": 3901
          },
          {
              "year": 2013,
              "Charged_Off": 1306,
              "Fully_Paid": 4393
          },
          {
              "year": 2014,
              "Charged_Off": 1246,
              "Fully_Paid": 4163
          },
          {
              "year": 2015,
              "Charged_Off": 243,
              "Fully_Paid": 1621
          }],
          "OH":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 4,
              "Fully_Paid": 46
          },
          {
              "year": 2009,
              "Charged_Off": 13,
              "Fully_Paid": 148
          },
          {
              "year": 2010,
              "Charged_Off": 32,
              "Fully_Paid": 294
          },
          {
              "year": 2011,
              "Charged_Off": 105,
              "Fully_Paid": 505
          },
          {
              "year": 2012,
              "Charged_Off": 227,
              "Fully_Paid": 1191
          },
          {
              "year": 2013,
              "Charged_Off": 516,
              "Fully_Paid": 1719
          },
          {
              "year": 2014,
              "Charged_Off": 478,
              "Fully_Paid": 1659
          },
          {
              "year": 2015,
              "Charged_Off": 97,
              "Fully_Paid": 703
          }],
          "OK":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 8
          },
          {
              "year": 2009,
              "Charged_Off": 7,
              "Fully_Paid": 26
          },
          {
              "year": 2010,
              "Charged_Off": 6,
              "Fully_Paid": 69
          },
          {
              "year": 2011,
              "Charged_Off": 24,
              "Fully_Paid": 139
          },
          {
              "year": 2012,
              "Charged_Off": 67,
              "Fully_Paid": 344
          },
          {
              "year": 2013,
              "Charged_Off": 140,
              "Fully_Paid": 482
          },
          {
              "year": 2014,
              "Charged_Off": 142,
              "Fully_Paid": 452
          },
          {
              "year": 2015,
              "Charged_Off": 33,
              "Fully_Paid": 190
          }],
          "OR":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 20
          },
          {
              "year": 2009,
              "Charged_Off": 10,
              "Fully_Paid": 40
          },
          {
              "year": 2010,
              "Charged_Off": 18,
              "Fully_Paid": 118
          },
          {
              "year": 2011,
              "Charged_Off": 39,
              "Fully_Paid": 181
          },
          {
              "year": 2012,
              "Charged_Off": 93,
              "Fully_Paid": 529
          },
          {
              "year": 2013,
              "Charged_Off": 189,
              "Fully_Paid": 843
          },
          {
              "year": 2014,
              "Charged_Off": 164,
              "Fully_Paid": 745
          },
          {
              "year": 2015,
              "Charged_Off": 29,
              "Fully_Paid": 333
          }],
          "PA":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 6,
              "Fully_Paid": 39
          },
          {
              "year": 2009,
              "Charged_Off": 18,
              "Fully_Paid": 190
          },
          {
              "year": 2010,
              "Charged_Off": 45,
              "Fully_Paid": 431
          },
          {
              "year": 2011,
              "Charged_Off": 107,
              "Fully_Paid": 591
          },
          {
              "year": 2012,
              "Charged_Off": 250,
              "Fully_Paid": 1341
          },
          {
              "year": 2013,
              "Charged_Off": 513,
              "Fully_Paid": 1768
          },
          {
              "year": 2014,
              "Charged_Off": 533,
              "Fully_Paid": 1758
          },
          {
              "year": 2015,
              "Charged_Off": 85,
              "Fully_Paid": 724
          }],
          "RI":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 9
          },
          {
              "year": 2009,
              "Charged_Off": 3,
              "Fully_Paid": 25
          },
          {
              "year": 2010,
              "Charged_Off": 5,
              "Fully_Paid": 52
          },
          {
              "year": 2011,
              "Charged_Off": 16,
              "Fully_Paid": 80
          },
          {
              "year": 2012,
              "Charged_Off": 52,
              "Fully_Paid": 180
          },
          {
              "year": 2013,
              "Charged_Off": 54,
              "Fully_Paid": 228
          },
          {
              "year": 2014,
              "Charged_Off": 49,
              "Fully_Paid": 214
          },
          {
              "year": 2015,
              "Charged_Off": 11,
              "Fully_Paid": 108
          }],
          "SC":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 5
          },
          {
              "year": 2008,
              "Charged_Off": 1,
              "Fully_Paid": 13
          },
          {
              "year": 2009,
              "Charged_Off": 9,
              "Fully_Paid": 49
          },
          {
              "year": 2010,
              "Charged_Off": 18,
              "Fully_Paid": 113
          },
          {
              "year": 2011,
              "Charged_Off": 38,
              "Fully_Paid": 204
          },
          {
              "year": 2012,
              "Charged_Off": 95,
              "Fully_Paid": 467
          },
          {
              "year": 2013,
              "Charged_Off": 126,
              "Fully_Paid": 588
          },
          {
              "year": 2014,
              "Charged_Off": 133,
              "Fully_Paid": 687
          },
          {
              "year": 2015,
              "Charged_Off": 29,
              "Fully_Paid": 243
          }],
          "SD":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2009,
              "Charged_Off": 1,
              "Fully_Paid": 4
          },
          {
              "year": 2010,
              "Charged_Off": 3,
              "Fully_Paid": 13
          },
          {
              "year": 2011,
              "Charged_Off": 8,
              "Fully_Paid": 28
          },
          {
              "year": 2012,
              "Charged_Off": 13,
              "Fully_Paid": 106
          },
          {
              "year": 2013,
              "Charged_Off": 31,
              "Fully_Paid": 121
          },
          {
              "year": 2014,
              "Charged_Off": 27,
              "Fully_Paid": 130
          },
          {
              "year": 2015,
              "Charged_Off": 7,
              "Fully_Paid": 49
          }],
          "TN":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 2,
              "Fully_Paid": 13
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2010,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2011,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2012,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2013,
              "Charged_Off": 255,
              "Fully_Paid": 760
          },
          {
              "year": 2014,
              "Charged_Off": 267,
              "Fully_Paid": 765
          },
          {
              "year": 2015,
              "Charged_Off": 39,
              "Fully_Paid": 323
          }],
          "TX":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2008,
              "Charged_Off": 10,
              "Fully_Paid": 102
          },
          {
              "year": 2009,
              "Charged_Off": 35,
              "Fully_Paid": 305
          },
          {
              "year": 2010,
              "Charged_Off": 92,
              "Fully_Paid": 715
          },
          {
              "year": 2011,
              "Charged_Off": 175,
              "Fully_Paid": 1176
          },
          {
              "year": 2012,
              "Charged_Off": 554,
              "Fully_Paid": 3449
          },
          {
              "year": 2013,
              "Charged_Off": 1017,
              "Fully_Paid": 4324
          },
          {
              "year": 2014,
              "Charged_Off": 945,
              "Fully_Paid": 4373
          },
          {
              "year": 2015,
              "Charged_Off": 207,
              "Fully_Paid": 1862
          }],
          "UT":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 3
          },
          {
              "year": 2008,
              "Charged_Off": 6,
              "Fully_Paid": 10
          },
          {
              "year": 2009,
              "Charged_Off": 6,
              "Fully_Paid": 30
          },
          {
              "year": 2010,
              "Charged_Off": 10,
              "Fully_Paid": 60
          },
          {
              "year": 2011,
              "Charged_Off": 17,
              "Fully_Paid": 107
          },
          {
              "year": 2012,
              "Charged_Off": 61,
              "Fully_Paid": 305
          },
          {
              "year": 2013,
              "Charged_Off": 115,
              "Fully_Paid": 542
          },
          {
              "year": 2014,
              "Charged_Off": 110,
              "Fully_Paid": 482
          },
          {
              "year": 2015,
              "Charged_Off": 24,
              "Fully_Paid": 224
          }],
          "VA":[
          {
              "year": 2007,
              "Charged_Off": 2,
              "Fully_Paid": 14
          },
          {
              "year": 2008,
              "Charged_Off": 6,
              "Fully_Paid": 56
          },
          {
              "year": 2009,
              "Charged_Off": 18,
              "Fully_Paid": 149
          },
          {
              "year": 2010,
              "Charged_Off": 48,
              "Fully_Paid": 404
          },
          {
              "year": 2011,
              "Charged_Off": 100,
              "Fully_Paid": 545
          },
          {
              "year": 2012,
              "Charged_Off": 250,
              "Fully_Paid": 1275
          },
          {
              "year": 2013,
              "Charged_Off": 468,
              "Fully_Paid": 1736
          },
          {
              "year": 2014,
              "Charged_Off": 440,
              "Fully_Paid": 1636
          },
          {
              "year": 2015,
              "Charged_Off": 106,
              "Fully_Paid": 689
          }],
          "VT":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 4
          },
          {
              "year": 2009,
              "Charged_Off": 1,
              "Fully_Paid": 3
          },
          {
              "year": 2010,
              "Charged_Off": 1,
              "Fully_Paid": 12
          },
          {
              "year": 2011,
              "Charged_Off": 4,
              "Fully_Paid": 28
          },
          {
              "year": 2012,
              "Charged_Off": 20,
              "Fully_Paid": 98
          },
          {
              "year": 2013,
              "Charged_Off": 14,
              "Fully_Paid": 60
          },
          {
              "year": 2014,
              "Charged_Off": 27,
              "Fully_Paid": 110
          },
          {
              "year": 2015,
              "Charged_Off": 3,
              "Fully_Paid": 43
          }],
          "WA":[
          {
              "year": 2007,
              "Charged_Off": 1,
              "Fully_Paid": 11
          },
          {
              "year": 2008,
              "Charged_Off": 7,
              "Fully_Paid": 22
          },
          {
              "year": 2009,
              "Charged_Off": 14,
              "Fully_Paid": 90
          },
          {
              "year": 2010,
              "Charged_Off": 35,
              "Fully_Paid": 188
          },
          {
              "year": 2011,
              "Charged_Off": 67,
              "Fully_Paid": 361
          },
          {
              "year": 2012,
              "Charged_Off": 195,
              "Fully_Paid": 967
          },
          {
              "year": 2013,
              "Charged_Off": 324,
              "Fully_Paid": 1419
          },
          {
              "year": 2014,
              "Charged_Off": 288,
              "Fully_Paid": 1302
          },
          {
              "year": 2015,
              "Charged_Off": 55,
              "Fully_Paid": 569
          }],
          "WI":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 10
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 11
          },
          {
              "year": 2009,
              "Charged_Off": 5,
              "Fully_Paid": 46
          },
          {
              "year": 2010,
              "Charged_Off": 23,
              "Fully_Paid": 116
          },
          {
              "year": 2011,
              "Charged_Off": 35,
              "Fully_Paid": 186
          },
          {
              "year": 2012,
              "Charged_Off": 88,
              "Fully_Paid": 469
          },
          {
              "year": 2013,
              "Charged_Off": 176,
              "Fully_Paid": 678
          },
          {
              "year": 2014,
              "Charged_Off": 169,
              "Fully_Paid": 719
          },
          {
              "year": 2015,
              "Charged_Off": 40,
              "Fully_Paid": 307
          }],
          "WV":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 2
          },
          {
              "year": 2009,
              "Charged_Off": 3,
              "Fully_Paid": 17
          },
          {
              "year": 2010,
              "Charged_Off": 6,
              "Fully_Paid": 57
          },
          {
              "year": 2011,
              "Charged_Off": 12,
              "Fully_Paid": 69
          },
          {
              "year": 2012,
              "Charged_Off": 23,
              "Fully_Paid": 184
          },
          {
              "year": 2013,
              "Charged_Off": 55,
              "Fully_Paid": 282
          },
          {
              "year": 2014,
              "Charged_Off": 51,
              "Fully_Paid": 257
          },
          {
              "year": 2015,
              "Charged_Off": 9,
              "Fully_Paid": 110
          }],
          "WY":[
          {
              "year": 2007,
              "Charged_Off": 0,
              "Fully_Paid": 1
          },
          {
              "year": 2008,
              "Charged_Off": 0,
              "Fully_Paid": 0
          },
          {
              "year": 2009,
              "Charged_Off": 0,
              "Fully_Paid": 13
          },
          {
              "year": 2010,
              "Charged_Off": 1,
              "Fully_Paid": 27
          },
          {
              "year": 2011,
              "Charged_Off": 3,
              "Fully_Paid": 34
          },
          {
              "year": 2012,
              "Charged_Off": 13,
              "Fully_Paid": 104
          },
          {
              "year": 2013,
              "Charged_Off": 31,
              "Fully_Paid": 141
          },
          {
              "year": 2014,
              "Charged_Off": 25,
              "Fully_Paid": 149
          },
          {
              "year": 2015,
              "Charged_Off": 9,
              "Fully_Paid": 51
          }]
      
      }
    
    }); // end am4core.ready()