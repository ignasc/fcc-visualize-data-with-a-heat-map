/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
       req.send();
       req.onload = function(){
              const jsonDATA = JSON.parse(req.responseText);
              
              const pageWidth  = document.documentElement.scrollWidth;
              const chartWidth = pageWidth<1024? 1024:pageWidth*0.8;
              const chartHeight = 500;
              const padding = 60;

              /*Month array for axis labeling*/
              const monthNames = ["January","February","March","April","May","June","July", "August","September","October","November","December"];

              /*Some functions for returning proper data*/
              const returnYear = (jsonObject) => {
                     return jsonObject["year"];
              };
              const returnMonth = (jsonObject) => {
                     return jsonObject["month"];
              };
              const returnVariance = (jsonObject) => {
                     return jsonObject["variance"];
              };

              /*DATA PROCESSING FOR HEAT MAP*/
              const dataArray = [...jsonDATA["monthlyVariance"]];
              /*const tempDataArray = [
                     jsonDATA["monthlyVariance"][0],
                     jsonDATA["monthlyVariance"][50],
                     jsonDATA["monthlyVariance"][500]
              ];*/
              
              /*DATA PROCESSING FOR HEAT MAP END*/

              /*Create blank SVG element*/
              const svg = d3.select("#heat-map")
                     .append("svg")
                     .attr("width", chartWidth)
                     .attr("height", chartHeight)
                     .attr("id", "grafikas");
              
              /*Center SVG element*/
              d3.select("#heat-map")
              .style("margin-left", (d)=>{
                    if(pageWidth - chartWidth <=0) {
                           return 0 + "px";
                    };
                    return (pageWidth - chartWidth)/2 + "px";
             })
             .style("max-width", chartWidth + "px")
             .style("margin-top", "20px");

             /*Add a Title*/
             svg.append("text")
              .text("Heat Map Title")
              .attr("x", chartWidth/2)
              .attr("y", padding/2)
              .attr("id", "title")
              .attr("text-anchor", "middle");

              /*Define main heat map scales*/
              
             const heatMapXScale = d3.scaleLinear()
                     .domain([d3.min(dataArray, (data)=>data["year"]),
                     d3.max(dataArray, (data)=>data["year"])+5])
                     .range([padding, chartWidth - padding]);

              const heatMapYScale = d3.scaleLinear()
                     .domain([13, 1])
                     .range ([chartHeight - padding, padding]);

              /*scale for temperature indication as color*/
              const temperatureColorScale = d3.scaleLinear()
              .domain([d3.min(dataArray, (data)=>data["variance"]),
              d3.max(dataArray, (data)=>data["variance"])])
              /*color hue range yellow to red (60 - 0)*/
              .range([60, 0]);

              /*let's calculate heat map bar width and height*/
              const barWidth = (chartWidth-padding*2)/(d3.max(dataArray, (data)=>data["year"]) - d3.min(dataArray, (data)=>data["year"])) + "px";
              /*offset is half the height of a bar - to center it when positioning on heat map*/
              const barYPositionOffset = ((chartHeight-padding*2)/12)/2;
              const barHeight =  barYPositionOffset*2 + "px";

              const setTempColor = (tempVariance)=>{
                     return "hsl(" + temperatureColorScale(tempVariance) + ", 100%, 50%";
              };

              svg.selectAll("rect")
                     .data(dataArray)
                     .enter()
                     .append("rect")
                     .attr("id", "heat-map-bar")
                     .attr("width", barWidth)
                     .attr("height", barHeight)
                     .style("fill", (data)=>setTempColor(data["variance"]))
                     .attr("x", (data)=>{
                            return heatMapXScale(data["year"]);
                     })
                     .attr("y", (data)=>{
                            return heatMapYScale(data["month"])-barYPositionOffset;
                     });

              /*Generate X and Y axis with labels*/
              const xAxis = d3.axisBottom(heatMapXScale);
              const yAxis = d3.axisLeft(heatMapYScale);

              xAxis.ticks(10);
              yAxis.ticks(13)
              .tickFormat(monthNumber => {
                     if(monthNumber < 13){
                            return monthNames[monthNumber-1];
                     } else {
                            return "";
                     }
              });

              svg.append("g")
              .attr("transform", "translate(0," + (chartHeight - padding-barYPositionOffset) + ")")
              .attr("id", "x-axis")
              .call(xAxis)
              .selectAll("text")
              .attr("transform", "translate(-20,10) rotate(-45)");

              svg.append("g")
              .attr("transform","translate(" + padding + ",0)")
              .attr("id", "y-axis")
              .call(yAxis);
             
             /*DEBUG*/
              console.log(dataArray[0]);


       };
});