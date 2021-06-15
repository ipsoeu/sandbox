function Counter(list) {
    var count = {};
    list.forEach(val => count[val] = (count[val] || 0) + 1);
    return Object.fromEntries(
        Object.entries(count).sort(([, a], [, b]) => b - a)
    );
}

function make_geo_chart(svg, geo, userData, title) {
    
    const range_colors = ['#FFF', '#90be6d', '#43aa8b', '#4d908e', '#277da1'];

    function buildKey(legendKey, max, scale, legendText) {
        
        const x = d3.scaleLinear()
            .domain([1, max])
            .range([0, 220]);

        const xAxis = d3.axisBottom(x)
            .tickSize(13)
            .tickValues(scale.domain());

        const g = legendKey.call(xAxis);

        g.select('.domain').remove();

        const data = scale.range().map(color => {
            const d = scale.invertExtent(color);
            if (d[0] == null) d[0] = x.domain()[0];
            if (d[1] == null) d[1] = x.domain()[1];
            return d;
        });

        g.selectAll('rect')
            .data(
                scale.range().map(color => {
                    const d = scale.invertExtent(color);
                    if (d[0] == null) d[0] = x.domain()[0];
                    if (d[1] == null) d[1] = x.domain()[1];
                    return d;
                })
            )
            .enter()
            .insert('rect', '.tick')
            .attr('height', 8)
            .attr('x', d => x(d[0]))
            .attr('width', d => x(d[1]) - x(d[0]))
            .attr('fill', d => scale(d[0]));

        g.append('text')
            .attr('fill', '#000')
            .attr('font-weight', 'bold')
            .attr('text-anchor', 'start')
            .attr('y', -6)
            .text(legendText);
    }

    // Set up SVG.
    const margin = { top: 30, right: 0, bottom: 30, left: 0 },
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    d3.select('#geo_chart').remove();
    
    geo_svg = svg.append('g')
        .attr('id', 'geo_chart')
        .attr('transform', 'translate(470, -25)');

    // Projection and path.
   const projection = d3.geoConicEqualArea()
        .fitSize([width, height], geo)
        .parallels([36, 66]);

    const geoPath = d3.geoPath().projection(projection);

    // Prep user data.
    userData.forEach(site => {
        const coords = projection([+site.lng, +site.lat]);
        site.x = coords[0];
        site.y = coords[1];
    });

    // Confine the global points to Europe.
    const poly = d3.geoPolygon(geo, projection);
    userData = d3.polygonPoints(userData, poly);

    // Set up clip paths.
    geo_svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip-it')
        .append('path')
        .attr('d', geoPath(geo));

    geo_svg
        .append('g')
        .attr('id', 'world')
        .append('path')
        .attr('d', geoPath(geo))
        .attr('stroke', '#000')
        .attr('padding', '1px')
        .attr('fill', 'none');

    // Hexgrid generator.
    const hexgrid = d3.hexgrid()
        .extent([width, height])
        .geography(geo)
        .projection(projection)
        .pathGenerator(geoPath)
        .hexRadius(10)
        .edgePrecision(1)
        .gridExtend(2)
        .geoKeys(['lng', 'lat']);

    // Hexgrid instance.
    const hex = hexgrid(userData, ['hashtags', 'place_name']);

    // Calculate Ckmeans based colour scale.
    const counts = hex.grid.layout
        .map(el => el.datapointsWt)
        .filter(el => el > 0);
    const ckBreaks = ss.ckmeans(counts, 4).map(clusters => clusters[0]);

    const colourScale = d3
        .scaleThreshold()
        .domain(ckBreaks)
        //.range(['#fff', '#e7e7e7', '#aaa', '#777', 'red']);
        .range(range_colors);

    // Clip.
    const gHex = geo_svg
        .append('g')
        .attr('id', 'hexes')
        .attr('clip-path', 'url(#clip-it)');

    // Draw.
    gHex
        .selectAll('.hex')
        .data(hex.grid.layout)
        .enter()
        .append('path')
        .attr('class', 'hex')
        .attr('transform', d => `translate(${d.x}, ${d.y})`)
        .attr('d', hex.hexagon())
        .style('fill', d => colourScale(d.datapointsWt))
        .style('stroke', '#999')
        .style('stroke-opacity', 0.4)

        .on('click', function (event, data) {

            var hashtags = [];

            data.forEach(function (element) {
                hashtags = hashtags.concat(element.hashtags);
            });
            var place_names = data.map(function (element) {
                return element.place_name;
            });

        });

    // Build and mount legend.
    const legendKey = geo_svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 600}, ${height + 30})`)
        .call(
            buildKey,
            hex.grid.extentPointsWeighted[1],
            colourScale,
            'Geolocalized tweets'
        );
}
