
(() => {
    "use strict";

    // Exercise 5.3 - Donut Chart
    const csvPath = "data/screensize_categories.csv";

    function drawDonutChart(data) {

        // Set up chart dimensions
        const width = 1000;
        const height = 500;

        const radius =
            Math.min(width, height) / 2 - 20;

        // Create SVG
        const container = d3.select("#donut-chart");

        container.selectAll("*").remove();

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width} ${height}`);

        // Move chart to the centre
        const innerChart = svg.append("g")
            .attr(
                "transform",
                `translate(${width / 2}, ${height / 2})`
            );

        // Create colour scale
        const color = d3.scaleOrdinal()
            .domain(data.map(d => d.Screensize_Category))
            .range(d3.schemeSet2);

        // Calculate slice angles
        const pie = d3.pie()
            .value(d => d.Count)
            .sort(null);

        // Create donut arcs
        const arcGenerator = d3.arc()
            .innerRadius(radius * 0.6)
            .outerRadius(radius);

        // Create slices
        const slices = innerChart
            .selectAll(".donut-slice")
            .data(pie(data))
            .join("g")
            .attr("class", "donut-slice");

        // Draw arcs
        slices.append("path")
            .attr("d", arcGenerator)
            .attr("fill", d =>
                color(d.data.Screensize_Category)
            )
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .append("title")
            .text(d =>
                `${d.data.Screensize_Category}: ${d.data.Count} TVs`
            );

        // Add labels
        slices.append("text")
            .attr("transform", d =>
                `translate(${arcGenerator.centroid(d)})`
            )
            .attr("text-anchor", "middle")
            .attr("dominant-baseline", "middle")
            .attr("font-size", 17)
            .attr("fill", "#1b1b1b")
            .text(d => d.data.Screensize_Category);
    }

    // Load data
    function start() {

        const container =
            document.querySelector("#donut-chart");

        if (!container) {
            console.error("Missing #donut-chart");
            return;
        }

        if (typeof d3 === "undefined") {
            console.error("D3.js is not loaded");
            return;
        }

        d3.csv(csvPath, row => ({
            Screensize_Category:
                (row.Screensize_Category || "").trim(),
            Count: Number(row.Count)
        }))
        .then(data => {

            const valid = data.filter(d =>
                d.Screensize_Category &&
                Number.isFinite(d.Count) &&
                d.Count > 0
            );

            if (valid.length === 0) {
                throw new Error("No valid CSV data");
            }

            console.table(valid);
            drawDonutChart(valid);

        })
        .catch(error => {
            console.error("Exercise 5.3 error:", error);

            container.textContent =
                "Could not load donut chart.";
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            start
        );
    } else {
        start();
    }
})();
