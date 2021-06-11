make_dashboard = function () {

    var parse_created_at = d3.timeParse("%Y-%m-%d");
    
    var data = JSON.parse(JSON.stringify(APPS_SERIES));

    var data = data.map(function (e) {
        e['day'] = parse_created_at(e['day']);
        return e;
    });

    

    margin = ({ top: 20, right: 30, bottom: 100, left: 40 })

    height = 400;
    width = 1200;

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
        .attr("transform", `translate(0,${height - margin.bottom +260})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    series = d3.stack().keys(['total'])(data)

    color = d3.scaleOrdinal()
        .domain(['total'])
        .range(d3.schemeCategory10);

    y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([height - margin.bottom, margin.top])

    x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.day))
        .range([margin.left, width - margin.right])


    area = d3.area()
        .x(d => x(d.data.day))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))


    const svg = d3.select("#dashboard_svg");
        //.attr("viewBox", [0, 500, width, height]);

    svg.append("g")
        .attr('transform', 'translate(0, 250)')
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({ key }) => color(key))
        .attr("d", area)
        .append("title")
        .text(({ key }) => key);
        
    svg.append("g")
    
        .call(xAxis);

    // svg.append("g")
    //     .call(yAxis);
    make_slider_time(svg)

    make_pie_chart(svg, APPS_PIECHART)
}



make_slider_time = function (svg) {
    console.log(svg)
    var data = JSON.parse(JSON.stringify(APPS_SERIES))

    var parse_created_at = d3.timeParse("%Y-%m-%d");

    var data_time = data.map(function (e) {
        return parse_created_at(e.day);
    });

    
    var sliderTime = d3
        .sliderTop()
        .min(d3.min(data_time))
        .max(d3.max(data_time))
        //.step(30)
        .step(1000 * 60 * 60 * 24)
        .width(1118)
        .tickFormat(d3.timeFormat('%Y-%m-%d'))

        .displayFormat(d3.timeFormat('%Y-%m-%d'))
        //.tickValues(data_time)
        //.ticks(30)
        //.displayTicks(false)
        .default(d3.max(data_time))
        .on('onchange', val => {
           display_by_day(svg, val)
        });

      // d3
         //.select("#dashboard_svg")
    var g_time =   svg
        .append('g')
        .attr('id', 'svg_slider')
        .attr('width', 1220)
        .attr('height', 100)
        .attr('transform', 'translate(51, 555)');

    g_time.call(sliderTime);
    d3.select('#svg_slider').selectAll('.tick').remove();
    
}

display_by_day = function(svg, day){
    console.log(day)
    console.log(svg)
}

make_pie_chart = function (svg, data_pie_chart) {
    
    pie = d3.pie()
        .sort(null)
        .value(d => d.value)

    height = 400;
    width = 400;

    arcLabel = function () {
        const radius = Math.min(width, height) / 2 * 1.2;
        return d3.arc().innerRadius(radius).outerRadius(radius);
    }

    color = d3.scaleOrdinal()
        .domain(data_pie_chart.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data_pie_chart.length).reverse())

    arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1)

    const arcs = pie(data_pie_chart);

    // var svg = d3.select("#section_1_left")
    //     .attr("viewBox", [-width / 2, -height / 2, width, height]);

    margin = { top: 20, right: 50, bottom: 30, left: 130 },
        width = width - margin.left - margin.right,
        height = height - margin.top - margin.bottom,

        svg.append("g")
            .attr("stroke", "white")
            .selectAll("path")
            .data(arcs)
            .join("path")
            .attr("fill", d => color(d.data.name))
            .attr("d", arc)
            .append("title")
            .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel().centroid(d)})`)

        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));


}




$(document).ready(function () {

    make_dashboard();
    
});



