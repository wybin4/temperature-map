//set the dimensions and margins of the graph
const margin = { top: 80, right: 30, bottom: 30, left: 100 },
  width = 1500 - margin.left - margin.right,
  height = 570 - margin.top - margin.bottom;

//append the svg object to the body of the page
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

function return_month(number) {
  switch (number) {
    case 1: {
      return months[0];
    }
    case 2: {
      return months[1];
    }
    case 3: {
      return months[2];
    }
    case 4: {
      return months[3];
    }
    case 5: {
      return months[4];
    }
    case 6: {
      return months[5];
    }
    case 7: {
      return months[6];
    }
    case 8: {
      return months[7];
    }
    case 9: {
      return months[8];
    }
    case 10: {
      return months[9];
    }
    case 11: {
      return months[10];
    }
    case 12: {
      return months[11];
    }
  }
}
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

const myColor = d3.scaleLinear().range(["white", "#eb2503"]).domain([-20, 35]);

const years = [];

for (let i = 1881; i < 2023; i++) years.push(String(i));
const x = d3.scaleBand().domain(years).range([0, width]).padding(0);
const xAxis = d3
  .axisBottom()
  .scale(x)
  .tickValues(x.domain().filter((year) => year % 10 === 0));
svg.append("g").attr("transform", `translate(0, ${height})`).call(xAxis);

const y = d3
  .scaleBand()
  .domain([12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1])
  .range([height, 0]);
const yAxis = d3
  .axisLeft()
  .scale(y)
  .tickValues(y.domain())
  .tickFormat(function (month) {
    return return_month(month);
  })
  .tickSize(10, 1);
svg.append("g").call(yAxis);

$.getJSON(
  "https://raw.githubusercontent.com/ajdivotf/temperature-map/main/files/data.json",
  function (data) {
    // create a tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip");

    //three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
      tooltip.style("opacity", 1);
      d3.select(this).style("stroke", "white");
    };
    const mousemove = function (event, d) {
      if (d.temp < 100)
      tooltip
        .html(`${d.year} – ${return_month(d.month)} <br/>${d.temp}°C`)
        .style("left", event.offsetX - 40 + "px")
        .style("top", event.offsetY - 40 + "px");
    };
    const mouseleave = function (d) {
      tooltip.style("opacity", 0);
      d3.select(this).style("stroke", "none");
    };

    //add the squares
    svg
      .selectAll()
      .data(data, function (d) {
        return d.year + ":" + d.month;
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d.year);
      })
      .attr("y", function (d) {
        return y(d.month);
      })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) {
        if (d.temp < 100) return myColor(d.temp);
        else return "white";
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  }
);
