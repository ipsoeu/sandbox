function make_stackbar_chart(div_id, data, keys, title) {


    
    var div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    var svg = d3.select(div_id),
        margin = { top: 50, right: 0, bottom: 40, left: 35 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // svg.append("text")
    //     .attr("x", width / 2)
    //     .attr("y", 20)
    //     .style("text-anchor", "middle")
    //     .text(title);

    x = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.1);
    y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

    var z = d3.scaleOrdinal().range(["#b5179e", "#8ac926", "#1982c4", "#6a4c93", "#e76f51", "#619b8a", '#1b4332', '#cb997e']);
    console.log(keys)
    x.domain(data.map(d => d.datetime_str));
    y.domain([0, d3.max(data, function (d) { return d.total; })])
    z.domain(keys);

    g.append("g")
        .attr('class', 'stack-chart')
        .attr("transform", "translate(-30,0)")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) { return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) {
            return x(d.data.datetime_str);
        })
        .attr("y", function (d) {
            a = d[1] === NaN ? 0 : d[1];
            return y(a);
        })
        .attr("height", function (d) {
            a = d[1] === NaN ? 0 : d[1];
            b = d[0] === NaN ? 0 : d[0];
            if (y(a) == undefined || y(b) == undefined)
                return 0;
            else
                return y(b) - y(a);
        })
        .attr("width", x.bandwidth())
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0);
        });
    
    z_score_threshold = 1;

    g.append('g')
        .selectAll("g")
        .data(data.filter(d => d.zscore > z_score_threshold))
        .enter()
        .append('circle')
        .attr("cx", function (d) {
            return x(d.datetime_str) - 29;
        })
        .attr("cy", function (d) {
            return y(d.total) - 10;
        })
        .attr('r', d => `${d.zscore * 1.2}px`)
        .style('fill', '#D90429');

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    var x_axis = d3.axisBottom(x).tickValues(
        x.domain().filter(function (d, i) { return !(i % 6) })
    
    );

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(-30," + (height - margin.bottom) + ")")
        .call(x_axis)
        .selectAll("text")
        //.style("text-anchor", "start")
        .attr("y", "-2")
        .attr("x", "-35")
        .attr("transform", "rotate(-90)")
        .attr("class", "x-label-temporal")

        .attr('color', function (d) {
            const found = data.find(element => element.datetime_str == d);
            // if (found.zscore > z_score_threshold) {
            //     return '#D90429';
            // }
            // else
                //d3.select(this).remove();
                return 'gray'
        });

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        .attr("transform", function (d, i) { return "translate(50," + (0 + i * 40) + ")"; });

    legend.append("rect")
        .attr("x", width - 120)
        .attr("width", 50)
        .attr("height", 50)
        .attr("fill", function(d){
            return z(d);
        });

    legend.append("text")
        .attr("x", width - 150)
        .attr("y", 9.5)
        .attr("dy", "2em")
        .text(function (d) { return d; });

}

$(document).ready(function () {

    console.log('OK')

    var div_id = "#events_by_app";
    var data = POSITIVE_SENTIMENT_TEMPORAL_EVOLUTION;
    var keys = TOP_MOBILE_APPS;
    var dates = POSITIVE_SENTIMENT_TEMPORAL_EVOLUTION_DATES;

    make_stackbar_chart(div_id, TEMPORAL_EVOLUTION_BY_APP, TOP_MOBILE_APPS);

    // var div_id = "#chart_3";
    // var data = NEGATIVE_SENTIMENT_TEMPORAL_EVOLUTION;
    // var keys = MOBILE_APPS;
    // var dates = POSITIVE_SENTIMENT_TEMPORAL_EVOLUTION_DATES;

    // makestack_chart(div_id, data, keys, dates, 'Temporal evolution of negative tweets');
});

