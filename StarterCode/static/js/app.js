// Function to fetch data from the JSON file
function fetchData() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
    // Call function to create dropdown options
    createDropdown(data.names);

    // Call function to initialize dashboard with default sample
    updateDashboard(data.names[0], data);
  });
}

// Function to create dropdown options
function createDropdown(names) {
  var dropdown = d3.select("#selDataset");

  dropdown.selectAll("option")
    .data(names)
    .enter()
    .append("option")
    .attr("value", function(d) { return d; })
    .text(function(d) { return d; });
}

// Function to update dashboard elements based on selected sample
function updateDashboard(sample, data) {
  // Fetch data for selected sample
  console.log("Data")
  console.log(sample);
  console.log(data);
  var sampleData = data.samples.filter(item => item.id === sample);
  var metadata = data.metadata.filter(item => item.id === parseInt(sample));
  console.log("Filtered Data")
  console.log(sampleData)
  console.log(metadata)

  // Update demographic info
  updateDemographicInfo(metadata);

  // Update bar chart
  updateBarChart(sampleData);

  // Update bubble chart
  updateBubbleChart(sampleData);
}

// Function to update demographic info display
function updateDemographicInfo(metadata) {
  console.log("Updating Demographic Info...");
  console.log(metadata);
  var metadataPanel = d3.select("#sample-metadata");
  metadataPanel.html("");

  Object.entries(metadata[0]).forEach(([key, value]) => {
    metadataPanel.append("p").text(`${key}: ${value}`);
  });
}

// Function to update bar chart
function updateBarChart(sampleData) {
  console.log("Updating Bar Chart...");
  console.log(sampleData)
  var otuIds = sampleData[0].otu_ids.slice(0, 10).reverse();
  var sampleValues = sampleData[0].sample_values.slice(0, 10).reverse();
  var otuLabels = sampleData[0].otu_labels.slice(0, 10).reverse();

  var trace = {
    x: sampleValues,
    y: otuIds.map(id => `OTU ${id}`),
    text: otuLabels,
    type: "bar",
    orientation: "h"
  };

  var layout = {
    title: "Top 10 OTUs",
    yaxis: {
      automargin: true
    }
  };

  var data = [trace];

  Plotly.newPlot("bar", data, layout);
}

// Function to update bubble chart
function updateBubbleChart(sampleData) {
  console.log("Updating Bubble Chart...");
  console.log(sampleData)
  var trace = {
    x: sampleData[0].otu_ids,
    y: sampleData[0].sample_values,
    text: sampleData[0].otu_labels,
    mode: "markers",
    marker: {
      size: sampleData[0].sample_values,
      color: sampleData[0].otu_ids
    }
  };

  var layout = {
    title: "OTU Bubble Chart",
    xaxis: { title: "OTU ID" },
    yaxis: { title: "Sample Value" }
  };

  var data = [trace];

  Plotly.newPlot("bubble", data, layout);
}

// Function to handle dropdown change
function optionChanged(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then(function(data) {
    updateDashboard(sample, data);
  });
}

// Call the fetchData function to initialize the dashboard
fetchData();