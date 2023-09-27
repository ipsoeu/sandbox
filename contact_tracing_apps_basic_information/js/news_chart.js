
function make_plot_chart(svg_id, data) {

    var parse_created_at = d3.timeParse("%Y-%m-%d");

    data = data.map(function (e) {
        e['date'] = parse_created_at(e['date']);
        return e;
    });


    var data_series = JSON.parse(JSON.stringify(APPS_SERIES));

    data_series = data_series.map(function (e) {
        e['date'] = parse_created_at(e['day']);
        return e;
    });


    const xValue = d => d.date;
    const xLabel = 'Time';


    const yLabel = 'Number of news';

    const margin = { left: 25, right: 10, top: 20, bottom: 120 };

    const svg = d3.select(svg_id);

    const width = 900;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
        //.attr('class','xAxisText')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisG = g.append('g')
    //
        .attr('transform', `translate(0, ${innerHeight})`)
        .attr('class','xAxisText');

    const yAxisG = g.append('g').attr('class','xAxisText');

    xAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('x', innerWidth / 2)
        .attr('y', 100)
        .text(xLabel);

    yAxisG.append('text')
        .attr('class', 'axis-label')
        .attr('x', -innerHeight / 2)
        .attr('y', -60)
        .attr('transform', `rotate(-90)`)
        .style('text-anchor', 'middle')
        .text(yLabel);

    const xScale = d3.scaleTime();


    const xAxis = d3.axisBottom()
        .scale(xScale)
    // .tickPadding(15)
    // .tickSize(-innerHeight);


    y_scale = d3.scaleLinear()
        .domain(d3.extent(d3.extent(data.map(d => d.value))))
        .range([innerHeight, 0])
        .nice();

    y_scale_opacity = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.value)))
        .range([0.3, 6])
        .nice();


    const yAxis = d3.axisLeft()
        .scale(y_scale);

    //         .ticks(1, 's')
    //         .tickPadding(15)
    //  .tickSize(-innerWidth);


    xScale
        .domain(d3.extent(data_series, xValue))
        .range([0, innerWidth])
        .nice();


    g.append('g')
        .selectAll('circle').data(data)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(xValue(d)))

        .attr('cy', d => y_scale(d.value))
        .attr('fill-opacity', d => y_scale_opacity(d.value))
        .attr('stroke', 'rgb(27, 89, 151)')
        .attr('fill', 'rgb(27, 89, 151)')
        .attr('r', 2);


    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    
    g.append("g")
        .attr('id', 'index_chart')
        .attr('transform', 'translate(-36, -10)')
        .selectAll("path")
        .data(d3.stack().keys(['total'])(data_series))
        .join("path")
        .attr("fill", 'rgb(27, 89, 151, 0.2)')
        .attr("d", area);
    
}

$(document).ready(function () {

    make_plot_chart('#basic_information_emm_news_svg', JSON.parse(JSON.stringify(NEWS_SERIES)))

});