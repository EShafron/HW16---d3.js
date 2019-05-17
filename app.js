// @TODO: YOUR CODE HERE!

// Initialize SVG Tag
var svgWidth = 880;
// X axis is 50 px below axes & bottom of svg area
var svgHeight = 530;

var margin = {
  top: 50,
  right: 50,
  bottom: 100,
  left: 90
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Function to create scales for X & Y axis
function createScale(dataset,xVar,yVar){

    // Pull arrays of relevant variables
    var xArray = dataset.map(d => d[xVar]);
    var yArray = dataset.map(d=> d[yVar]);
    var xDomain = [d3.min(xArray)*0.8, d3.max(xArray)*1.2];
    var xRange= [0,width];
    var yDomain= [d3.min(yArray)*0.8, d3.max(yArray)*1.2];
    var yRange= [height,0];
    var xScale = d3.scaleLinear().domain(xDomain).range(xRange);
    var yScale = d3.scaleLinear().domain(yDomain).range(yRange);
    return([xScale,yScale]);
};

// 1)
// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// 2)
// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, xVar, newYScale, yVar) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[xVar]))
    .attr("cy", d => newYScale(d[yVar]));

  return circlesGroup;
}

// 3)
function renderLabels(textGroup, newXScale, xVar, newYScale, yVar) {

  textGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[xVar]))
    .attr("y", d => newYScale(d[yVar]));
    
  return textGroup;
}

// State intial axis variables
var xVar='income';
var yVar='poverty';

// Read in the data
d3.csv("./assets/data/data.csv").then(function(data,err) {

    if (err) throw err;
    
    // Smart function for parsing Data
    // If the field contains a numeral, covert to a number
    var dataKeys=Object.keys(data[0]);

    data.forEach(function(d){
        for(i=0;i<dataKeys.length;i=i+1){
            // if d[datakeys[i]].includes()
            var conditions = ["1", "2", "3","4","5","6","7","8","9","0"];
            if (conditions.some(el => d[dataKeys[i]].includes(el))){
                // console.log("passed");
                d[dataKeys[i]] = +d[dataKeys[i]];
            }
        }
    })

    // Confirm
    // console.log(data[0]);

    
    // Initalize scales based on 2 obviously related variables
    var scales = createScale(data,xVar,yVar);
    var scaleX = scales[0];
    var scaleY = scales[1];

    // Intialize axes
    var bottomAxis = d3.axisBottom(scaleX);
    var leftAxis = d3.axisLeft(scaleY);

    // append x axis
    var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    var yAxis = chartGroup.append("g")
    .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => scaleX(d[xVar]))
        .attr("cy", d => scaleY(d[yVar]))
        .attr("r", 10)
        .attr("fill", "pink")
        .attr("opacity", "1");

    // Append labels to text
    var textLabels = chartGroup.append("g").selectAll("text")
    .data(data)                                
    .enter()
    .append("text")
    .attr("fill","black")
    // .classed('stateText',true)
    .attr("x", d => scaleX(d[xVar]))
    .attr("y", d => scaleY(d[yVar]))
    // .attr("y",d => console.log(d.abbr))
    .attr("font-size","8px")
    .attr("transform", "translate(-5, 3)")
    .text(d => d.abbr);
    
    // Add title to x axis
    // chartGroup.append("text")
    // .attr("x",width/2)
    // .attr("y",height+margin.bottom)
    // .attr("text-anchor","middle")
    // .attr("font-size","16px")
    // .attr("fill","black")
    // .text(`${xVar[0].toUpperCase()+xVar.slice(1)}`);

    // Append title to y axis
    // chartGroup.append("text")
    // .attr("transform", "rotate(-90)")
    // .attr("y", 0 - margin.left)
    // .attr("x", 0 - (height / 2))
    // .attr("dy", "1em")
    // .text(`${yVar[0].toUpperCase()+yVar.slice(1)}`);


  // ========== NEW CODE HERE ===========
  // Create group for  2 x- axis labels
  // 4)
  var labelsGroup = chartGroup.append("g")
  // .attr("transform", `translate(${width / 2}, ${height + 20})`);
  .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var labelsGroupY = chartGroup.append("g");

  // x-axis options:
  // income
  var incomeLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "income") // value to grab for event listener
  .classed("active", true)
  .text("State Median Income ($)");

  // age
  var ageLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 40)
  .attr("value", "age") // value to grab for event listener
  .classed("inactive", true)
  .text("State Median Age");

  // healthcare
  var healthcareLabel = labelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 60)
  .attr("value", "healthcare") // value to grab for event listener
  .classed("inactive", true)
  .text("Lacking Health Insurance (%)");

  // y-axis options:
  // poverty
  var povertyLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .classed("active", true)
  // .attr("x",20)
  // .attr("y",0)
  // .attr("value","poverty")
  .attr("value","poverty")
  .text("In Poverty (%)")

  // obesity
  var obesityLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left+20)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  // .attr("x",40)
  // .attr("y",0)
  // .attr("value","obesity")
  .classed("inactive", true)
  .attr("value","obesity")
  .text("Is Obese (%)")

  // smokes
  var smokesLabel = labelsGroupY.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left+40)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  // .attr("x",60)
  // .attr("y",0)
  // .attr("value","smokes")
  .classed("inactive", true)
  .attr("value","smokes")
  .text("Smokes (%)")

// append y axis
// chartGroup.append("text")
//   .attr("transform", "rotate(-90)")
//   .attr("y", 0 - margin.left)
//   .attr("x", 0 - (height / 2))
//   .attr("dy", "1em")
//   .classed("axis-text", true)
//   .text("Number of Billboard 500 Hits");

// x axis labels event listener
labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== xVar) {

      // replaces chosenXAxis with value
      xVar = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      var scales = createScale(data,xVar,yVar);
      var scaleX = scales[0];
      var scaleY = scales[1];

      // xLinearScale = xScale(hairData, xVar);

      // updates x axis with transition
      xAxis = renderAxes(scaleX, xAxis);

      yAxis =renderYAxes(scaleY, yAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, scaleX, xVar, scaleY, yVar);

      textLabels = renderLabels(textLabels, scaleX, xVar, scaleY, yVar);

          // changes classes to change bold text

    if (xVar == "income") {
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{};
    if (xVar == "age") {
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
      healthcareLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{};
    if (xVar=="healthcare")
    {
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
      healthcareLabel
        .classed("active", true)
        .classed("inactive", false);
    }
    else{};


      // changes classes to change bold text
      // if (chosenXAxis === "num_albums") {
      //   albumsLabel
      //     .classed("active", true)
      //     .classed("inactive", false);
      //   hairLengthLabel
      //     .classed("active", false)
      //     .classed("inactive", true);
      // }
      // else {
      //   albumsLabel
      //     .classed("active", false)
      //     .classed("inactive", true);
      //   hairLengthLabel
      //     .classed("active", true)
      //     .classed("inactive", false);
      // }
    }
  });

  // y axis labels event listener
  labelsGroupY.selectAll("text")
.on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== yVar) {

    // replaces chosenXAxis with value
    yVar = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    var scales = createScale(data,xVar,yVar);
    var scaleX = scales[0];
    var scaleY = scales[1];

    // xLinearScale = xScale(hairData, xVar);

    // updates x axis with transition
    xAxis = renderAxes(scaleX, xAxis);

    yAxis = renderYAxes(scaleY, yAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, scaleX, xVar, scaleY, yVar);

    textLabels = renderLabels(textLabels, scaleX, xVar, scaleY, yVar);


    if (yVar == "poverty") {
      povertyLabel
        .classed("active", true)
        .classed("inactive", false);
      obesityLabel
        .classed("active", false)
        .classed("inactive", true);
      smokesLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{};
    if (yVar == "obesity") {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        obesityLabel
        .classed("active", true)
        .classed("inactive", false);
        smokesLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else{};
    if (yVar=="smokes")
    {
      povertyLabel
        .classed("active", false)
        .classed("inactive", true);
        obesityLabel
        .classed("active", false)
        .classed("inactive", true);
        smokesLabel
        .classed("active", true)
        .classed("inactive", false);
    }
    else{};





  }
});

  });
  

  