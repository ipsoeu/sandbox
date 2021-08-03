function Counter(list) {
    var count = {};
    list.forEach(val => count[val] = (count[val] || 0) + 1);
    return Object.fromEntries(
        Object.entries(count).sort(([, a], [, b]) => b - a)
    );
}

function make_geo_chart(chart_id, geo, userData, title, range_colors) {
    /**
     * Build legend.
     * @param  {Object}   legendKey   Selection to mount legend on.
     * @param  {number}   max         Value maximum.
     * @param  {function} scale       Colour scale.
     * @param  {string}   legendText  Legend title.
     * @return {undefined}            DOM side effects.
     */

    function buildKey(legendKey, max, scale, legendText) {
        console.log(scale.domain())
        const x = d3.scaleLinear()
            .domain([1, max])
            .range([0, 350]);

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
            .attr('height', 10)
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
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 800 - margin.left - margin.right,
        height = 800 - margin.top - margin.bottom;

    const svg = d3.select(chart_id)
        .append('svg')
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top})`);

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
    svg
        .append('defs')
        .append('clipPath')
        .attr('id', 'clip-it')
        .append('path')
        .attr('d', geoPath(geo));

    svg
        .append('g')
        .attr('id', 'world')
        .append('path')
        .attr('d', geoPath(geo))
        .attr('stroke', '#000')
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
    const ckBreaks = ss.ckmeans(counts, range_colors.length).map(clusters => clusters[0]);

    const colourScale = d3
        .scaleThreshold()
        .domain(ckBreaks)
        .range(range_colors);

    // Clip.
    const gHex = svg
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
    const legendKey = svg
        .append('g')
        // /.attr('class', 'legend')
        
        .attr('transform', `translate(${width - 360}, ${height})`)
        .call(
            buildKey,
            hex.grid.extentPointsWeighted[1],
            colourScale,
            'Number of ' + title
        );
}

// Data load.
const geoData = d3.json(
    'https://raw.githubusercontent.com/larsvers/map-store/master/europe_geo.json'
);

const range_colors = [
    '#ffffff',
    '#d0ded8',
    '#85aa9b',
    '#588b76',
    '#18392b'

]

Promise.all([geoData]).then(response => {
    let [geo_data] = response;
    make_geo_chart('#basic_information_geo_data', geo_data, GEO_TWEETS, 'Geolocalized Tweets', range_colors);

});

//https://observablehq.com/@larsvers/d3-hexgrid-examples

//https://www.datavis.fr/index.php?page=map-hexgrid

//https://github.com/d3/d3-hexbin