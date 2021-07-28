$(document).ready(function () {

    

    $('#sa_table').DataTable({
        data: SA_DATA_TABLE_RELATIVE,
        columns: [
            { data: function(e){return e.app_name.slice(0,2);}, title: "Country" },
            { data: function(e){return e.app_name.slice(3).replace('_', ' ');}, title: "App name" },
            { title: "Number of tweets", data: 'n_of_tweets' },
            { title: "Neutral tweets (%)", data: 'neutral' },
            { title: "Positive tweets (%)", data: 'positive' },
            { title: "Negative tweets (%)", data: 'negative' },
        ],
        order: [[2, "desc"]],
        paging: false
    });
    
});