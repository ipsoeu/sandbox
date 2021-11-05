make_pie_chart = function (div_id, data_pie_chart) {
    console.log(data_pie_chart)

    var data = [{
        name: 'Shared news',
        value: data_pie_chart.share_emm_news
    },
    {
        name: 'Isolated news',
        value: data_pie_chart.isolated_emm_news
    }]
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
        .domain(data.map(d => d.name))
        .range(['#1B5997', '#62a0de'])

    arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1)

    const arcs = pie(data);

    
    var svg = d3.select(div_id)
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    //.attr("viewBox", [-width / 2, -height / 2, width, height]);

    // margin = { top: 20, right: 50, bottom: 30, left: 130 },
    //     width = width - margin.left - margin.right,
    //     height = height - margin.top - margin.bottom;

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