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
              const chartHeight = 800;
              const heatMapHeight = chartHeight*0.8;
              const padding = 60;

              /*constants for legend*/
              const legendXAxisTicks = 5;

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
              
              /*generate data set for temperature legend*/
              let minimumTemp = d3.min(dataArray, (data)=>data["variance"]);
              let maximumTemp = d3.max(dataArray, (data)=>data["variance"]);
              let maxDifference = maximumTemp-minimumTemp;
              let temperatureStep = maxDifference/legendXAxisTicks;
              let temporaryArray = [];
              let temporaryFunction = ()=>{
                     console.log("function executed");
                     let i = minimumTemp;
                     do{
                            temporaryArray.push(i);
                            i=i+temperatureStep
                     } while(i<=maximumTemp+1);
              };
              temporaryFunction();
              const legendTemperatureData = [...temporaryArray];
              
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

              /*Add a Description*/
             svg.append("text")
             .text("Heat Map Title Description Goes Here")
             .attr("x", chartWidth/2)
             .attr("y", chartHeight - padding*2)
             .attr("id", "description")
             .attr("text-anchor", "middle");

              /*Tooltips for each scatter plot dot*/
              const toolTip = d3.select("body")
                     .append("div")
                     .attr("id", "tooltip")
                     .style("opacity", 0);

              /*Define main heat map scales*/
              
              const heatMapXScale = d3.scaleLinear()
                     .domain([d3.min(dataArray, (data)=>data["year"]),
                     d3.max(dataArray, (data)=>data["year"])+5])
                     .range([padding, chartWidth - padding]);

              const heatMapYScale = d3.scaleLinear()
                     .domain([12, 0])
                     .range ([heatMapHeight - padding, padding]);

              /*scale for temperature indication as color*/
              const temperatureColorScale = d3.scaleLinear()
              .domain([minimumTemp, maximumTemp])
              /*color hue range yellow to red (60 - 0)*/
              .range([60, 0]);

              /*let's calculate heat map bar width and height*/
              const barWidth = (chartWidth-padding*2)/(d3.max(dataArray, (data)=>data["year"]) - d3.min(dataArray, (data)=>data["year"])) + "px";
              /*offset is half the height of a bar - to center it along Y labels when positioning on heat map*/
              const barYPositionOffset = ((heatMapHeight-padding*2)/12)/2;
              const barHeight =  barYPositionOffset*2;
              const barHeightPx =  barHeight + "px";

              const setTempColor = (tempVariance)=>{
                     return "hsl(" + temperatureColorScale(tempVariance) + ", 100%, 50%";
              };

              svg.selectAll("#legend-bars")
                     .data(legendTemperatureData)
                     .enter()
                     .append("rect")
                     .attr("id", "legend-bar")
                     .attr("width", barWidth)
                     .attr("height", barHeight)
                     .style("fill", (data)=>setTempColor(data))
                     .attr("x", (data)=>{
                            return temperatureColorScale(data)+padding;
                     })
                     .attr("y", chartHeight-barHeight-padding-barYPositionOffset);

              svg.selectAll("rect")
                     .data(dataArray)
                     .enter()
                     .append("rect")
                     .attr("id", "heat-map-bar")
                     .attr("class", "cell")
                     .attr("width", barWidth)
                     .attr("height", barHeightPx)
                     .style("fill", (data)=>setTempColor(data["variance"]))
                     .attr("x", (data)=>{
                            return heatMapXScale(data["year"]);
                     })
                     .attr("y", (data)=>{
                            return heatMapYScale(data["month"])-barYPositionOffset;
                     })
                     /*add year and month as attributes to use on tooltip*/
                     .attr("data-year", (data)=>data["year"])
                     .attr("data-month", (data)=>data["month"])
                     .attr("data-temp", (data)=>data["variance"])
                     
                     /*Setting up tooltip in a way so it passes the freeCodeCamp tooltip test*/
                     .on("mouseover", (pelesEvent)=>{
                            console.log("mouseover:");
                            console.log(pelesEvent.layerX);

                            toolTip
                                   .transition()
                                   .duration(100)
                                   .style("opacity", 0.9);

                            toolTip
                                   .html("Temperature Variance: " + pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue + "</br>" + "Date: " + pelesEvent.target.attributes.getNamedItem("data-year").nodeValue + "-" + pelesEvent.target.attributes.getNamedItem("data-month").nodeValue)
                                   .style("position", "fixed")
                                   .style("background-color", "white")
                                   .style("width", "120px")
                                   .style("border-radius", "5px")
                                   .style("box-shadow", "0px 5px 10px rgba(44, 72, 173, 0.5)")
                                   /*tooltip positioning by getting data from mouseover event target*/
                                   .style("margin-left", pelesEvent.layerX + "px")
                                   .style("Top",  (pelesEvent.layerY + 100) + "px");

                            toolTip
                                   .attr("data-temp", pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue);
                     })
                     .on("mouseout", ()=>{
                            toolTip
                                   .transition()
                                   .duration(100)
                                   .style("opacity", 0);
                     });

              /*Generate X and Y axis with labels*/
              const xAxis = d3.axisBottom(heatMapXScale);
              const yAxis = d3.axisLeft(heatMapYScale);
              const legendXAxis = d3.axisBottom(temperatureColorScale);

              xAxis.ticks(10);
              yAxis.ticks(13)
              .tickFormat(monthNumber => {
                     if(monthNumber < 13){
                            return monthNames[monthNumber-1];
                     } else {
                            return "";
                     }
              });
              legendXAxis.ticks(legendXAxisTicks);

              svg.append("g")
              .attr("transform", "translate(0," + (heatMapHeight - padding + barHeight / 2) + ")")
              .attr("id", "x-axis")
              .call(xAxis)
              .selectAll("text")
              .attr("transform", "translate(-20,10) rotate(-45)");

              svg.append("g")
              .attr("transform","translate(" + padding + ",0)")
              .attr("id", "y-axis")
              .call(yAxis);

              svg.append("g")
              .attr("transform", "translate(" + padding + "," + (chartHeight - padding-barYPositionOffset) + ")")
              .attr("id", "legend-axis")
              .call(legendXAxis)
              .selectAll("text")
              .attr("transform", "translate(-20,10) rotate(-90)");

             
             /*DEBUG*/
              console.log(dataArray[0]);


       };
});