am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    // Create chart instance
    var chart = am4core.create("chartdiv-emp_length", am4charts.XYChart);
    chart.scrollbarX = new am4core.Scrollbar();

    // Add data
    chart.data = [{
        "country": "一年以下",
        "visits": 20886,
        "Charged Off": 3853
    }, {
        "country": "一年",
        "visits": 16856,
        "Charged Off": 2964
    }, {
        "country": "二年",
        "visits": 23561,
        "Charged Off": 4033
    }, {
        "country": "三年",
        "visits": 20380,
        "Charged Off": 3534
    }, {
        "country": "四年",
        "visits": 16197,
        "Charged Off": 2775
    }, {
        "country": "五年",
        "visits": 18059,
        "Charged Off": 3203
    }, {
        "country": "六年",
        "visits": 14753,
        "Charged Off": 2695
    }, {
        "country": "七年",
        "visits": 14085,
        "Charged Off": 2602
    }, {
        "country": "八年",
        "visits": 11849,
        "Charged Off": 2154
    }, {
        "country": "九年",
        "visits": 9567,
        "Charged Off": 1777
    }, {
        "country": "十年以上",
        "visits": 76881,
        "Charged Off": 13133
    }];

    prepareParetoData();

    function prepareParetoData() {
        var total = 0;

        for (var i = 0; i < chart.data.length; i++) {
            var value = chart.data[i].visits;
            total += value;
        }

        var sum = 0;
        for (var i = 0; i < chart.data.length; i++) {
            var value = chart.data[i].visits;
            sum += value;
            chart.data[i].pareto = sum / total * 100;
        }

        for (var i = 0; i < chart.data.length; i++) {
            chart.data[i].pareto = (chart.data[i]['Charged Off'] / chart.data[i].visits) * 100;

        }
    }

    // Create axes
    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "country";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.minGridDistance = 60;
    categoryAxis.tooltip.disabled = true;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.minWidth = 50;
    valueAxis.min = 0;
    valueAxis.cursorTooltipEnabled = false;

    // Create series
    var series = chart.series.push(new am4charts.ColumnSeries());
    series.sequencedInterpolation = true;
    series.dataFields.valueY = "visits";
    series.dataFields.categoryX = "country";
    series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
    series.columns.template.strokeWidth = 0;

    series.tooltip.pointerOrientation = "vertical";

    series.columns.template.column.cornerRadiusTopLeft = 10;
    series.columns.template.column.cornerRadiusTopRight = 10;
    series.columns.template.column.fillOpacity = 0.8;

    // on hover, make corner radiuses bigger
    var hoverState = series.columns.template.column.states.create("hover");
    hoverState.properties.cornerRadiusTopLeft = 0;
    hoverState.properties.cornerRadiusTopRight = 0;
    hoverState.properties.fillOpacity = 1;

    series.columns.template.adapter.add("fill", function (fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
    })


    var paretoValueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    paretoValueAxis.renderer.opposite = true;
    paretoValueAxis.min = 0;
    paretoValueAxis.max = 100;
    paretoValueAxis.strictMinMax = true;
    paretoValueAxis.renderer.grid.template.disabled = true;
    paretoValueAxis.numberFormatter = new am4core.NumberFormatter();
    paretoValueAxis.numberFormatter.numberFormat = "#'%'"
    paretoValueAxis.cursorTooltipEnabled = false;

    var paretoSeries = chart.series.push(new am4charts.LineSeries())
    paretoSeries.dataFields.valueY = "pareto";
    paretoSeries.dataFields.categoryX = "country";
    paretoSeries.yAxis = paretoValueAxis;
    paretoSeries.tooltipText = "呆帳率: {valueY.formatNumber('#.0')}%[/]";
    paretoSeries.bullets.push(new am4charts.CircleBullet());
    paretoSeries.strokeWidth = 2;
    paretoSeries.stroke = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    paretoSeries.strokeOpacity = 0.5;



    // Cursor
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = "panX";

}); // end am4core.ready()
