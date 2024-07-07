function createChart_ThoughtsTimeline(canvasId, chartData){
    const parseTime = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    const dates = chartData.map(t => d3.timeDay.floor(parseTime(t)));
    const datesGroupped = d3.rollup(dates, v => v.length, d => d);

    const [minDate, maxDate] = d3.extent(dates);

    const fullDateRange = d3.timeDays(minDate, d3.timeDay.offset(maxDate, 1));
    const finalData = fullDateRange.map(d => ({
        thoughtOn: d,
        thoughtCount: datesGroupped.get(d) || 0
    }));

    const margin = { top: 20, right: 60, bottom: 0, left: 40 },
          width = 1000 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .domain(d3.extent(finalData, d => d.thoughtOn))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(finalData, d => d.thoughtCount)])
        .nice()
        .range([height - margin.bottom, margin.top]);

    var xAxis = d3.axisBottom(x)
        .tickFormat(d3.timeFormat("%d.%m")); // Format tick labels as day.month

    var yAxis = d3.axisLeft(y);

    var line = d3.line()
        .curve(d3.curveMonotoneX) // This makes the line curved
        .x(d => x(d.thoughtOn))
        .y(d => y(d.thoughtCount));

    // The chart canvas
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

     // Add horizontal grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y)
            .tickSize(-width + margin.left)
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
        .text("dateRange");

    svg.append("path")
        .datum(finalData)
        .attr("class", "line")
        .attr("d", line);

    // Get the last data point
    const lastPoint = finalData[finalData.length - 1];
    // Get scale modifier
    const scaleModifier = 0.2;

    svg.append("path")
        .attr("d", "M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z")
        .attr("transform", `translate(${x(lastPoint.thoughtOn) - 65 * scaleModifier}, ${y(lastPoint.thoughtCount) - 59 * scaleModifier}) scale(${scaleModifier})`)
        .attr("fill", "#ff0707");
    
    document.getElementById(canvasId).append(svg.node());
}