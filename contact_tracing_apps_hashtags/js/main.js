var GLOBAL_COLORS = {
    blue: '#1B5997',
    green: '#2ca02c',
    red: '#D90429',
    cyan: '#62a0de',
    lightgray: '#D3D3D3'
}

function write_geo_info(div_id, data){

    var $table = $('<table class="table"></table>');

    $table.append('<tr><th></th><th>Shared tweets</th><th>Isolated tweets</th></tr>')
    $table.append(`
    <tr>
        <td>Geolocalized tweets</td>
        <td>${data.share_geolocalized_tweets}</td>
        <td>${data.isolated_geolocalized_tweets}</td>
    </tr>
    `);

    $table.append(`
    <tr>
        <td>No geolocalized tweets</td>
        <td>${data.shared_tweets - data.share_geolocalized_tweets}</td>
        <td>${data.isolated_tweets - data.isolated_geolocalized_tweets}</td>
    </tr>
    `);

    $table.append(`
    <tr>
        <td>Negative tweets</td>
        <td>${data['share_negative_tweets']}</td>
        <td>${data['isolated_negative_tweets']}</td>
    </tr>
    `);

    $(div_id).append($table)
}

function write_sentiment_info(div_id, data){

    var $table = $('<table class="table"></table>');

    $table.append('<tr><th></th><th>Shared tweets</th><th>Isolated tweets</th></tr>')
    $table.append(`
    <tr>
        <td>Positive tweets</td>
        <td>${data['share_positive_tweets']}</td>
        <td>${data['isolated_positive_tweets']}</td>
    </tr>
    `);

    $table.append(`
    <tr>
        <td>Neutral tweets</td>
        <td>${data['share_neutral_tweets']}</td>
        <td>${data['isolated_neutral_tweets']}</td>
    </tr>
    `);

    $(div_id).append($table)
}

function make_community_info_table(html_id, info) {

    var $list = $('<dl></dl>');

    $list.append($(`<dt>Number of Hashtags: ${info['hashtags_count']}</dt>`));
    $list.append($('<dt>Number of tweets</dt>'));
    $list.append(`<dd>- Total: ${info['total_tweets']}</dd>`)
    $list.append(`<dd>- Shared: ${info['shared_tweets']}</dd>`)
    $list.append(`<dd>- NOT Shared: ${info['isolated_tweets']}</dd>`)
    $list.append(`<dd>- SharedGeolocalized: ${info['share_geolocalized_tweets']}</dd>`)
    $list.append(`<dd>- IsolatedGeolocalized: ${info['isolated_geolocalized_tweets']}</dd>`)

    $list.append($('<dt>Sentiment analysis</dt>'));
    $list.append(`<dd>- Positive: ${info['share_positive_tweets']}</dd>`)
    $list.append(`<dd>- Negative: ${info['share_negative_tweets']}</dd>`)
    $list.append(`<dd>- Neutral: ${info['share_neutral_tweets']}</dd>`)

    $list.append($('<dt>Sentiment analysis on isolated tweets</dt>'));
    $list.append(`<dd>- Positive: ${info['isolated_positive_tweets']}</dd>`)
    $list.append(`<dd>- Negative: ${info['isolated_negative_tweets']}</dd>`)
    $list.append(`<dd>- Neutral: ${info['isolated_neutral_tweets']}</dd>`)

    $list.append($('<dt>EMM news</dt>'));
    $list.append(`<dd>- News: ${info['share_emm_news']}</dd>`)
    $list.append(`<dd>- News on isolated tweets: ${info['isolated_emm_news']}</dd>`)

    $(html_id).append($list)


}

function make_table_nodes_edges(html_id, data) {
    $(html_id).DataTable({
        data: data.slice(0, 10),
        columns: [
            { data: "hashtag", title: "Hashtags", className: 'column_grey' },
            { data: "degree_centrality", title: "Degree centrality", className: 'column_grey' },

            { data: "weak_link", title: "Similar links" },
            { data: "jaccard_distance", title: "Jaccard distance" },

            { data: "strong_link", title: "Distant links", className: 'column_grey' },
            { data: "jaccard_index", title: "Jaccard index", className: 'column_grey' },



        ],
        order: [[1, "desc"]],
        columnDefs: [{
            targets: [1,3,5],
            render: $.fn.dataTable.render.number(',', '.', 3)
          }],
        'paging': false
    });
}

const zip = (a, b, c) => a.map((k, i) => ({ ...k, ...b[i], ...c[i] }));

$(document).ready(function () {


    $('#community_table').DataTable({
        data: HASHTAGS_COMMUNITIES,
        columns: [
            { data: "partition", title: "Community id" },
            {
                data: function (d) {
                    return d.hashtags.slice(0, 5).map(function (e) { return e.hashtag }).join(', ');
                }, title: 'Top 5 hashtags'
            },
            {
                data: function (d) {
                    return d.isolated_mobile_apps.slice(0, 1).map(function (e) { return e.name }).join(', ');
                }, title: 'Main mobile app'
            },
            { data: "hashtags_count", title: "Number of Hashtags" },
            { data: "total_tweets", title: 'Number of Tweets' },

            { data: "community_isolation_by_tweets", title: 'Isolation index' },
            { data: "density", title: 'Density' },

            { data: "interconnection_index", title: 'Interconnection index' },
            { data: "isolated_emm_news", title: 'EMM news' },
        ],
        order: [[3, "desc"]],
        columnDefs: [{
            targets: [5,6,7,8],
            render: $.fn.dataTable.render.number(',', '.', 3)
          }]
    });

    $('#network_density').append(NETWORK_INFO['density']);
    $('#network_nodes').append(NETWORK_INFO['nodes']);
    $('#network_edges').append(NETWORK_INFO['edges']);


    // Partition 7 UK

    var node_edge = zip(
        HASHTAGS_COMMUNITIES[0]['hashtags'],
        HASHTAGS_COMMUNITIES[0]['strong_links'],
        HASHTAGS_COMMUNITIES[0]['weak_links']
    )

    make_community_info_table('#community_7_info', HASHTAGS_COMMUNITIES[0]);

    make_sunburst_chart('#community_7_geo_svg', HASHTAGS_COMMUNITIES[0]);
    write_geo_info('#community_7_geo_info', HASHTAGS_COMMUNITIES[0]);

    make_sunburst_sentiment_chart('#community_7_sentiment_svg', HASHTAGS_COMMUNITIES[0]);
    write_sentiment_info('#community_7_sentiment_info', HASHTAGS_COMMUNITIES[0]);

    make_table_nodes_edges('#community_7_nodes_edges', node_edge);


    // Partition 3 IT

    var node_edge = zip(HASHTAGS_COMMUNITIES[1]['hashtags'],
        HASHTAGS_COMMUNITIES[1]['strong_links'],
        HASHTAGS_COMMUNITIES[1]['weak_links']
    )

    make_community_info_table('#community_3_info', HASHTAGS_COMMUNITIES[1]);

    make_sunburst_chart('#community_3_svg', HASHTAGS_COMMUNITIES[1]);

    make_table_nodes_edges('#community_3_nodes_edges', node_edge);

    // Partition 1 DE

    var node_edge = zip(HASHTAGS_COMMUNITIES[2]['hashtags'],
        HASHTAGS_COMMUNITIES[2]['strong_links'],
        HASHTAGS_COMMUNITIES[2]['weak_links']
    )

    make_community_info_table('#community_1_info', HASHTAGS_COMMUNITIES[2]);

    make_sunburst_chart('#community_1_svg', HASHTAGS_COMMUNITIES[2]);

    make_table_nodes_edges('#community_1_nodes_edges', node_edge);

    // Partition 12 FR

    var node_edge = zip(HASHTAGS_COMMUNITIES[3]['hashtags'],
        HASHTAGS_COMMUNITIES[3]['strong_links'],
        HASHTAGS_COMMUNITIES[3]['weak_links']
    )

    make_community_info_table('#community_12_info', HASHTAGS_COMMUNITIES[3]);

    make_sunburst_chart('#community_12_svg', HASHTAGS_COMMUNITIES[3]);

    make_table_nodes_edges('#community_12_nodes_edges', node_edge);

    // Partition 23 FR
    console.log(HASHTAGS_COMMUNITIES)
    var node_edge = zip(HASHTAGS_COMMUNITIES[5]['hashtags'],
        HASHTAGS_COMMUNITIES[5]['strong_links'],
        HASHTAGS_COMMUNITIES[5]['weak_links']
    )

    make_community_info_table('#community_23_info', HASHTAGS_COMMUNITIES[5]);

    make_sunburst_chart('#community_23_svg', HASHTAGS_COMMUNITIES[3]);

    make_table_nodes_edges('#community_23_nodes_edges', node_edge);

    // Partition 8 IE

    var node_edge = zip(HASHTAGS_COMMUNITIES[4]['hashtags'],
        HASHTAGS_COMMUNITIES[4]['strong_links'],
        HASHTAGS_COMMUNITIES[4]['weak_links']
    )

    make_community_info_table('#community_8_info', HASHTAGS_COMMUNITIES[4]);

    make_sunburst_chart('#community_8_svg', HASHTAGS_COMMUNITIES[4]);

    make_table_nodes_edges('#community_8_nodes_edges', node_edge);

    // Partition 6 IE

    var node_edge = zip(HASHTAGS_COMMUNITIES[6]['hashtags'],
        HASHTAGS_COMMUNITIES[6]['strong_links'],
        HASHTAGS_COMMUNITIES[6]['weak_links']
    )

    make_community_info_table('#community_24_info', HASHTAGS_COMMUNITIES[6]);

    make_sunburst_chart('#community_24_svg', HASHTAGS_COMMUNITIES[6]);

    make_table_nodes_edges('#community_24_nodes_edges', node_edge);

});

//dict_keys(['tweets_ids', 'hashtags', 'total_tweets', 'isolated_tweets', 'shared_tweets', 'community_isolation_by_tweets', 'isolated_geolocalized_tweets', 'isolated_mobile_apps', 'isolated_neutral_tweets', 'isolated_positive_tweets', 'isolated_negative_tweets', 'isolated_emm_news', 'geolocalized_tweets', 'mobile_apps', 'neutral_tweets', 'positive_tweets', 'negative_tweets', 'emm_news'])
//https://stackoverflow.com/questions/39617207/datatables-set-complex-headers-from-javascript