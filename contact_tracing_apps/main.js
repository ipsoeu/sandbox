$(document).ready(function () {

    var values = Object.values(DATA);

    $('#total_tweets').append(values.reduce(function (a, b) { return a + b; }, 0))

    //$('#sa_n_of_tweets').append(SA_N_TWEETS);

    data_sets = []
    for (var key in DATA) {
        data_sets.push([key, DATA[key]])
    }

    $('#app_list').DataTable({
        data: data_sets,
        columns: [
            { title: "Mobile application name" },
            { title: "Number of tweets" }
        ],
        order: [[1, "desc"]],
        paging: false
    });

    _.each(CHARTS, function (chart, index) {

        var $content = $('<div class="caption-section" style="margin-bottom:40px;"></div>');
        var $title = $('<h3></h3>').append(chart.app_name);
        var $subtitle = $('<h5>Temporal evolution of users activity, DATA tweets</h5>'.replace('DATA', chart['number_of_tweets']))

        var $chart_1 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
        $chart_1.append($('<img style="width: 100%" ></img>').attr('src', "contact_tracing_apps/" + chart['temporal_evolution']));

        $content.append($title)
        $content.append($subtitle)
        $content.append($chart_1);

        this.$content.append($content)
    }, {
        $content: $('#charts')
    });

    $('#sentiment-analysis-table').DataTable({
        data: _.map(SA_TABLE, function (value) {
            return [
                value['app'],
                value['total'],
                value['positive'],
                value['negative'],
                value['neutral'],
                value['undefined'],
            ]
        }),
        columns: [
            { title: "App name" },
            { title: "Total tweets" },
            { title: "Positive tweets" },
            { title: "Negative tweets" },
            { title: "Neutral tweets" },
            { title: "Not classified tweets" },
        ],
        order: [[1, "desc"]],
        paging: false
    });

});