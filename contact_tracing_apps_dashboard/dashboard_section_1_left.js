








make_pie_chart = function (data_pie_chart) {
    console.log(data_pie_chart)
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

    var svg = d3.select("#section_1_left")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);

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

    get_data = function (value) {
        _data = {
            '0': APPS_PIECHART,
            '1': LANGS_PIECHART
        }
        return _data[value];
    }

    
    make_pie_chart(get_data('0'));

    $("#section_1_left_menu").change(function (e) {
        make_pie_chart(get_data(this.value));
    });
});
//https://stackoverflow.com/questions/45084933/how-to-append-an-svg-to-an-prexisting-svg-using-d3-js

