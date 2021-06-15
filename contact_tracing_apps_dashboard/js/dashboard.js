make_dashboard = function (geo_data_polygons) {

    var parse_created_at = d3.timeParse("%Y-%m-%d");

    var data = JSON.parse(JSON.stringify(APPS_SERIES));

    var data = data.map(function (e) {
        e['day'] = parse_created_at(e['day']);
        return e;
    });

    margin = ({ top: 20, right: 30, bottom: 100, left: 40 })

    height = 400;
    width = 1200;

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(data.y))

    xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom + 260})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    series = d3.stack().keys(['total'])(data)

    color = d3.scaleOrdinal()
        .domain(['total'])
        .range(d3.schemeCategory10);

    y = d3.scaleLinear()
        .domain([0, d3.max(series, d => d3.max(d, d => d[1]))]).nice()
        .range([height - margin.bottom, margin.top])

    x = d3.scaleUtc()
        .domain(d3.extent(data, d => d.day))
        .range([margin.left, width - margin.right])


    area = d3.area()
        .x(d => x(d.data.day))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))


    const svg = d3.select("#dashboard_svg");
    //.attr("viewBox", [0, 500, width, height]);

    svg.append("g")
        .attr('transform', 'translate(0, 250)')
        .selectAll("path")
        .data(series)
        .join("path")
        .attr("fill", ({ key }) => color(key))
        .attr("d", area)
        .append("title")
        .text(({ key }) => key);

    svg.append("g")

        .call(xAxis);

    // svg.append("g")
    //     .call(yAxis);
    make_slider_time(svg)

    //make_pie_chart(svg, APPS_PIECHART)

    make_stackbar_chart(svg, APPS_PIECHART)

    var geo_data = JSON.parse(JSON.stringify(GEO_TWEETS));
    var geo_coordinates = [];

    for (const [day, coordinates] of Object.entries(geo_data)) {
        geo_coordinates = geo_coordinates.concat(coordinates)
    }

    make_geo_chart(svg, geo_data_polygons, geo_coordinates);

    var wordcloud_data = {};
    for (const [day, hashtags] of Object.entries(JSON.parse(JSON.stringify(HASHTAGS_TWEETS)))) {
        hashtags.forEach((item) => {
            wordcloud_data[item.text] = item.text in wordcloud_data ? wordcloud_data[item.text] + item.value : item.value;
        });    
    }

    wordcloud_data_list = []
    for (const [k, v] of Object.entries(wordcloud_data)) {
        wordcloud_data_list.push({
            'text':k,
            'value':v
        })
    }

    make_tag_cloud_chart(svg, wordcloud_data_list)
}



make_slider_time = function (svg) {
    const parse_created_at = d3.timeParse("%Y-%m-%d");

    var data = JSON.parse(JSON.stringify(APPS_SERIES));
    var data_time = data.map(function (e) {
        return parse_created_at(e.day);
    });



    var sliderTime = d3
        .sliderTop()
        .min(d3.min(data_time))
        .max(d3.max(data_time))
        .step(1000 * 60 * 60 * 24)
        .width(1128)
        .tickFormat(d3.timeFormat('%Y-%m-%d'))
        .fill('#2196f3')
        .displayFormat(d3.timeFormat('%Y-%m-%d'))
        .default([d3.min(data_time), d3.max(data_time)])
        .on('onchange', val => {
            display_by_day(svg, val)
        });

    var g_time = svg
        .append('g')
        .attr('id', 'svg_slider')
        .attr('width', 1220)
        .attr('height', 100)
        .attr('transform', 'translate(41, 555)');

    g_time.call(sliderTime);
    d3.select('#svg_slider').selectAll('.tick').remove();

}

display_by_day = function (svg, days) {
    //const formatTime = d3.timeFormat("%B %d, %Y");
    const formatTime = d3.timeFormat('%Y-%m-%d');

    var data = JSON.parse(JSON.stringify(APPS_SERIES));

    data = data.filter(function (e) {
        return Date.parse(e.day) >= days[0] & Date.parse(e.day) <= days[1];
    });

    var data_pie_chart = [];

    for (app_name of APPS_LABELS) {
        if (app_name != 'total') {
            data_pie_chart.push({
                name: app_name,
                'value': data.reduce(function (total, e) {
                    return total + (e[app_name] ? e[app_name] : 0);
                }, 0)
            });
        }
    }

    data_pie_chart.sort(function (a, b) {
        return b.value - a.value;
    });

    //make_pie_chart(svg, data_pie_chart)
    make_stackbar_chart(svg, data_pie_chart)

    var geo_data = JSON.parse(JSON.stringify(GEO_TWEETS))

    var geo_coordinates = [];

    for (const [day, coordinates] of Object.entries(geo_data)) {
        if (Date.parse(day) >= days[0] & Date.parse(day) <= days[1])
            geo_coordinates = geo_coordinates.concat(coordinates)
    }

    const geoData = d3.json(
        'https://raw.githubusercontent.com/larsvers/map-store/master/europe_geo.json'
    ); // MOVE TO LOCAL REPO

    Promise.all([geoData]).then(response => {

        let [GEO_DATA_POLYGONS_EU] = response;
    
        make_geo_chart(svg, GEO_DATA_POLYGONS_EU, geo_coordinates);
    });

    
    var wordcloud_data = {};
    for (const [day, hashtags] of Object.entries(JSON.parse(JSON.stringify(HASHTAGS_TWEETS)))) {
        if(Date.parse(day) >= days[0] & Date.parse(day) <= days[1])
            hashtags.forEach((item) => {
            wordcloud_data[item.text] = item.text in wordcloud_data ? wordcloud_data[item.text] + item.value : item.value;
        });    
    }

    wordcloud_data_list = []
    for (const [k, v] of Object.entries(wordcloud_data)) {
        wordcloud_data_list.push({
            'text':k,
            'value':v
        })
    }

    make_tag_cloud_chart(svg, wordcloud_data_list)



}

make_pie_chart = function (svg, data_pie_chart) {
    return false;

    // pie = d3.pie()
    //     .sort(null)
    //     .value(d => d.value)

    // height = 300;
    // width = 300;

    // arcLabel = function () {
    //     const radius = Math.min(width, height) / 2 * 1.2;

    //     return d3.arc().innerRadius(radius).outerRadius(radius);
    // }

    // color = d3.scaleOrdinal()
    //     .domain(data_pie_chart.map(d => d.name))
    //     .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data_pie_chart.length).reverse())

    // arc = d3.arc()
    //     .innerRadius(0)
    //     .outerRadius(Math.min(width, height) / 2 - 1)

    // const arcs = pie(data_pie_chart);

    // margin = { top: 20, right: 50, bottom: 30, left: 130 },
    //     width = width - margin.left - margin.right,
    //     height = height - margin.top - margin.bottom;

    // d3.select('#dashboard_pie_chart').remove();

    // pie_g = svg.append("g")
    //     .attr('transform', 'translate(150, 150)')
    //     .attr('id', 'dashboard_pie_chart');

    // pie_g.attr("stroke", "black")
    //     .selectAll("path")
    //     .data(arcs)
    //     .join("path")
    //     .attr("fill", d => color(d.data.name))
    //     .attr("d", arc)
    //     .append("text")
    //     .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    // pie_g.append("g")
    //     .attr("font-family", "verdana")
    //     .attr("font-size", 11)
    //     .attr("text-anchor", "middle")
    //     .selectAll("text")
    //     .data(arcs)
    //     .join("text")
    //     .attr("transform", d => `translate(${arcLabel().centroid(d)})`)

    //     .call(text => text.append("tspan")
    //         .attr("y", "-0.4em")
    //         .attr("font-weight", "normal")
    //         .text(d => d.data.name))
    //     .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
    //         .attr("x", 0)
    //         .attr("y", "0.7em")
    //         .attr("fill-opacity", 0.6)
    //         .text(d => d.data.value.toLocaleString()));


}

make_stackbar_chart = function (svg, data) {

    margin = { top: 20, right: 50, bottom: 30, left: 130 },
        width = 600 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom,

        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    // set the ranges
    var y = d3.scaleBand()
        .range([0, width])
        .padding(0.1);
    var x = d3.scaleLinear()
        .range([height, 0]);

    //var data = APPS_PIECHART;// [{ "name": "IT_immuni", "value": 15009, }, { "name": "FR_StopCovid", "value": 8380 }];
    barHeight = 10


    x = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .range([margin.left, width - margin.right])

    y = d3.scaleBand()
        .domain(d3.range(data.length))
        .rangeRound([margin.top, height - margin.bottom])
        .padding(0.1)

    xAxis = g => g
        .attr("transform", `translate(0,${margin.top})`)
        .call(d3.axisTop(x).ticks(width / 80, data.format))
        .call(g => g.select(".domain").remove())

    yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).tickFormat(i => data[i].name).tickSizeOuter(0))

    format = x.tickFormat(20, data.format)

    d3.select('#dashboard_bar_chart').remove();

    barchart_g = svg.append('g')
        .attr('id', 'dashboard_bar_chart')
    //.attr("transform", 'translate(0,0)');

    barchart_g.append("g")
        .attr("fill", "steelblue")
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", x(0))
        .attr("y", (d, i) => y(i))
        .attr("width", d => x(d.value) - x(0))
        .attr("height", y.bandwidth());

    barchart_g.append("g")
        .attr("fill", "white")
        .attr("text-anchor", "end")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .selectAll("text")
        .data(data)
        .join("text")
        .attr("x", d => x(d.value))
        .attr("y", (d, i) => y(i) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("dx", -4)
        .text(d => format(d.value))
        .call(text => text.filter(d => x(d.value) - x(0) < 20) // short bars
            .attr("dx", +4)
            .attr("fill", "black")
            .attr("text-anchor", "start"));

    // barchart_g.append("g")
    //     .call(xAxis);

    barchart_g.append("g")
        .call(yAxis);
};


$(document).ready(function () {



    const geoData = d3.json(
        'https://raw.githubusercontent.com/larsvers/map-store/master/europe_geo.json'
    );


    const negative_range_colors = ['#FFF', '#f9c74f', '#f8961e', '#f3722c', '#f94144'];

    Promise.all([geoData]).then(response => {

        let [GEO_DATA_POLYGONS_EU] = response;
        make_dashboard(GEO_DATA_POLYGONS_EU);
        //make_geo_chart('#chart_5', geo_data, GEO_NEGATIVE_TWEETS, 'Negative Tweets', negative_range_colors);
    });

});


