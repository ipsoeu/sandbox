$(document).ready(function () {

    $('#total_tweets').append(SA_GENERAL_INFO['total_tweets']);
    $('#neutral_tweets_relative').append(SA_GENERAL_INFO['neutral_tweets_relative']);
    $('#neutral_tweets').append(SA_GENERAL_INFO['neutral_tweets']);

    $('#no_classified_tweets_relative').append(SA_GENERAL_INFO['no_classified_tweets_relative']);
    $('#no_classified_tweets').append(SA_GENERAL_INFO['no_classified_tweets']);


    $('#no_classified_tweets').append(SA_GENERAL_INFO['no_classified_tweets']);

    $('#others_tweet').append(LANGS_PIECHART['Others'])
    $('#undefined_tweet').append(LANGS_PIECHART['Undefined'])
    
    $('#negative_tweets').append(SA_GENERAL_INFO['negative_tweets']);
    $('#positive_tweets').append(SA_GENERAL_INFO['positive_tweets']);

    $('#with_opinions').append(SA_GENERAL_INFO['positive_tweets_relative'] + SA_GENERAL_INFO['negative_tweets_relative'])
    var data = JSON.parse(JSON.stringify(SA_BY_APP));
    $('#sa_table').DataTable({
        data: data,
        columns: [
            { data: function (e) { return e.app_name.slice(0, 2); }, title: "Country" },
            { data: function (e) { return e.app_name.slice(3).replace('_', ' '); }, title: "App name" },
            { title: "Total tweets", data: 'total_tweets' },
            
            { title: "Neutral tweets (%)", data: 'neutral_tweets_relative' },
            { title: "Positive tweets (%)", data: 'positive_tweets_relative' },
            { title: "Negative tweets (%)", data: 'negative_tweets_relative' },
            { title: "Unclassified tweets (%)", data: 'unclassified_tweets_relative' },
        ],
        order: [[2, "desc"]],
        paging: false
    });

});