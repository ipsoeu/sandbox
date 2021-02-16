function ready(geo, userData) {
    /**
     * Build legend.
     * @param  {Object}   legendKey   Selection to mount legend on.
     * @param  {number}   max         Value maximum.
     * @param  {function} scale       Colour scale.
     * @param  {string}   legendText  Legend title.
     * @return {undefined}            DOM side effects.
     */

    console.log(userData)

    function buildKey(legendKey, max, scale, legendText) {
        const x = d3.scaleLinear()
            .domain([1, max])
            .range([0, 120]);

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
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 1000 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    const svg = d3.select('#container')
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
        .hexRadius(7)
        .edgePrecision(1)
        .gridExtend(2)
        .geoKeys(['lng', 'lat']);

    // Hexgrid instance.
    const hex = hexgrid(userData);

    // Calculate Ckmeans based colour scale.
    const counts = hex.grid.layout
        .map(el => el.datapointsWt)
        .filter(el => el > 0);
    const ckBreaks = ss.ckmeans(counts, 4).map(clusters => clusters[0]);
    const colourScale = d3
        .scaleThreshold()
        .domain(ckBreaks)
        .range(['#fff', '#e7e7e7', '#aaa', '#777', '#555']);

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
        .style('stroke-opacity', 0.4);

    // Build and mount legend.
    const legendKey = svg
        .append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(${width - 120}, ${height})`)
        .call(
            buildKey,
            hex.grid.extentPointsWeighted[1],
            colourScale,
            'Number of positive tweets'
        );
}

// Data load.
const geoData = d3.json(
    //'https://raw.githubusercontent.com/larsvers/map-store/master/earth-lands-10km.json'
    'https://raw.githubusercontent.com/larsvers/map-store/master/europe_geo.json'
);
const points = GEO_POSITIVE_TWEETS;

// const points = d3.csv(
//     'https://raw.githubusercontent.com/larsvers/data-store/master/military_disputes_world.csv'
// );

Promise.all([geoData, points]).then(res => {
    let [geoData, userData] = res;
    ready(geoData, userData);
});

//https://observablehq.com/@larsvers/d3-hexgrid-examples

//https://www.datavis.fr/index.php?page=map-hexgrid

//https://github.com/d3/d3-hexbin