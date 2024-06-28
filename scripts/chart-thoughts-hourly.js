function createChart_ThoughtsHourly(canvasId, chartData){
    var data = getThoughtsData();

    // Parse the datetime strings into Date objects
    var parsedData = chartData.map(d => new Date(d.thoughtOn));

    // Determine the range of dates in the dataset
    var minDate = d3.min(parsedData);
    var maxDate = d3.max(parsedData);

    // Format the date range for the title
    var formatTime = d3.timeFormat("%Y-%m-%d");
    var dateRange = formatTime(minDate) + " to " + formatTime(maxDate);

    // Group data by the hour and count the occurrences
    var hourCounts = d3.rollup(parsedData, v => v.length, d => d.getHours());

    // Convert the Map to an array of objects for easier use with D3
    var summarizedData = Array.from(hourCounts, ([key, value]) => ({ key: key, value: value }));
    summarizedData.sort((a, b) => a.key - b.key);

    var margin = { top: 20, right: 20, bottom: 30, left: 20 },
        width = 1000 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(summarizedData.map(d => d.key))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(summarizedData, d => d.value)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    var xAxis = d3.axisBottom(x).tickFormat(d3.format("02d"));
    var yAxis = d3.axisLeft(y);

    var svg = d3.select("#" + canvasId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis)
        .append("text")
        .attr("x", width - margin.right)
        .attr("y", -6)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Hour");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis)
        .append("text")
        .attr("x", 6)
        .attr("dy", "0.75em")
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .text(dateRange);

    svg.selectAll(".bar")
        .data(summarizedData)
        .enter().append("rect")
        .attr("fill", "steelblue")
        .attr("x", d => x(d.key))
        .attr("y", d => y(d.value))
        .attr("width", x.bandwidth())
        .attr("height", d => y(0) - y(d.value));
}