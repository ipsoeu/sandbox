$(document).ready(function () {

    function makestack_chart(div_id, data, keys, dates) {

        var svg = d3.select(div_id),
            margin = { top: 10, right: 10, bottom: 40, left: 35 },
            width = +svg.attr("width") - margin.left - margin.right,
            height = +svg.attr("height") - margin.top - margin.bottom,
            g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        x = d3.scaleBand().range([margin.left, width - margin.right]).padding(0.1);
        y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top])

        var z = d3.scaleOrdinal().range(["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51", "#1d3557"]);

        x.domain(dates);
        y.domain([0, d3.max(data, function (d) { return d.total; })])
        z.domain(keys);

        g.append("g")
            .selectAll("g")
            .data(d3.stack().keys(keys)(data))
            .enter().append("g")
            .attr("fill", function (d) { return z(d.key); })
            .selectAll("rect")
            .data(function (d) { return d; })
            .enter().append("rect")
            .attr("x", function (d) { return x(d.data.datetime); })
            .attr("y", function (d) { a = d[1] === NaN ? 0 : d[1]; return y(a); })
            .attr("height", function (d) {
                a = d[1] === NaN ? 0 : d[1];
                b = d[0] === NaN ? 0 : d[0];
                return y(b) - y(a);
            })
            .attr("width", x.bandwidth());

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0,0)")
            .call(d3.axisLeft(y));

        g.append("g")
            .attr("class", "axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).ticks(null, "s"))
            .append("text")
            .attr("y", 2)
            .attr("y", y(y.ticks().pop()) + 0.5)
            .attr("dy", "0.32em")
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "start")
            .text("Tweets")
            .attr("transform", "translate(" + (-width) + ",-10)");

        var legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
            .attr("transform", function (d, i) { return "translate(-50," + (50 + i * 40) + ")"; });

        legend.append("rect")
            .attr("x", width - 100)
            .attr("width", 50)
            .attr("height", 50)
            .attr("fill", z);

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .text(function (d) { console.log(d); return d; });

    }

    var div_id = "#chart_2";
    var data = POSITIVE_SENTIMENT_TEMPORAL_EVOLUTION;
    var keys = MOBILE_APPS;
    var dates = MOBILE_APPS_DATES;

    makestack_chart(div_id, data, keys, dates);

    var div_id = "#chart_3";
    var data = NEGATIVE_SENTIMENT_TEMPORAL_EVOLUTION;
    var keys = MOBILE_APPS;
    var dates = MOBILE_APPS_DATES;

    makestack_chart(div_id, data, keys, dates);
});

