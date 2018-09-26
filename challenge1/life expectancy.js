let windowwidth = document.documentElement["clientwidth"];

window.onresize = function() {
    location.reload();
}


queue()
    .defer(d3.csv, "life expectancy.csv")
    .await(makeGraph);

function makeGraph(error, transactionsData) {

    let ndx = crossfilter(transactionsData);

    let chartWidth = 300;
    if (windowwidth < 768) {
        chartWidth = windowwidth;
    }
    else {
        chartWidth = windowwidth / 5;
    }
    
    let yearDim = ndx.dimension(dc.pluck("year"));

    let male = yearDim.group().reduce(
    
       function(c, v){
           c.count++;
           c.total += +v.male;
           c.average = c.total/ c.count;
           return c;
       },
       
       function(c, v){
        //   remove function, run once for each record
        // that's removed from the group
        
           c.count--;
           c.total -= +v.male;
           c.average= c.total/c.count;
           return c;
           
       },
       
       function(){
           
        //   initialiser function. reffered to as c 
        // in the add and remove functions above
        
           return { count: 0, total:0, average: 0}
           
       });


    
    // let male = yearDim.group().reduceSum(dc.pluck("male"));
    
    let yearsChart = dc.barChart("#male-chart");
    
    

    yearsChart
        .width(2000)
        .height(600)
        .dimension(yearDim)
        .margins({top: 10, right: 40, bottom:80, left: 80})
        .group(male)
        .valueAccessor(function(c) {
            return c.value.average;
        })
        .transitionDuration(1500)
        //   .x(d3.time.scale().domain([minDate, maxdate]))
        .xAxisLabel("male")
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .renderHorizontalGridLines(true)
        .renderVerticalGridLines(true)
        .yAxis().ticks(8);

    let parseDate = d3.time.format("%d/%m/%Y").parse;

    transactionsData.forEach(function(d) {
        d.year = parseDate("01/01/" + d.year);
    });





// another chart creation


    let countryDim = ndx.dimension(dc.pluck("country"));

    let lifeFemale = countryDim.group().reduce(
        function(c, v) {
            // Add function, run once for each record
            // that's added to the group
            c.count++;
            c.total += +v.female;
            c.average = c.total / c.count;
            return c;
        },
        function(c, v) {
            // Remove function, run once for each record
            // that's removed from the group
            c.count--;
            c.total -= +v.female;
            c.average = c.total / c.count;
            return c;
        },
        function() {
            // Initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, average: 0 };
        });

    let lifeMale = countryDim.group().reduce(
        function(c, v) {
            // Add function, run once for each record
            // that's added to the group
            c.count++;
            c.total += +v.male;
            c.average = c.total / c.count;
            return c;
        },
        function(c, v) {
            // Remove function, run once for each record
            // that's removed from the group
            c.count--;
            c.total -= +v.male;
            c.average = c.total / c.count;
            return c;
        },
        function() {
            // Initialiser function. Referred to as c
            // in the add and remove functions above
            return { count: 0, total: 0, average: 0 };
        });
        
    let compChart = dc.compositeChart("#lifeByGender");
    
    compChart
        .width(500)
        .height(200)
        .margins({top: 10, right: 20, bottom: 50, left: 20})
        .dimension(countryDim)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .group(lifeFemale)
        .yAxisLabel("Life")
        .legend(dc.legend().x(40).y(40).itemHeight(13).gap(5))
        .compose([
            dc.lineChart(compChart)
            .colors("green")
            .group(lifeMale, "Male")
            .valueAccessor(function(c) {
                return c.value.average;
            })
            .renderArea(true),
            dc.lineChart(compChart)
            .colors("red")
            .group(lifeFemale, "Female")
            .valueAccessor(function(c) {
                return c.value.average;
            })
            .renderArea(true)
        ])
        .render()
        .yAxis().ticks(4);



    dc.renderAll();

}
