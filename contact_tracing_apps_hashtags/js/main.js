function make_community_info_table(html_id, info) {

    var $list = $('<dl></dl>');

    $list.append($(`<dt>Number of Hashtags: ${info['hashtags_count']}</dt>`));
    $list.append($('<dt>Number of tweets</dt>'));
    $list.append(`<dd>- Total: ${info['total_tweets']}</dd>`)
    $list.append(`<dd>- Shared: ${info['shared_tweets']}</dd>`)
    $list.append(`<dd>- NOT Shared: ${info['isolated_tweets']}</dd>`)
    $list.append(`<dd>- Geolocalized: ${info['geolocalized_tweets']}</dd>`)
    
    $list.append($('<dt>Sentiment analysis</dt>'));
    $list.append(`<dd>- Positive: ${info['positive_tweets']}</dd>`)
    $list.append(`<dd>- Negative: ${info['negative_tweets']}</dd>`)
    $list.append(`<dd>- Neutral: ${info['neutral_tweets']}</dd>`)

    $list.append($('<dt>Sentiment analysis on isolated tweets</dt>'));
    $list.append(`<dd>- Positive: ${info['isolated_positive_tweets']}</dd>`)
    $list.append(`<dd>- Negative: ${info['isolated_negative_tweets']}</dd>`)
    $list.append(`<dd>- Neutral: ${info['isolated_neutral_tweets']}</dd>`)
    
    $list.append($('<dt>EMM news</dt>'));
    $list.append(`<dd>- News: ${info['emm_news']}</dd>`)
    $list.append(`<dd>- News on isolated tweets: ${info['isolated_emm_news']}</dd>`)

    $(html_id).append($list)


}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

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
                    return d.mobile_apps.slice(0, 1).map(function (e) { return e.name }).join(', ');
                }, title: 'Main mobile app'
            },

            { data: "hashtags_count", title: "Number of Hashtags" },

            { data: "total_tweets", title: 'Number of Tweets' },

            { data: "community_isolation_by_tweets", title: 'Isolation index' },

            { data: "density", title: 'Density' },

            { data: "emm_news", title: 'EMM news' },
        ],
        order: [[3, "desc"]],
    });

    $('#network_density').append(NETWORK_INFO['density']);
    $('#network_nodes').append(NETWORK_INFO['nodes']);
    $('#network_edges').append(NETWORK_INFO['edges']);


    // Partition 1
    console.log(zip(HASHTAGS_COMMUNITIES[0]['hashtags'], HASHTAGS_COMMUNITIES[0]['links']))
    make_community_info_table('#community_1_info', HASHTAGS_COMMUNITIES[0])


});

//dict_keys(['tweets_ids', 'hashtags', 'total_tweets', 'isolated_tweets', 'shared_tweets', 'community_isolation_by_tweets', 'isolated_geolocalized_tweets', 'isolated_mobile_apps', 'isolated_neutral_tweets', 'isolated_positive_tweets', 'isolated_negative_tweets', 'isolated_emm_news', 'geolocalized_tweets', 'mobile_apps', 'neutral_tweets', 'positive_tweets', 'negative_tweets', 'emm_news'])
//https://stackoverflow.com/questions/39617207/datatables-set-complex-headers-from-javascript