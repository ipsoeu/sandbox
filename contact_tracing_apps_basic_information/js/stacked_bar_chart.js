make_stack_bar_char = function () {

    var parse_created_at = d3.timeParse("%Y-%m-%d");

    var data = JSON.parse(JSON.stringify(APPS_SERIES));

    data = data.map(function(e){
        e['date'] = parse_created_at(e['day']);
        return e;
    });

    data = data.map(function(e){
        delete e['total']
        delete e['day']
        return e;
    });
    
    margin = ({ top: 20, right: 30, bottom: 30, left: 40 })

    height = 400;
    width = 800;

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    
    series = d3.stack()
        .keys(APPS_LABELS)
        .order(d3.stackOrderDescending)
        .offset(d3.stackOffsetNone)
        (data);

    

    color = d3.scaleOrdinal()
        .domain(APPS_LABELS)
        .range(d3.schemeCategory10);

    y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([height - margin.bottom, margin.top])

    x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])


    area = d3.area()
        .x(d => x(d.data.date))
        .y0(d => y(d[0]))
        .y1(function(d){
            return isNaN(y(d[1])) ? y(d[0]) : y(d[1]) ;
        });

    const svg = d3.select("#basic_information_stacked_bar_chart_svg")
        .attr("viewBox", [0, 0, width, height]);

    svg.append("g")
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({ key }) => color(key))
        .attr("d", area)
        .append("title")
        .text(({ key }) => key);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    svg.selectAll("mylabels")
        .data(series)
        .enter()
        .append("text")
          .attr('font-size', '10px')
          .attr("x", 650)
          .attr("y", function(d,i){ return 50+ i*15})
          .style("fill", function(d){ return color(d.key)})
          .text(function(d){return d.key})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
    
    svg.selectAll("mydots")
          .data(series)
          .enter()
          .append("circle")
            .attr("cx", 640)
            .attr("cy", function(d,i){ return 47 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 3)
            .style("fill", function(d){ return color(d.key)})


}

$(document).ready(function () {

    make_stack_bar_char();
    
});