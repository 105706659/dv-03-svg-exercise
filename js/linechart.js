
(() => {
    "use strict";

    // Exercise 5.2 - Line Chart
    const csvPath = "data/ARE_Spot_Prices.csv";

    function drawLineChart(data) {

        // Set up margins and dimensions
        const margin = {
            top: 60,
            right: 35,
            bottom: 60,
            left: 70
        };

        const width = 1000;
        const height = 500;

        const innerWidth =
            width - margin.left - margin.right;

        const innerHeight =
            height - margin.top - margin.bottom;

        // Create SVG
        const container = d3.select("#line-chart");

        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Create inner chart
        const innerChart = svg.append("g")
            .attr(
                "transform",
                `translate(${margin.left}, ${margin.top})`
            );

        // Create x and y scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, innerWidth]);

        const yScale = d3.scaleLinear()
            .domain([
                0,
                d3.max(data, d => d.averagePrice) * 1.1
            ])
            .range([innerHeight, 0]);

        // Create axes
        const bottomAxis = d3.axisBottom(xScale)
            .ticks(10)
            .tickFormat(d3.format("d"));

        const leftAxis = d3.axisLeft(yScale)
            .ticks(6);

        // Add x-axis
        innerChart.append("g")
            .attr(
                "transform",
                `translate(0, ${innerHeight})`
            )
            .call(bottomAxis);

        // Add y-axis
        innerChart.append("g")
            .call(leftAxis);

        // Add y-axis label
        innerChart.append("text")
            .attr("x", 0)
            .attr("y", -25)
            .attr("font-size", 16)
            .text("Average Price ($ per MWh)");

        // Add x-axis label
        innerChart.append("text")
            .attr("x", innerWidth / 2)
            .attr("y", innerHeight + 48)
            .attr("text-anchor", "middle")
            .attr("font-size", 15)
            .text("Year");

        // Create line generator
        const lineGenerator = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.averagePrice));

        // Draw line
        innerChart.append("path")
            .datum(data)
            .attr("d", lineGenerator)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        // Draw scatter plot points
        innerChart.selectAll(".price-point")
            .data(data)
            .join("circle")
            .attr("class", "price-point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.averagePrice))
            .attr("r", 3.5)
            .attr("fill", "green")
            .append("title")
            .text(d =>
                `${d.year}: $${d.averagePrice.toFixed(2)}/MWh`
            );
    }

    // Load CSV
   
d3.csv(csvPath, d => ({
    year: Number(d.Year),
    averagePrice: Number(d["Average Price (notTas-Snowy)"])
}))

    .then(data => {

        // Filter and sort data
        data = data
            .filter(d =>
                Number.isFinite(d.year) &&
                Number.isFinite(d.averagePrice)
            )
            .sort((a, b) => a.year - b.year);

        console.table(data);

        if (data.length < 2) {
            throw new Error("No valid data");
        }

        drawLineChart(data);

    })
    .catch(error => {
        console.error("Exercise 5.2 error:", error);

        d3.select("#line-chart")
            .text("Could not load line chart.");
    });

})();
 