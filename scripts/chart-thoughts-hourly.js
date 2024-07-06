function createChart_ThoughtsHourly(canvasId, chartData){
    // Get 24 items of zeroes
    const finalData = Array(24).fill(0);

    // Get times from the array of datetime strings
    const hoursData = chartData.map(d => d.split("T")[1].split(":")[0]); // Split by 'T' and then by ':' to get the hour part
    const hoursGroupped = d3.rollup(hoursData, v => v.length, d => d)

    hoursGroupped.forEach((value, index) => {
        finalData[parseInt(index)] = value;
    });

    const margin = { top: 20, right: 60, bottom: 0, left: 40 },
          width = 1000 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .domain(finalData.map((_, i) => i))
        .range([margin.left, width - margin.right])
        .padding(0.1); // Affects thickness of bars

    var y = d3.scaleLinear()
        .domain([0, d3.max(finalData)])
        .nice()
        .range([height, margin.top]); // Inverted range for the y-axis

    var xAxis = d3.axisBottom(x).tickFormat(d3.format("02d"));
    var yAxis = d3.axisLeft(y);

    // The chart canvas
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")") // X-axis at the bottom
        .call(xAxis)
        .append("text")
        .attr("x", 70)
        .attr("y", 30)
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("Hour");

    svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + margin.left + ",0)") // Y-axis at the left
        .call(yAxis)
        .append("text")
        .attr("x", 6)
        .attr("dy", "0.75em")
        .attr("text-anchor", "start")
        .attr("fill", "black")
        .text("dateRange");

    svg.selectAll(".bar")
        .data(finalData)
        .enter().append("rect")
        .attr("fill", "steelblue")
        .attr("x", (_, i) => x(i))
        .attr("y", d => y(d))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d));

    
    document.getElementById(canvasId).append(svg.node());
}