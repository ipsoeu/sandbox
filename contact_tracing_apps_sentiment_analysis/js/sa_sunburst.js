function make_sunburst_chart(chart_id, data) {
    
    data = data.slice(0, 6)

    function computeTextRotation(d) {
        var angle = (d.x0 + d.x1) / Math.PI * 90;

        // Avoid upside-down labels
        //return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
        return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
    }

    color = d3.scaleOrdinal()
    .domain(data.map(d => d[0]))
    .range(d3.schemeCategory10);

    var partitions = data.map(function(d, index){
        positive = (d['positive_tweets']/(d['positive_tweets'] + d['negative_tweets']) * 100).toFixed()
        return {
            name: d['app_name'].slice(0,2).toUpperCase(),
            color: color(d[0]),
            children:[
                {name: positive + ' %', size: d['positive_tweets'], color: 'rgb(27, 89, 151, 0.6)'},
                {name: (100 - positive) + ' %', size: d['negative_tweets'], color: 'rgb(196,43,50, 0.6)'},
            ]
        }
    })


    var nodeData = {
        "name": "sentiment analysis",
        "children": partitions
    };

    // Variables
    var width = 800;
    var height = 600;
    var radius = Math.min(width, height) / 2;
    //var color = d3.scaleOrdinal(d3.schemeAccent);

    // Create primary <g> element
    var g = d3.select('#basic_information_sa_starbust_svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', 'translate(' + radius + ',' + height / 2 + ')');

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
        //.style("fill", function (d) { return (d.children ? d : d.parent).data.color; });
        .style("fill", function (d) { return d.data.color; });
        
    g.selectAll(".node")
        .append("text")
        .attr("transform", function (d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")";
        })
        .attr("dx", "-20") // radius margin
        .attr("dy", ".5em") // rotation align
        .text(function (d) { return d.parent ? d.data.name : "" });

    // g.append('text')
    //     .attr('transform', 'translate(-30, 30)')
    //     .text('')

    // g.append('text')
    //     .attr('transform', 'translate(-30, 0)')
    //     .attr('font-size', '20px')
    //     .attr('font-weight', 'bold')
    //     .text(data['total_tweets'])


    g.selectAll("mylabels")
        .data(data)
        .enter()
        .append("text")
          .attr('font-size', '20px')
          .attr("x", 300)
          .attr("y", function(d,i){ return -280 + i*25})
          .style("fill", function(d){ return color(d[0])})
          .text(function(d){
              return d['app_name'].slice(3).replaceAll('_', ' ')
            })
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
    
    g.selectAll("mydots")
          .data(data)
          .enter()
          .append("circle")
            .attr("cx", 290)
            .attr("cy", function(d,i){ return -285 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .attr("r", 5)
            .style("fill", function(d){ return color(d[0])})
}

$(document).ready(function () {
    
    var data = JSON.parse(JSON.stringify(SA_BY_APP));
    make_sunburst_chart('aa', data)
    
});

