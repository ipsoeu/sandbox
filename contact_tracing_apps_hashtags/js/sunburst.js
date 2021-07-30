function make_sunburst_chart(chart_id, data) {

    function computeTextRotation(d) {
        var angle = (d.x0 + d.x1) / Math.PI * 90;

        // Avoid upside-down labels
        return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
        //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
    }


    var nodeData = {
        "name": "Geolocalized tweets",
        "children": [{
            "name": "Isolated",
            "children": [
                { "name": "Geo", "size": data['isolated_geolocalized_tweets'] },
                { "name": "No Geo", "size": data['isolated_tweets'] - data['isolated_geolocalized_tweets'] }]
        },
        {
            "name": "Shared",
            "children": [
                { "name": "Geo", "size": data['geolocalized_tweets'] - data['isolated_geolocalized_tweets'] },
                { "name": "No Geo", "size": data['shared_tweets'] - data['geolocalized_tweets'] - data['isolated_geolocalized_tweets'] }
            ]
        }]
    };

    // Variables
    var width = 300;
    var height = 300;
    var radius = Math.min(width, height) / 2;
    var color = d3.scaleOrdinal(d3.schemeAccent);

    // Create primary <g> element
    var g = d3.select('#community_7_svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    // Data strucure
    var partition = d3.partition()
        .size([2 * Math.PI, radius]);

    // Find data root
    var root = d3.hierarchy(nodeData)
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
        .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });

    g.selectAll(".node")
        .append("text")
        .attr("transform", function (d) {
            console.log('oo')
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
        })
        .attr("dx", "-20") // radius margin
        .attr("dy", ".5em") // rotation align
        .text(function (d) { return d.parent ? d.data.name : "" });


}
