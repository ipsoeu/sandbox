$( document ).ready(function() {
    
    var values = Object.values(DATA);

    $('#total_tweets').append(values.reduce(function(a, b) { return a + b; }, 0))

    data_sets = []
    for (var key in DATA) {
        data_sets.push([key, DATA[key]])
    }
    
    $('#app_list').DataTable( {
        data: data_sets,
        columns: [
            { title: "Mobile application name" },
            { title: "Number of tweets"}
        ],
        order: [[ 1, "desc" ]],
        paging: false
    } );

    _.each(CHARTS, function(chart, index){
        console.log(chart)
        var $content = $('<div class="caption-section"></div>');
        var $title = $('<h3></h3>').append(chart.app_name);
        var $subtitle = $('<h5>Temporal evolution of users activity, DATA tweets</h5>'.replace('DATA', chart['number_of_tweets']))
        var $chart_1 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
        $chart_1.append($('<img style="width: 100%" ></img>').attr('src',"contact_tracing_apps/" + chart['temporal_evolution'] ));
        var $chart_2 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
        $chart_2.append($('<img style="width: 100%" ></img>').attr('src',"contact_tracing_apps/" + chart['lang'] ))
        
        $content.append($title)
        $content.append($subtitle)
        $content.append($chart_1);
        $content.append($chart_2);


        this.append($content)
    },$('#charts'))

});