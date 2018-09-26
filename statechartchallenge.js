// let transactionsData = [
//             { "name": "Tom", "store": "ACME", "state": "NY", "spend": 100 },
//             { "name": "Tom", "store": "Big Co", "state": "NY", "spend": 200 },
//             { "name": "Bob", "store": "ACME", "state": "FL", "spend": 150 },
//             { "name": "Bob", "store": "ACME", "state": "NY", "spend": 200 },
//             { "name": "Bob", "store": "Big Co", "state": "FL", "spend": 75 },
//             { "name": "Bob", "store": "Big Co", "state": "NY", "spend": 50 },
//             { "name": "Alice", "store": "ACME", "state": "FL", "spend": 200 },
//             { "name": "Alice", "store": "Big Co", "state": "NY", "spend": 350 },
//         ];


queue()
    .defer(d3.json, "transactions.json")
    .await(makeCharts);

function makeCharts(error, transactionsData) {
    let ndx = crossfilter(transactionsData);


    let makeMyday = d3.time.format("%d/%m/%Y").parse;
    // console.log(makeMyday("26/09/2018"));

    transactionsData.forEach(function(d) {
        d.date = makeMyday(d.date);
    })

    let nameDim = ndx.dimension(dc.pluck("name"));

    let totalSpendperperson = nameDim.group().reduceSum(dc.pluck("spend"));

    let spendChart = dc.barChart("#salesman-chart");

    spendChart
        .width(300)
        .height(150)
        .dimension(nameDim)
        .group(totalSpendperperson)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Person")
         .elasticY(true)
        .yAxis().ticks(8)
       
        


    let storeDim = ndx.dimension(dc.pluck("store"));
    let totalSpendperstore = storeDim.group().reduceSum(dc.pluck("spend"));

    let storeChart = dc.barChart("#store-chart");

    storeChart
        .width(300)
        .height(150)
        .dimension(storeDim)
        .group(totalSpendperstore)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel("Person")
        .yAxis().ticks(8)
        
        let stateDim= ndx.dimension(dc.pluck("state"));
       let totalSpendPerState =stateDim.group().reduceSum(dc.pluck("spend"));
       let stateChart = dc.pieChart("#state-chart");

   stateChart
       .width(300)
       .radius(150)
       .dimension(stateDim)
       .group(totalSpendPerState)
       .transitionDuration(1500)
       // .x(d3.scale.ordinal())
       // .xUnits(dc.units.ordinal)
       // .xAxisLabel("state")
       // .yAxis().ticks(6)
        
        
        
        // creation of year chart


    let dateDim = ndx.dimension(dc.pluck("date"));

    let totalSpendbyDate = dateDim.group().reduceSum(dc.pluck("spend"));

    let yearChart = dc.lineChart("#year-chart");

    let minDate = dateDim.bottom(1)[0].date;
    let maxdate = dateDim.top(1)[0].date;

    // console.log(dateDim.bottom(1));
    
    // console.log(dateDim.bottom(1)[0].date);
    
    // console.log(dateDim.top(1)[0]);
    
     
     
     
     yearChart
        .width(1000)
        .height(300)
        .dimension(dateDim)
        .group(totalSpendbyDate)
        .x(d3.time.scale().domain([minDate, maxdate]))
        .xAxisLabel("Month")
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .yAxis().ticks(8)
        


    dc.renderAll();
}

