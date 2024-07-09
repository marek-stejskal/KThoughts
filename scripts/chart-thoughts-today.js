function createChart_ThoughtsToday(canvasId, chartData){
    const svgTick = `
    <svg>
        <path d="M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z"
              id="path4"
              style="fill:#ff0707" />
    </svg>`
    
    // Parse datetime strings into Date objects
    const parseDate = d3.timeParse("%Y-%m-%dT%H:%M:%S");
    const parseTime = d3.timeParse("%H:%M:%S");

    // const parsedDates = chartData.map(d => parseDate(d)).sort(d3.ascending);
    const today = new Date();
    const parsedDates = chartData.map(d => parseDate(d)).sort(d3.ascending);
    const todayDates = parsedDates.filter(
        x => x.getFullYear() == today.getFullYear()
        && x.getMonth() == today.getMonth()
        && x.getDate() == today.getDate()
    );

    // Create a cumulative count
    const cumulativeData = todayDates.map((d, i) => ({
        time: parseTime(d.toTimeString().split(" ")[0]),
        count: i + 1
    }));

    // Set up dimensions and margins
    const margin = { top: 20, right: 60, bottom: 0, left: 40 },
          width = 1000 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    // The chart canvas
    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width, height + margin.top + margin.bottom])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Calculate the maximum value for the y-axis
    var maxDatasetValue = d3.max(cumulativeData, d => d.count)
    var yMax = maxDatasetValue < 20 ? 20 : maxDatasetValue;

    // Define scales
    const x = d3.scaleTime()
        .domain([parseTime("00:00:00"), parseTime("23:59:59")])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, yMax])
        .nice()
        .range([height - margin.bottom, margin.top]);
        
    // Add horizontal grid lines
    // svg.append("g")
    // .attr("class", "grid")
    // .attr("transform", "translate(" + margin.left + ",0)")
    // .call(d3.axisLeft(y)
    //     .tickSize(-width + margin.left)
    //     .tickFormat("")
    // );

    // Add vertical grid lines
    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(" + 0 + ",0)")
        .call(d3.axisBottom(x)
            .tickSize(height - margin.bottom)
            .tickFormat("")
        );

    // Define the line
    const line = d3.line().curve(d3.curveMonotoneX)
        .x(d => x(d.time))
        .y(d => y(d.count));

    // Append the x-axis
    svg.append("g")
        .attr("transform", "translate(0," + (height - margin.bottom) + ")")
        .call(d3.axisBottom(x).ticks(d3.timeHour.every(1)).tickFormat(d3.timeFormat("%H:%M")));

    // Append the y-axis
    svg.append("g")
        .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(y));

    // Append the path (line)
    svg.append("path")
        .datum(cumulativeData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);
    
        // Get the last data point
        const lastPoint = cumulativeData[cumulativeData.length - 1];
        // Get scale modifier
        const scaleModifier = 0.2;

        svg.append("path")
            .attr("d", "M 65,29 C 59,19 49,12 37,12 20,12 7,25 7,42 7,75 25,80 65,118 105,80 123,75 123,42 123,25 110,12 93,12 81,12 71,19 65,29 z")
            .attr("transform", `translate(${x(lastPoint.time) - 65 * scaleModifier}, ${y(lastPoint.count) - 59 * scaleModifier}) scale(${scaleModifier})`)
            .attr("fill", "#ff0707");

    document.getElementById(canvasId).append(svg.node());
}