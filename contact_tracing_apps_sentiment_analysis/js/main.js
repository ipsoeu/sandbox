$(document).ready(function () {
    var data = JSON.parse(JSON.stringify(SA_BY_APP));
    $('#sa_table').DataTable({
        data: data,
        columns: [
            { data: function (e) { return e.app_name.slice(0, 2); }, title: "Country" },
            { data: function (e) { return e.app_name.slice(3).replace('_', ' '); }, title: "App name" },
            { title: "Total tweets", data: 'total_tweets' },
            { title: "Classified tweets", data: 'classified_tweets' },
            { title: "Neutral tweets (%)", data: 'neutral_tweets_relative' },
            { title: "Positive tweets (%)", data: 'positive_tweets_relative' },
            { title: "Negative tweets (%)", data: 'negative_tweets_relative' },
        ],
        order: [[2, "desc"]],
        paging: false
    });

});