d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
  .then(data => getBar(data))
  .catch(error => console.error(error));

d3.select("body")
  .append("div")
  .attr("id", "title")
  .append("h1")
  .text("Monthly Global Land-Surface Temperature")
  .style("text-align", "center")

d3.select("body")
  .append("div")
  .attr("id", "description")
  .append("h2")
  .text("1753 - 2015: base temperature 8.66℃")
  .style("text-align", "center")

const getBar = (dataset) => {
    const w = dataset.monthlyVariance.length / 3;
    const h = 500;
    const padding = 80;
    const baseTemp = dataset.baseTemperature;
    const data = dataset.monthlyVariance;
    const minYear = d3.min(data, (d) => d.year);
    const maxYear = d3.max(data, (d) => d.year);

const svg = d3.select("body")
              .append("div")
              .attr("class", "svg-container")
              .append("svg")
              .attr("width", w)
              .attr("height", h)
              
const tooltip = d3.select(".svg-container")
                  .append("div")
                  .style("opacity", "0")
                  .style("background-color", "hsl(216 0% 80%)")

      svg.append("text")
         .attr("transform", "rotate(-90)")
         .attr("x", -250)
         .attr("y", 10)
         .text("Months")
      svg.append("text")
         .attr("transform", "translate(500, 460)")
         .text("Years")

const x = d3.scaleLinear()
            .domain([minYear, maxYear + 1])
            .range([padding, w - padding])

const y = d3.scaleTime()
            .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
            .range([padding, h - padding])

const xAxis = d3.axisBottom(x)
                .tickFormat(d3.format("d"))
const yAxis = d3.axisLeft(y)
                .tickFormat(d3.timeFormat("%B"))

     svg.append("g")
        .call(xAxis)
        .attr("id", "x-axis")
        .attr("transform", "translate(0, "+ (h - padding) +")")

    svg.append("g")
       .call(yAxis)
       .attr("id", "y-axis")
       .attr("transform", "translate("+ padding +", 0)")
       
    svg.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("class", "cell")
       .attr("fill", (d) => {
        const variance = d.variance;
            if (variance <= -1) {
                return "SteelBlue";
            } else if (variance <= 0) {
                return "LightBlue";
            } else if (variance <= 1) {
                return "Orange";
            } else {
                return "Crimson";
            }
       })
       .attr("data-year", (d) => d.year)
       .attr("data-month", (d) => d.month - 1)
       .attr("data-temp", (d) => d.variance + baseTemp)
       .attr("height", (h - (2 * padding)) / 12)
       .attr("y", (d) => y(new Date(0, d.month - 1, 0, 0, 0, 0, 0)))
       .attr("width", () => (w - (2 * padding)) / (maxYear - minYear))
       .attr("x", (d) => x(d.year))
       .on("mouseover", (event, d) => {
          let date = new Date(d.year, d.month);
          tooltip.style("opacity", "1")
                 .style("position", "absolute")
                 .style("left", event.pageX + "px")
                 .style("top", event.pageY - 50 + "px")
                 .style("pointer-events", "none")
                 .style("text-align", "center")
                 .style("padding", "10px")
                 .style("border-radius", "10px")
                 .attr("id", "tooltip")
                 .attr("data-year", d.year)

          tooltip.html(d.year + " - " + d3.timeFormat("%B")(new Date(0, d.month)) + "<br/>" + d3.format(".1f")(baseTemp + d.variance) + "&#8451;" + "<br/>" + d3.format(".1f")(d.variance) + "&#8451;")
        })
       .on("mouseout", () => {
        tooltip.style("opacity", "0")
      })
       
  const temp = data.map(d => d.variance);
  const minTemp = d3.min(temp);
  const maxTemp = d3.max(temp);
  const totalTemp = maxTemp - minTemp; 
  const xLegend = d3.scaleLinear()
                    .domain([d3.min(temp) - 1, d3.max(temp) + 2.7])
                    .range([padding, 300])
  const xLaxis = d3.axisBottom(xLegend)

    const legend = svg.append("g")
                        .attr("id", "legend")
    legend.append("g")
          .selectAll("rect")
          .data(temp)
          .enter()
          .append("rect")
          .attr("fill", (d) => {
            const variance = d;
               if (variance <= -1) {
                  return "SteelBlue";
                } else if (variance <= 0) {
                  return "LightBlue";
                } else if (variance <= 1) {
                  return "Orange";
                } else {
                  return "Crimson";
                }
              })
          .attr("temp", d => d)
          .attr("x", (d) => {
            return xLegend(d)
          })
          .attr("y", 470)
          .attr("width", totalTemp)
          .attr("height", 10)
    legend.append("g")
          .call(xLaxis)
          .attr("transform", "translate(0, "+ (h - 20) +")")
}