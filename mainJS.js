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
                     d3.max(dataArray, (data)=>data["year"])])
                     .range([padding, chartWidth - padding]);

              const heatMapYScale = d3.scaleLinear()
                     .domain([13, 0])
                     .range ([chartHeight - padding, padding]);

              /*scale for temperature indication as color*/
              const temperatureColorScale = d3.scaleLinear()
              .domain([d3.min(dataArray, (data)=>data["variance"]),
              d3.max(dataArray, (data)=>data["variance"])])
              /*color hue range yellow to red (60 - 0)*/
              .range([60, 0]);

              /*let's calculate heat map bar width and height*/
              const barWidth = (chartWidth-padding*2)/(d3.max(dataArray, (data)=>data["year"]) - d3.min(dataArray, (data)=>data["year"])) + "px";
              const barHeight =  (chartHeight-padding*2)/12 + "px";

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
                            return heatMapYScale(data["month"]);
                     });
             
             /*DEBUG*/
              console.log(dataArray[0]);


       };
});