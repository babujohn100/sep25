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
.defer(d3.json, "transactionsData.json")
.await(makeCharts);

function makeCharts(error, transactionsData) {
    let ndx = crossfilter(transactionsData);
}

// let ndx = crossfilter(transactionsData);

// let nameDim = ndx.dimension(function(d){
//     return d.name;
// });

let nameDim = ndx.dimension(dc.pluck("name"));

let totalSpendperperson= nameDim.group().reduceSum(dc.pluck("spend"));

let spendChart = dc.barChart("#chart-goes-here");

spendChart
    .width(300)
    .height(150)
    .dimension(nameDim)
    .group(totalSpendperperson)
    .x(d3.scale.ordinal())
    .xUnits(dc.units.ordinal)
    .xAxisLabel("Person")
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
    

    
    dc.renderAll();
