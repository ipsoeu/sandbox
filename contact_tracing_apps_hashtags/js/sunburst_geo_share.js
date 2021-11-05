function make_sunburst_chart(chart_id, data) {

    function computeTextRotation(d) {
        var angle = (d.x0 + d.x1) / Math.PI * 90;

        // Avoid upside-down labels
        return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
        //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
        //return 0;
    }


    var node_data = {
        "name": "Geolocalized tweets",
        "children": [
            {
                name: "Shared",
                color: '#2ca02c', //"#08519c",
                size_perc: 100 - parseInt(data.isolated_tweets / data.total_tweets * 100),
                children: [
                    {
                        name: "Geo",
                        size: data.share_geolocalized_tweets,
                        size_perc: parseInt(data.share_geolocalized_tweets / data.shared_tweets * 100)
                    },
                    {
                        name: "No Geo",
                        size: data.shared_tweets - data.share_geolocalized_tweets,
                        size_perc: 100 - parseInt(data.share_geolocalized_tweets / data.shared_tweets * 100)
                    }
                ]
            },
            {
            "name": "Isolated",
            'color': 'rgb(27, 89, 151)',
            size_perc: parseInt(data.isolated_tweets / data.total_tweets * 100),
            "children": [
                {
                    "name": "Geo",
                    "size": data['isolated_geolocalized_tweets'],
                    'size_perc': parseInt(data.isolated_geolocalized_tweets / data.isolated_tweets * 100)
                },
                {
                    "name": "No Geo",
                    "size": data.isolated_tweets - data.isolated_geolocalized_tweets,
                    'size_perc': 100 - parseInt(data.isolated_geolocalized_tweets / data.isolated_tweets * 100)
                }]
        },
        ]
    };

    // Variables
    var width = 400;
    var height = 400;
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeAccent);

    // Create primary <g> element
    var g = d3.select(chart_id)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(node_data)
        .sum(function (d) { return d.size });

    // Size arcs
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });

    // Put it all together
    g.selectAll('path')
        .data(root.descendants())
        .enter().append('g').attr("class", "node").append('path')
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function (d) { return (d.children ? d : d.parent).data.color; });

    g.selectAll(".node")
        .append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
        })
        .attr("dx", "-20") // radius margin
        .attr("dy", '-15') // rotation align
        .text(function (d) {
            if (d.value > 0) {
                //console.log(d)
                return d.parent ? d.data.name : "";
            }
            else
                return ''
        });

    g.selectAll(".node")
        .append("text")
        .attr('font-size', '20px')
        .attr('z-index', '10')
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
        })
        .attr("dx", "-20") // radius margin
        .attr("dy", "20") // rotation align
        .text(function (d) {
            if (d.value > 0) {
                return d.parent ? d.data.size_perc + ' %': "";
            }
            else
                return ''
        });

    g.append('text')
        .attr('transform', 'translate(-25, 30)')
        .text('Tweets')

    g.append('text')
        .attr('transform', 'translate(-30, 0)')
        .attr('font-size', '18px')
        .attr('font-weight', 'bold')
        .text(data['total_tweets'])

}
