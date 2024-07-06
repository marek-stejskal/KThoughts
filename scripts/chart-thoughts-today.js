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

    // Generate hourly points between the minimum and maximum times
    const startTime = parseTime("00:00:00");
    const endTime = parseTime("23:59:59"); //parseTime(new Date().toTimeString().split(" ")[0]); //d3.max(parsedData) //parseTime("23:59:59");
    const hourlyPoints = [];
    for (let t = startTime; t <= endTime; t.setHours(t.getHours() + 1)) {
        hourlyPoints.push(new Date(t));
    }

    // Merge hourly points with cumulative data
    let currentIndex = 0;
    const mergedData = hourlyPoints.map(hour => {
        while (currentIndex < cumulativeData.length && cumulativeData[currentIndex].time <= hour) {
            currentIndex++;
        }
        return {
            time: new Date(hour),
            count: currentIndex
        };
    });

    // Set up dimensions and margins
    const margin = { top: 20, right: 60, bottom: 0, left: 40 },
          width = 1000 - margin.left - margin.right,
          height = 300 - margin.top - margin.bottom;

    // The chart canvas
    const svg = d3.create("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom])
        .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

    // Define scales
    const x = d3.scaleTime()
        .domain([parseTime("00:00:00"), parseTime("23:59:59")])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(cumulativeData, d => d.count)])
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
        .datum(mergedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", line);

    document.getElementById(canvasId).append(svg.node());
}