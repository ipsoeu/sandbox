function make_geo_event_chart(chart_id, geo_data, event) {

    //var event = events[0];

    var countries = event.map(function (e) {
        return e.country
    });

    var count_values = event.map(function (e) {
        return e.count;
    });

    geo_data.features = geo_data.features.filter(function (d) {
        return true;
        //return countries.includes(d.properties.ISO_A2.toLowerCase());
    })

    const x = d3.scaleLinear()
        .domain([d3.min(count_values), d3.max(count_values)])
        .range([0, 120]);

    const colour_scale = d3
        .scaleLinear()
        .domain([d3.min(count_values), d3.max(count_values)])
        .range(["#f1faee", "#1d3557"]);

    // Set up SVG.
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select(chart_id)
        .append('svg')
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left} ${margin.top})`);

    // Projection and path.
    const projection = d3.geoConicEqualArea()
        .fitSize([width, height], geo_data)
        .parallels([36, 66]);
    const geoPath = d3.geoPath().projection(projection);

    svg.append("g")
        .selectAll("path")
        .data(geo_data.features)
        .enter()
        .append("path")
        .attr("fill", function (d) {
            var country = event.filter(function (e) {
                return e.country == d.properties.ISO_A2.toLowerCase();
            })[0]
            return country === undefined ? '#FFF' : colour_scale(country.count);
        })
        .attr("d", d3.geoPath().projection(projection))
        .style("stroke", "#000")
        .style('stroke-width', '1px')
}

function make_tag_cloud_chart(chart_id, event) {
    
    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var word_cloud_id = `${chart_id.replace('#', '')}_word_cloud`;

    const svg_word_cloud = d3.select(chart_id)
        .append('svg')
        .attr('id', word_cloud_id)
        .attr('width', width + margin.left + margin.top)
        .attr('height', height + margin.top + margin.bottom)
        .attr('x', 500);

    var words = event.map(function (item) {
        var wordcloud = item.hashtags.map(function (h) {
            if (h[1] > 1)
                return { 'text': h[0], 'size': h[1] }
        })
        return wordcloud.filter(function (w) {
            return w != undefined;
        });

    });
    var words = [].concat.apply([], words);
    var color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);


    var layout = d3.layout.cloud()
        .size([500, 500])
        .words(words)
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
            d3.select(`#${word_cloud_id}`)
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}
const geo_data = d3.json('https://raw.githubusercontent.com/ipsoeu/sandbox/master/contact_tracing_apps_dashboard/europe.geo.json');

function make_gdelt_news(div_id, news){
    $(div_id).DataTable({
        data: news,
        columns: [
            { data: "text", title: "Tweet" },
            { data: "favorite_count", title: "Number of retweets" },
            { data: function(d){return d['news'][0]['SOURCEURL']}, title: "GDELT news"},
            { data: 'emm', title: 'EMM news'},
            
    
        ],
        order: [[1, "desc"]],
        searching: false,
        lengthChange: false,
        columnDefs: [{
            targets: [1],
            render: $.fn.dataTable.render.number(',', '.', 0)
        }]
        
    });
    
}


$(document).ready(function () {

    Promise.all([geo_data]).then(response => {
        let [geo_data] = response;
        var event_news = EVENTS_NEWS['positive'][0][EVENTS[0][0]['datetime'][0]];
        
        
        //console.log(EVENTS)
        console.log(EVENTS_NEWS)
        make_geo_event_chart('#dashboard_event_1', geo_data, EVENTS[0]); //9 24 positive
        make_tag_cloud_chart('#dashboard_event_1', EVENTS[0]);
        var e = EVENTS_NEWS['positive'][0]['2020-09-24'].filter(news => news.favorite_count > 0);
        console.log(e)
        e[0].emm = 0
        e[1].emm = 0
        e[2].emm = 0
        e[3].emm = 0
        e[4].emm = 0
        e[5].emm = 0
        make_gdelt_news('#gdelt_event_1', e)
        
        
        // negative 9 24
        make_geo_event_chart('#dashboard_event_2', geo_data, EVENTS[3]);
        make_tag_cloud_chart('#dashboard_event_2', EVENTS[3]);
        var e = EVENTS_NEWS['negative'][0]['2020-09-24'].filter(news => news.favorite_count > 0);
        e[0].emm = 0
        e[1].emm = 0
        e[2].emm = 0
        make_gdelt_news('#gdelt_event_2', e);
        
        // negative 9 26
        make_geo_event_chart('#dashboard_event_3', geo_data, EVENTS[4]);
        make_tag_cloud_chart('#dashboard_event_3', EVENTS[4]);
        var e = EVENTS_NEWS['negative'][1]['2020-09-26'].filter(news => news.favorite_count > 0)
        e[0].emm = 0
        e[1].emm = 0
        make_gdelt_news('#gdelt_event_3', e);

        // negative 10 12
        make_geo_event_chart('#dashboard_event_4', geo_data, EVENTS[5]); 
        make_tag_cloud_chart('#dashboard_event_4', EVENTS[5]);
        var e = EVENTS_NEWS['negative'][2]['2020-10-12'].filter(news => news.favorite_count > 0);
        e[0].emm = 0
        make_gdelt_news('#gdelt_event_4', e);
    });

});