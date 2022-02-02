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
              const padding = 80;

              /*constants for legend*/
              const legendXAxisTicks = 10;
              const legendChartWidth = chartWidth*0.3;
              /*bar width is calculated at the end, once legend temperature array is created*/
              const chartBarHeight = 20;

              /*Month array for axis labeling*/
              const monthNames = ["January","February","March","April","May","June","July", "August","September","October","November","December"];

              /*DATA PROCESSING FOR HEAT MAP*/
              const dataArray = [...jsonDATA["monthlyVariance"]];
              
              /*generate data set for temperature legend and other descriptive elements*/
              let minimumTemp = Math.floor(d3.min(dataArray, (data)=>data["variance"]));
              let maximumTemp = Math.ceil(d3.max(dataArray, (data)=>data["variance"]));
              let temporaryArray = [];
              let temporaryFunction = ()=>{
                     let i = minimumTemp;
                     do{
                            temporaryArray.push(i);
                            i=i+1;
                     } while(i<maximumTemp);
              };
              temporaryFunction();
              const legendTemperatureData = [...temporaryArray];

              let startYear = d3.min(dataArray, data=>data["year"]);
              let endYear = d3.max(dataArray, data=>data["year"]);
              
              /*DATA PROCESSING FOR HEAT MAP END*/

              /*Function for generating bar colours*/

              const temperatureColorValue = function(){

              };

              /*Create blank SVG element for heatmap*/
              const svg = d3.select("#heat-map")
                     .append("svg")
                     .attr("width", chartWidth)
                     .attr("height", chartHeight)
                     .attr("id", "grafikas");

              /*create g element for legend*/
              const svgLegend = d3.select("#legenda")
                     .append("g")
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
              .text("Monthly Global Land-Surface Temperature")
              .attr("x", chartWidth/2)
              .attr("y", padding/2)
              .attr("id", "title")
              .attr("text-anchor", "middle");

              /*Add a Description*/
             svg.append("text")
             .text("Base temperature between " + startYear + " and " + endYear + " is: " + jsonDATA["baseTemperature"] + " C" + "\u00B0")
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
                     d3.max(dataArray, (data)=>data["year"])])
                     .range([padding, chartWidth - padding]);

              const heatMapYScale = d3.scaleLinear()
                     .domain([0, 11])
                     .range ([heatMapHeight - padding, padding]);

              /*scale for temperature indication as color*/
              const temperatureColorScaleAxis = d3.scaleLinear()
              .domain([minimumTemp, maximumTemp])
              /*rgb color range 0-255*/
              .range([0, 255]);
              /*Scale for negative and positive temperatures*/
              const temperatureColorScalePOS = d3.scaleLinear()
              .domain([0, maximumTemp])
              .range([255, 0]);
              const temperatureColorScaleNEG = d3.scaleLinear()
              .domain([0, minimumTemp])
              .range([255, 0]);

              /*let's calculate heat map bar width and height*/
              const barWidth = (chartWidth-padding*2)/(d3.max(dataArray, (data)=>data["year"]) - d3.min(dataArray, (data)=>data["year"]));
              /*offset is half the height of a bar - to center it along Y labels when positioning on heat map*/
              const barYPositionOffset = ((heatMapHeight-padding*2)/12)/2;
              const barHeight =  barYPositionOffset*2;
              const barHeightPx =  barHeight + "px";

              const setTempColor = (tempVariance)=>{
                     let selector = "";
                     if(tempVariance > 0){
                            selector = "POS";
                     } else {
                            selector = "NEG";
                     };

                     switch(selector){
                            case "POS":
                                   return "rgb(255," + temperatureColorScalePOS(tempVariance) + ", 0)";
                            case "NEG":
                                   return "rgb(0," + temperatureColorScaleNEG(tempVariance) + ", 255)";
                            default:
                                   return "rgb(0,255,255)";
                     };
              };

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
                            return heatMapXScale(data["year"])-barWidth/2;
                     })
                     .attr("y", (data)=>{
                            return heatMapYScale(data["month"]-1)-barHeight/2;
                     })
                     /*add year and month as attributes to use on tooltip*/
                     .attr("data-year", (data)=>data["year"])
                     .attr("data-month", (data)=>data["month"]-1)
                     .attr("data-temp", (data)=>data["variance"])
                     
                     /*Setting up tooltip in a way so it passes the freeCodeCamp tooltip test*/
                     .on("mouseover", (pelesEvent)=>{

                            toolTip
                                   .transition()
                                   .duration(100)
                                   .style("opacity", 0.9);

                            toolTip
                                   .html("Temperature: " + (Math.round((jsonDATA["baseTemperature"]*1+pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue*1)*100)/100) + "</br>" + (pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue*1>=0?"+"+pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue:pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue) + "</br>Date: " + pelesEvent.target.attributes.getNamedItem("data-year").nodeValue + "-" + pelesEvent.target.attributes.getNamedItem("data-month").nodeValue)
                                   .style("position", "fixed")
                                   .style("background-color", "white")
                                   /*for width 19ch comes from 19 character in longest line: "Temperature: xx.xx"*/
                                   .style("width", "19ch")
                                   .style("border-radius", "5px")
                                   .style("box-shadow", "0px 5px 10px rgba(44, 72, 173, 0.5)")
                                   /*tooltip positioning by getting data from mouseover event target*/
                                   .style("margin-left", pelesEvent.layerX + "px")
                                   .style("Top",  (pelesEvent.layerY-80) + "px");

                            toolTip
                                   .attr("data-temp", pelesEvent.target.attributes.getNamedItem("data-temp").nodeValue)
                                   .attr("data-year", pelesEvent.target.attributes.getNamedItem("data-year").nodeValue);
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
              const legendXAxis = d3.axisBottom(temperatureColorScaleAxis);

              xAxis.ticks(10)
              .tickFormat(year =>{
                     return year;
              });
              yAxis.ticks(12)
              .tickFormat(monthNumber => {
                     if(monthNumber < 12 && monthNumber >= 0){
                            return monthNames[monthNumber];
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
              .attr("transform","translate(" + (padding-barWidth/2) + "," + 0 + ")")
              .attr("id", "y-axis")
              .call(yAxis);

              /*Generate legend*/

              svg.append("g")
              .attr("id", "legend")
              .append("g")
              .attr("transform", "translate(" + padding + "," + (chartHeight - padding-barYPositionOffset) + ")")
              .attr("id", "legend-axis")
              .call(legendXAxis)
              .selectAll("text")
              .attr("transform", "translate(-20,10) rotate(-90)");

              const legendChartBarWidth = (temperatureColorScaleAxis(d3.max(legendTemperatureData))-temperatureColorScaleAxis(d3.min(legendTemperatureData)))/legendTemperatureData.length;

              d3.select("#legend")
                     .selectAll("#legend-bars")
                     .data(legendTemperatureData)
                     .enter()
                     .append("rect")
                     .attr("id", "legend-bar")
                     .attr("width", legendChartBarWidth)
                     .attr("height", chartBarHeight)
                     .style("fill", (data)=>setTempColor(data))
                     .attr("x", (data)=>{
                            return temperatureColorScaleAxis(data)+padding-legendChartBarWidth/2;
                     })
                     .attr("y", chartHeight-chartBarHeight-padding-barYPositionOffset);
       };
});