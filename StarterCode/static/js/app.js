
//define the url 
const url = 'https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json';

// fetch data from url (then menthod is used to handle the promise returned by d3.json .) data is passed by the arrow function
d3.json(url)
  .then(data => {
    //log data for debugging
    console.log(data);
      // Function to create the bar chart on the selected sample 
    function createBarChart(sample) {
    //extract array with contains the information of the samples
      let samples = data.samples;
      //filter the sample array to find the entry matched in the selected sample id
      let results = samples.filter(id => id.id == sample);
      //slected the unique results ONLY
      let resultFirst = results[0];

      //extract for top 10 samples avalue from high to low 
      let sampleValues = resultFirst.sample_values.slice(0, 10).reverse();
      //maps each id to a string and stores it in otuIds vaurable 
      let otuIds = resultFirst.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
      //reverse the array storing it in the outLables variable 
      let otuLabels = resultFirst.otu_labels.slice(0, 10).reverse();

      //bar graph attribute

      let trace = {
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        type: 'bar',
        orientation: 'h'
      };
      //bar graph layout 

      let layout = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU IDs' }
      };

      //ploting the bar chart using plotly library
      let data = [trace];

    Plotly.newPlot('bar', data, layout);
  }

    // Function to create the bubble chart
    function createBubbleChart(sample) {
      let samples = data.samples;
      let results = samples.filter(id => id.id == sample);
      let resultFirst = results[0];

      let sampleValues = resultFirst.sample_values;
      let otuIds = resultFirst.otu_ids;
      let otuLabels = resultFirst.otu_labels;

      let trace = {
        x: otuIds,
        y: sampleValues,
        text: otuLabels,
        mode: 'markers',
        marker: {
          size: sampleValues,
          color: otuIds
        }
      };

      let layout = {
        title: 'OTU Bubble Chart',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
      };

      let data = [trace];

      Plotly.newPlot('bubble',data, layout);
    }
 
    // Function to display demographic info

    function displayDemographicInfo(sample) {
      let metadata = data.metadata;
      let results = metadata.filter(id => id.id == sample);
      let resultFirst = results[0];

      let demographicInfo = d3.select('#sample-metadata');
      demographicInfo.html('');
      
      Object.entries(resultFirst).forEach(([key, value]) => {
        demographicInfo.append('p').text(`${key}: ${value}`);
      });
    }

    // Function to update charts and demographic information based on new sample
    function updateChartsAndMetadata(selectedSample) {
      createBarChart(selectedSample);
      createBubbleChart(selectedSample);
      displayDemographicInfo(selectedSample);
    }

    // Get the first sample and update charts and metadata
    let firstSample = data.names[0];
    updateChartsAndMetadata(firstSample);

    // Select the dropdown menu element from the HTML
    let dropDownMenu = d3.select('#selDataset');

    // Populate dropdown menu with sample names
    data.names.forEach((name) => {
      dropDownMenu.append("option").text(name).property("value", name);
    });

    // Create an event listener for dropdown menu change
    dropDownMenu.on("change", function () {
      let selectedSample = d3.select(this).property("value");
      updateChartsAndMetadata(selectedSample);
    });
  })
  .catch(error => {
    // Handle errors if any occur during data fetching
    console.error('Error fetching data:', error);
  });
