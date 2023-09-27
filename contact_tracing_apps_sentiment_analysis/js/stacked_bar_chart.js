$(document).ready(function () {

    var data = JSON.parse(JSON.stringify(SA_BY_APP));
    data = data.slice(0, 7)

    data = data.map(function (e) {
        var record = {
            'app': `(${e.app_name.slice(0, 2).toUpperCase()}) ${e.app_name.slice(3).replace('_', ' ')}`,
            'positive': e['positive_tweets'],
            'negative': e['negative_tweets'],
            'neutral': e['neutral_tweets']
        }
        return record;
    })

    make_stacked_bar_chart(data);

});

function make_stacked_bar_chart(data) {

    var svg = d3.select("#chart_1"),
        margin = { top: 20, right: 50, bottom: 30, left: 170 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()			// x = d3.scaleBand()	
        .rangeRound([0, height])	// .rangeRound([0, width])
        .paddingInner(0.05)
        .align(0.1);

    var x = d3.scaleLinear()		// y = d3.scaleLinear()
        .rangeRound([0, width]);	// .rangeRound([height, 0]);

    var z = d3.scaleOrdinal()
        .range(['rgb(27, 89, 151)', "#D90429", "#ced4da"]);

    var keys = ['positive', 'negative', 'neutral'];


    //var data = SA_TABLE;


    y.domain(data.map(function (d) { return d.app; }));
    x.domain([0, d3.max(data, function (d) { return d.positive + d.negative + d.neutral; })]).nice();

    z.domain(keys);

    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) { return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("y", function (d) { return y(d.data.app); })	    //.attr("x", function(d) { return x(d.data.State); })
        .attr("x", function (d) { return x(d[0]); })			    //.attr("y", function(d) { return y(d[1]); })	
        .attr("width", function (d) { return x(d[1]) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("height", y.bandwidth());						    //.attr("width", x.bandwidth());	

    g.append("g")
        //.attr("class", "axis")
        .attr("transform", "translate(0,0)")
        .attr('class','xAxisText')						//  .attr("transform", "translate(0," + height + ")")
        .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

    g.append("g")
    .attr('class','xAxisText')    
    //.attr("class", "axis")
        //.attr('font-size', '16px')
        .attr("transform", "translate(0," + height + ")")				// New line
        .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
        .append("text")
        .attr("y", 2)												//     .attr("y", 2)
        .attr("x", x(x.ticks().pop()) + 450.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Tweets")
        .attr("transform", "translate(" + (-width) + ",-10)");   	// Newline

    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(keys.slice().reverse())
        .enter().append("g")
        //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
        .attr("transform", function (d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

    legend.append("rect")
        .attr("x", width - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", z);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .attr("font-size", "16px")
        .text(function (d) { return d; });

}