am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("chartdivtree", am4charts.SankeyDiagram);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = [
        {
            from: "資料筆數(162千筆)",
            to: "貸款利率<=5.508(T)",
            value: 97
        },
        {
            from: "資料筆數(162千筆)",
            to: "貸款利率<=5.508(F)",
            value: 65.1
        },
        {
            from: "貸款利率<=5.508(T)",
            to: "延遲滯金<=0.005(T)",
            value: 95
        },
        {
            from: "貸款利率<=5.508(T)",
            to: "延遲滯金<=0.005(F)",
            value: 2
        },
        {
            from: "延遲滯金<=0.005(T)",
            to: "貸款利率<=4.248(T)",
            value: 30
        },
        {
            from: "延遲滯金<=0.005(T)",
            to: "貸款利率<=4.248(F)",
            value: 65
        },
        {
            from: "貸款利率<=4.248(T)",
            to: "A:全額付清(0):效度(準確度 94.6%)_信度(發生機率17.2%)",
            value: 27.8
        },
        {
            from: "貸款利率<=4.248(F)",
            to: "B:全額付清(0):效度(準確度 87.4%)_信度(發生機率35.3%)",
            value: 57.3
        },
        {
            from: "延遲滯金<=0.005(F)",
            to: "核貸<=0.5(T)(0:部分,1:全額)",
            value: 1.7
        },
        {
            from: "延遲滯金<=0.005(F)",
            to: "核貸<=0.5(F)(0:部分,1:全額)",
            value: 0.3
        },
        {
            from: "核貸<=0.5(T)(0:部分,1:全額)",
            to: "C:全額付清(0):效度(準確度 53.8%)_信度(發生機率0.55%)",
            value: 0.9
        },
        {
            from: "核貸<=0.5(F)(0:部分,1:全額)",
            to: "D:呆帳(1):效度(準確度 64.2%)_信度(發生機率0.12%)",
            value: 0.2
        },

        {
            from: "貸款利率<=5.508(F)",
            to: "延遲滯金<=0.005(T)",
            value: 63
        },
        {
            from: "貸款利率<=5.508(F)",
            to: "延遲滯金<=0.005(F)",
            value: 2.1
        },
        {
            from: "延遲滯金<=0.005(T)",
            to: "利率<=6.447(T)",
            value: 43
        },
        {
            from: "延遲滯金<=0.005(T)",
            to: "利率<=6.447(F)",
            value: 20
        },
        {
            from: "延遲滯金<=0.005(F)",
            to: "分期<=0.5(T)(36m/60m)",
            value: 1.3
        },
        {
            from: "延遲滯金<=0.005(F)",
            to: "分期<=0.5(F)(36m/60m)",
            value: 0.8
        },
        {
            from: "利率<=6.447(T)",
            to: "E:全額付清(0):效度(準確度 78.3%)_信度(發生機率29.8%)",
            value: 33.7
        },
        {
            from: "利率<=6.447(F)",
            to: "F:全額付清(0):效度(準確度 66.7%)_信度(發生機率8.2%)",
            value: 13.3
        },
        {
            from: "分期<=0.5(T)(36m/60m)",
            to: "G:全額付清(0):效度(準確度 60.3%)_信度(發生機率0.5%)",
            value: 0.8
        },
        {
            from: "分期<=0.5(F)(36m/60m)",
            to: "H:呆帳(1):效度(準確度 79.2%)_信度(發生機率0.4%)",
            value: 0.7
        }
];

    let hoverState = chart.links.template.states.create("hover");
    hoverState.properties.fillOpacity = 0.6;

    chart.dataFields.fromName = "from";
    chart.dataFields.toName = "to";
    chart.dataFields.value = "value";

    // for right-most label to fit
    chart.paddingRight = 100;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.inert = true;
    nodeTemplate.readerTitle = "Drag me!";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.width = 30;

    // make nodes draggable
    var nodeTemplate = chart.nodes.template;
    nodeTemplate.readerTitle = "Click to show/hide or drag to rearrange";
    nodeTemplate.showSystemTooltip = true;
    nodeTemplate.cursorOverStyle = am4core.MouseCursorStyle.pointer

}); // end am4core.ready()
