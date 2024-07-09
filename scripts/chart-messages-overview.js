function createChart_MessagesOverview(canvasId, chartData){
    const dataSummaryAllObject = {};
    const dataSummaryMarekObject = {};
    const dataSummaryKatkaObject = {};

    chartData.forEach(entry => {
        const { Date, WordCount } = entry;
        if (dataSummaryAllObject[Date]) {
            dataSummaryAllObject[Date] += WordCount;
        } else {
            dataSummaryAllObject[Date] = WordCount;
        }
    });
    const dataSummaryAllArray = Object.keys(dataSummaryAllObject).map(x => ({
        Date: x,
        WordCount: dataSummaryAllObject[x]
    }));

    chartData.forEach(entry => {
        const { Date, Sender, WordCount } = entry;
        if (Sender == "Marek") {
            if (dataSummaryMarekObject[Date]) {
                dataSummaryMarekObject[Date] += WordCount;
            } else {
                dataSummaryMarekObject[Date] = WordCount;
            }
        }
    });
    const dataSummaryMarekArray = Object.keys(dataSummaryMarekObject).map(x => ({
        Date: x,
        WordCount: dataSummaryMarekObject[x]
    }));

    chartData.forEach(entry => {
        const { Date, Sender, WordCount } = entry;
        if (Sender == "Katka") {
            if (dataSummaryKatkaObject[Date]) {
                dataSummaryKatkaObject[Date] += WordCount;
            } else {
                dataSummaryKatkaObject[Date] = WordCount;
            }
        }
    });
    const dataSummaryKatkaArray = Object.keys(dataSummaryKatkaObject).map(x => ({
        Date: x,
        WordCount: dataSummaryKatkaObject[x]
    }));


    const width = 1000; // width of the chart
    const cellSize = 17; // height of a day
    const height = cellSize * 9; // height of a week (7 days + padding)

    // Define formatting functions for the axes and tooltips.
    const formatValue = d3.format("+.2%");
    const formatDate = d3.utcFormat("%x");
    const formatDay = i => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i];
    const formatMonth = d3.utcFormat("%b");

    // Helpers to compute a day’s position in the week.
    const timeWeek = d3.utcMonday; 
    const countDay = i => (i + 6) % 7;

    function updateChart(dataset) {

        const data = dataset.map(item => ({
            date: new Date(item.Date),
            value: item.WordCount,
            sender: item.Sender
        })).sort((a,b) => a.date - b.date);

        // const data = chartData;

        // Compute the extent of the value, ignore the outliers
        // and define a diverging and symmetric color scale.
        const max = d3.quantile(dataSummaryAllArray, 0.95, d => Math.abs(d.WordCount));
        const color = d3.scaleSequential(d3.interpolateGreens).domain([-max/4, +max]);

        // Group data by year, in reverse input order. (Since the dataset is chronological,
        // this will show years in reverse chronological order.)
        const dataYears = data.map(x => x.date.getFullYear());
        const minYear = Math.min(...dataYears);
        const maxYear = Math.max(...dataYears);
        
        let fullData = [];
        for (let year = minYear; year <= maxYear; year++) {
            for (let month = 1; month <= 12; month++) {
                fullData.push({ date: new Date(year, month, 1), value: 0 });
            }
        }

        fullData = fullData.concat(data);
        
        const groupedYears = d3.groups(fullData, d => d.date.getUTCFullYear());       
        const years = groupedYears.sort((a, b) => b[0] - a[0]);

        // A function that draws a thin white line to the left of each month.
        function pathMonth(t) {
            const d = Math.max(0, Math.min(7, countDay(t.getUTCDay())));
            const w = timeWeek.count(d3.utcYear(t), t);
            return `${d === 0 ? `M${w * cellSize},0`
                    : d === 7 ? `M${(w + 1) * cellSize},0`
                    : `M${(w + 1) * cellSize},0V${d * cellSize}H${w * cellSize}`}V${7 * cellSize}`;
        }

        // The chart canvas
        const svg = d3.create("svg")
            .attr("width", width)
            .attr("height", height * years.length)
            .attr("viewBox", [0, 0, width, height * years.length])
            .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

        // The entire year section
        const year = svg.selectAll("g")
            .data(years)
            .join("g")
            .attr("transform", (d, i) => `translate(40.5,${height * i + cellSize * 1.5})`);

        // Year text (2024, etc.)
        year.append("text")
            .attr("x", -5)
            .attr("y", -5)
            .attr("font-size", "13")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(([key]) => key);

        // Weekday text
        year.append("g")
            .attr("text-anchor", "end")
            .selectAll()
            .data(d3.range(0, 7))
            .join("text")
            .attr("x", -5)
            .attr("y", i => (countDay(i) + 0.5) * cellSize)
            .attr("dy", "0.31em")
            .text(formatDay);

        // Items
        const items = year.append("g")
            .selectAll()
            .data(([, values]) => values.filter(d => d.value > 0))
            .join("rect")
            .attr("width", cellSize - 1)
            .attr("height", cellSize - 1)
            .attr("x", d => timeWeek.count(d3.utcYear(d.date), d.date) * cellSize + 0.5)
            .attr("y", d => countDay(d.date.getUTCDay()) * cellSize + 0.5)
            .attr("fill", d => color(d.value))
            .append("title") // Tooltip
            .text(d => `${formatDate(d.date)}
                        ${d.value}`); 
        
        const month = year.append("g")
            .selectAll()
            .data(([, values]) => d3.utcMonths(d3.utcMonth(values[0].date), values.at(11).date))
            .join("g");

        // Rectangle around calendar
        month.append("rect")
            .attr("fill", "none")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", cellSize * 53)
            .attr("height", cellSize * 7)
            .attr("stroke", "#000000")
            .attr("stroke-width", 1);

        // Line between months
        month.filter((d, i) => i).append("path")
            .attr("fill", "none")
            .attr("stroke", "#000000")
            .attr("stroke-width", 1)
            .attr("d", pathMonth);

        // Month text
        month.append("text")
            .attr("x", d => timeWeek.count(d3.utcYear(d), timeWeek.ceil(d)) * cellSize + 2)
            .attr("y", -5)        
            .text(formatMonth);

            document.getElementById(canvasId).innerHTML = "";
            document.getElementById(canvasId).append(svg.node());
    }

    // Initial render
    updateChart(dataSummaryAllArray);

    // Event listeners for buttons
    d3.select("#msgDataBoth").on("click", () => updateChart(dataSummaryAllArray));
    d3.select("#msgDataMarek").on("click", () => updateChart(dataSummaryMarekArray));
    d3.select("#msgDataKatka").on("click", () => updateChart(dataSummaryKatkaArray));

}