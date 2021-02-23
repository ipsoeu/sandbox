

$(document).ready(function () {
    var data = SENTIMENT_TEMPORAL_EVOLUTION;

    var svg = d3.select("#chart_1"),
        margin = { top: 20, right: 50, bottom: 30, left: 130 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // var y = d3.scaleBand()			// x = d3.scaleBand()	
    //     .rangeRound([0, height])	// .rangeRound([0, width])
    //     .paddingInner(0.05)
    //     .align(0.1);

    // var x = d3.scaleLinear()		// y = d3.scaleLinear()
    //     .rangeRound([0, width]);	// .rangeRound([height, 0]);

    x = d3.scaleBand()
    
    .range([margin.left, width - margin.right])
    .padding(0.1)

    y = d3.scaleLinear()
    //.domain([0, d3.max(series, d => d3.max(d, d => d[1]))])
    .rangeRound([height - margin.bottom, margin.top])

    var z = d3.scaleOrdinal()
        .range(["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51" ,"#1d3557"]);

    var keys = MOBILE_APPS;

    // y.domain(data.map(function (d) { return d.datetime; }));
    // x.domain([0, d3.max(data, function (d) {return d.total;})]).nice();
    x.domain( MOBILE_APPS_DATES );
    
    y.domain([0, d3.max(data, function (d) {return d.total;})]) //.nice();

    z.domain(keys);
    
    console.log(x("2020-07-24"))



    g.append("g")
        .selectAll("g")
        .data(d3.stack().keys(keys)(data))
        .enter().append("g")
        .attr("fill", function (d) {return z(d.key); })
        .selectAll("rect")
        .data(function (d) { return d; })
        .enter().append("rect")
        .attr("x", function (d) { return x(d.data.datetime); })	    //.attr("x", function(d) { return x(d.data.State); })
        .attr("y", function (d) { a = d[1] === NaN ? 0: d[1]; return y(a); })			    //.attr("y", function(d) { return y(d[1]); })	
        .attr("height", function (d) { 
            a = d[1] === NaN ? 0: d[1];
            b = d[0] === NaN ? 0: d[0];

            return y(b) - y(a); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        .attr("width", x.bandwidth());						    //.attr("width", x.bandwidth());	

        // .attr("width", function (d) { a = d[1] === NaN ? 0: d[1];return x(a) - x(d[0]); })	//.attr("height", function(d) { return y(d[0]) - y(d[1]); })
        // .attr("height", y.bandwidth());						    //.attr("width", x.bandwidth());	

    // g.append("g")
    //     .attr("class", "axis")
    //     .attr("transform", "translate(0,0)") 						//  .attr("transform", "translate(0," + height + ")")
    //     .call(d3.axisLeft(y));									//   .call(d3.axisBottom(x));

    // // g.append("g")
    // //     .attr("class", "axis")
    // //     .attr("transform", "translate(0," + height + ")")				// New line
    // //     .call(d3.axisBottom(x).ticks(null, "s"))					//  .call(d3.axisLeft(y).ticks(null, "s"))
    // //     .append("text")
    // //     .attr("y", 2)												//     .attr("y", 2)
    // //     .attr("x", x(x.ticks().pop()) + 450.5) 						//     .attr("y", y(y.ticks().pop()) + 0.5)
    // //     .attr("dy", "0.32em")										//     .attr("dy", "0.32em")
    // //     .attr("fill", "#000")
    // //     .attr("font-weight", "bold")
    // //     .attr("text-anchor", "start")
    // //     .text("Tweets")
    // //     .attr("transform", "translate(" + (-width) + ",-10)");   	// Newline

    // // var legend = g.append("g")
    // //     .attr("font-family", "sans-serif")
    // //     .attr("font-size", 10)
    // //     .attr("text-anchor", "end")
    // //     .selectAll("g")
    // //     .data(keys.slice().reverse())
    // //     .enter().append("g")
    // //     //.attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
    // //     .attr("transform", function (d, i) { return "translate(-50," + (300 + i * 20) + ")"; });

    // // legend.append("rect")
    // //     .attr("x", width - 19)
    // //     .attr("width", 19)
    // //     .attr("height", 19)
    // //     .attr("fill", z);

    // // legend.append("text")
    // //     .attr("x", width - 24)
    // //     .attr("y", 9.5)
    // //     .attr("dy", "0.32em")
    // //     .text(function (d) { return d; });
    // // });
});

