let windowwidth = document.documentElement["clientwidth"];

window.onresize = function(){
    location.reload();
}


queue()
   .defer(d3.csv, "salaries.csv")
   .await(makeGraph);

function makeGraph(error, transactionsData) {
    
   let ndx = crossfilter(transactionsData);
   
   let chartWidth = 300;
   if (windowwidth < 768){
       chartWidth = windowwidth;
   }
   else {
       chartWidth = windowwidth/5;
   }
   
   
   let genderDim = ndx.dimension(dc.pluck("sex"));
   
   let salaryByGender = genderDim.group().reduce(
       
       function(c, v){
           c.count++;
           c.total += +v.salary;
           c.average = c.total/ c.count;
           return c;
       },
       
       function(c, v){
        //   remove function, run once for each record
        // that's removed from the group
        
           c.count--;
           c.total -= +v.salary;
           c.average= c.total/c.count;
           return c;
           
       },
       
       function(){
           
        //   initialiser function. reffered to as c 
        // in the add and remove functions above
        
           return { count: 0, total:0, average: 0}
           
       });
       
       let salaryChart = dc.barChart("#salaryByGender");
       
       salaryChart
       .width(300)
       .height(150)
       .dimension(genderDim)
       .margins({top: 10, right: 20, bottom:50, left: 50})
       .group(salaryByGender)
       .valueAccessor(function(c){
           return c.value.average;
       })
       .x(d3.scale.ordinal())
       .xUnits(dc.units.ordinal)
       .xAxisLabel("gender")
       .yAxis().ticks(6);
       
       dc.renderAll();


 
    // let parseDate = d3.time.format("%d/%m/%Y").parse;

   // transactionsData.forEach(function(d) {
   //     d.date = parseDate(d.date);
   // });

   // let dateDim = ndx.dimension(dc.pluck("date"));

   // let minDate = dateDim.bottom(1)[0].date;
   // let maxDate = dateDim.top(1)[0].date;
   
   //   v= current record
   // c=initiate
   
   
   
//   creation of another chart

let salaryDim= ndx.dimension(dc.pluck("yrs.service"));
       let totalSalaryPerYear =salaryDim.group().reduceSum(dc.pluck("salary"));
       let yearsChart= dc.pieChart("#salary-chart");

   yearsChart
       .width(300)
       .radius(150)
       .dimension(salaryDim)
       .group(totalSalaryPerYear)
       .transitionDuration(1500)
       
       
       dc.renderAll();
       
       }


       


















