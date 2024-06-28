function createChart_Timeline(canvasId, chartData){
    // Parse the datetime strings into Date objects
    var parsedData = chartData.map(d => new Date(d.thoughtOn));
    
    // Determine the range of dates in the dataset
    var minDate = d3.min(parsedData);
    var maxDate = d3.max(parsedData);

    // Format the date range for the title
    var formatTime = d3.timeFormat("%Y-%m-%d");
    var dateRange = formatTime(minDate) + " to " + formatTime(maxDate);

    // Summarize the data by count per day
    var counts = d3.rollups(
        parsedData,
        v => v.length,
        d => d3.timeDay(d)
    ).map(([key, value]) => ({ date: key, count: value }));

    // Sort the data by date
    counts.sort((a, b) => a.date - b.date);

    var margin = { top: 20, right: 30, bottom: 30, left: 40 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleTime()
        .domain(d3.extent(counts, d => d.date))
        .range([margin.left, width - margin.right]);

    var y = d3.scaleLinear()
        .domain([0, d3.max(counts, d => d.count)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%d.%m")); // Format tick labels as day.month

    var yAxis = d3.axisLeft(y);

    var line = d3.line()
        .curve(d3.curveMonotoneX) // This makes the line curved
        .x(d => x(d.date))
        .y(d => y(d.count));

    var svg = d3.select("#" + canvasId).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add horizontal grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat("")
        );

    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(xAxis);

    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(yAxis);

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

    svg.append("path")
        .datum(counts)
        .attr("class", "line")
        .attr("d", line);
}