
function make_plot_chart(svg_id, data) {
    
    var parse_created_at = d3.timeParse("%Y-%m-%d");


    //var data = SA_SERIES;
    
    data = data.map(function(e){
        e['date'] = parse_created_at(e['date']);
        return e;
    });

    console.log(data)
    const xValue = d => d.date;
    const xLabel = 'Time';
    

    const yLabel = 'Number of news';

    const margin = { left: 20, right: 10, top: 20, bottom: 120 };

    const svg = d3.select(svg_id);

    const width = 800;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const xAxisG = g.append('g')
        .attr('transform', `translate(0, ${innerHeight})`);

    const yAxisG = g.append('g');

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
        .domain(d3.extent(d3.extent(data.map(d => d.value) )))
        .range([innerHeight, 0])
        .nice();

    y_scale_opacity = d3.scaleLinear()
        .domain(d3.extent(data.map(d => d.value)))
        .range([0.3,1])
        .nice();


    const yAxis = d3.axisLeft()
        .scale(y_scale);
        
        // .ticks(1, 's')
        // .tickPadding(15)
        // .tickSize(-innerWidth);


    xScale
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice();


    g.selectAll('circle').data(data)
        .enter().append('circle')
        .attr('cx', d => xScale(xValue(d)))

        .attr('cy', d => y_scale(d.value))
        .attr('fill-opacity', d => y_scale_opacity(d.value))
        .attr('stroke', d => d.value > 0 ? 'rgb(27, 89, 151)' : 'rgb(182, 43, 52)')
        .attr('fill', d => d.value > 0 ? 'rgb(27, 89, 151)' : 'rgb(182, 43, 52)')
        .attr('r', 6);


    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
    
}

$(document).ready(function () {

    make_plot_chart('#basic_information_emm_news_svg', JSON.parse(JSON.stringify(NEWS_SERIES)))

});