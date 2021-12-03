am4core.ready(function() {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end
    
    var container = am4core.create("chartdiv-grade", am4core.Container);
    container.width = am4core.percent(100);
    container.height = am4core.percent(100);
    container.layout = "horizontal";
    
    
    var chart = container.createChild(am4charts.PieChart);
    
    // Add data
    chart.data = [{
      "grade": "Grade A",
      "litres": 512387228,
      "subData": [{ name: "Fully Paid", value: 512387228-17766758 }, { name: "Charge off", value: 17766758 }]
    }, {
      "grade": "Grade B",
      "litres": 933152643,
      "subData": [{ name: "Fully Paid", value: 933152643-74596494 }, { name: "Charge off", value: 74596494 }]
    }, {
      "grade": "Grade C",
      "litres": 859669130,
      "subData": [{ name: "Fully Paid", value: 859669130-123473239 }, { name: "Charge off", value: 123473239 }]
    }, {
      "grade": "Grade D",
      "litres": 570611396,
      "subData": [{ name: "Fully Paid", value: 570611396-117710580 }, { name: "Charge off", value: 117710580 }]
    }, {
      "grade": "Grade E",
      "litres": 334840820,
      "subData": [{ name: "Fully Paid", value: 334840820-91032016 }, { name: "Charge off", value: 91032016 }]
    }, {
      "grade": "Grade F",
      "litres": 145581117,
      "subData": [{ name: "Fully Paid", value: 145581117-48256861 }, { name: "Charge off", value: 48256861 }]
    }, {
      "grade": "Grade G",
      "litres": 409493668,
      "subData": [{ name: "Fully Paid", value: 409493668-14465537 }, { name: "Charge off", value: 14465537 }]
    }];
    
    // Add and configure Series
    var pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = "litres";
    pieSeries.dataFields.category = "grade";
    pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";
    
    pieSeries.slices.template.events.on("hit", function(event) {
      selectSlice(event.target.dataItem);
    })
    
    var chart2 = container.createChild(am4charts.PieChart);
    chart2.width = am4core.percent(30);
    chart2.radius = am4core.percent(80);
    
    // Add and configure Series
    var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
    pieSeries2.dataFields.value = "value";
    pieSeries2.dataFields.category = "name";
    pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
    //pieSeries2.labels.template.radius = am4core.percent(50);
    //pieSeries2.labels.template.inside = true;
    // pieSeries2.labels.template.fill = am4core.color("#ffffff");
    pieSeries2.labels.template.disabled = true;
    pieSeries2.ticks.template.disabled = true;
    pieSeries2.alignLabels = false;
    pieSeries2.events.on("positionchanged", updateLines);
    
    var interfaceColors = new am4core.InterfaceColorSet();
    
    var line1 = container.createChild(am4core.Line);
    line1.strokeDasharray = "2,2";
    line1.strokeOpacity = 0.5;
    line1.stroke = interfaceColors.getFor("alternativeBackground");
    // line1.stroke ='#de4c4f'
    line1.isMeasured = false;
    
    var line2 = container.createChild(am4core.Line);
    line2.strokeDasharray = "2,2";
    line2.strokeOpacity = 0.5;
    line2.stroke = interfaceColors.getFor("alternativeBackground");
    line2.isMeasured = false;
    
    var selectedSlice;
    
    function selectSlice(dataItem) {
    
      selectedSlice = dataItem.slice;
    
      var fill = selectedSlice.fill;
    
      var count = dataItem.dataContext.subData.length;
      pieSeries2.colors.list = [];
      for (var i = 0; i < count; i++) {
        pieSeries2.colors.list.push(fill.brighten(i * 2 / count));
      }

      pieSeries2.colors.list = [
        am4core.color("#bab5b8"),
        am4core.color("#827c7c")
      ];

      chart2.data = dataItem.dataContext.subData;
      pieSeries2.appear();
    
      var middleAngle = selectedSlice.middleAngle;
      var firstAngle = pieSeries.slices.getIndex(0).startAngle;
      var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
      animation.events.on("animationprogress", updateLines);
    
      selectedSlice.events.on("transformed", updateLines);
    
    //  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
    //  animation.events.on("animationprogress", updateLines)
    }
    
    
    function updateLines() {
      if (selectedSlice) {
        var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
        var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };
    
        p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
        p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);
    
        var p21 = { x: 0, y: -pieSeries2.pixelRadius };
        var p22 = { x: 0, y: pieSeries2.pixelRadius };
    
        p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
        p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);
    
        line1.x1 = p11.x;
        line1.x2 = p21.x;
        line1.y1 = p11.y;
        line1.y2 = p21.y;
    
        line2.x1 = p12.x;
        line2.x2 = p22.x;
        line2.y1 = p12.y;
        line2.y2 = p22.y;
      }
    }
    
    chart.events.on("datavalidated", function() {
      setTimeout(function() {
        selectSlice(pieSeries.dataItems.getIndex(0));
      }, 1000);
    });
    
    
    }); // end am4core.ready()