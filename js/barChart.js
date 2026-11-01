
(() => {
  "use strict";

  const csvPath = "data/tv_55inch_energy_Consumption.csv";

  function drawEnergyChart(data) {
    const margin = {
      top: 60, right: 35, bottom: 60, left: 70
    };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const container = d3.select("#bar-chart");
    container.selectAll("*").remove();

    const svg = container.append("svg")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const chart = svg.append("g")
      .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.Screen_Tech))
      .range([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([
        0,
        d3.max(data, d => d.Energy_Consumption) * 1.1
      ])
      .range([innerHeight, 0]);

    chart.append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0));

    chart.append("g")
      .call(d3.axisLeft(yScale).ticks(5));

    chart.append("text")
      .attr("x", 0)
      .attr("y", -25)
      .attr("font-size", 16)
      .text("Energy Consumption (kWh/year)");

    chart.selectAll(".energy-bar")
      .data(data)
      .join("rect")
      .attr("class", "energy-bar")
      .attr("x", d => xScale(d.Screen_Tech))
      .attr("y", d => yScale(d.Energy_Consumption))
      .attr("width", xScale.bandwidth())
      .attr("height", d =>
        innerHeight - yScale(d.Energy_Consumption))
      .attr("fill", "forestgreen");

    chart.selectAll(".energy-label")
      .data(data)
      .join("text")
      .attr("class", "energy-label")
      .attr("x", d =>
        xScale(d.Screen_Tech) + xScale.bandwidth() / 2)
      .attr("y", d =>
        yScale(d.Energy_Consumption) - 10)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .text(d =>
        `${d.Energy_Consumption.toFixed(1)} kWh`);
  }

  function start() {
    const container = document.querySelector("#bar-chart");

    if (!container) {
      console.error("Missing #bar-chart in HTML");
      return;
    }

    if (typeof d3 === "undefined") {
      console.error("D3.js is not loaded");
      return;
    }

    d3.csv(csvPath, row => ({
      Screen_Tech: (row.Screen_Tech || "").trim(),
      Energy_Consumption: Number(row.Energy_Consumption)
    }))
    .then(data => {
      const valid = data
        .filter(d =>
          d.Screen_Tech &&
          Number.isFinite(d.Energy_Consumption))
        .sort((a, b) =>
          b.Energy_Consumption - a.Energy_Consumption);

      if (valid.length === 0) {
        throw new Error("No valid CSV data");
      }

      console.table(valid);
      drawEnergyChart(valid);
    })
    .catch(error => {
      console.error("Error loading chart:", error);
      container.textContent = "Could not load CSV data.";
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
