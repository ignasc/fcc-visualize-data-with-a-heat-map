/*Load dataset from*/
/*https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json*/

document.addEventListener("DOMContentLoaded", function(){

       const req = new XMLHttpRequest();
       req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json',true);
       req.send();
       req.onload = function(){
              const jsonDATA = JSON.parse(req.responseText);
              console.log(jsonDATA);
              
              const chartWidth = 800;
              const chartHeight = 500;
              const pageWidth  = document.documentElement.scrollWidth;
              const padding = 60;

              /*DATA PROCESSING FOR HEAT MAP*/
              
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


       };
});