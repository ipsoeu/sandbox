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

        var $content = $('<div class="caption-section" style="margin-bottom:40px;"></div>');
        var $title = $('<h3></h3>').append(chart.app_name);
        var $subtitle = $('<h5>Temporal evolution of users activity, DATA tweets</h5>'.replace('DATA', chart['number_of_tweets']))
        
        var $chart_1 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
        $chart_1.append($('<img style="width: 100%" ></img>').attr('src',"contact_tracing_apps/" + chart['temporal_evolution'] ));

        $content.append($title)
        $content.append($subtitle)
        $content.append($chart_1);

        
        var emm_chart = _.find(this.emm, function(e){
                if(e.app_name == this)
                return true;
                else
                return false;
            }, chart.app_name );
        
        if(emm_chart != undefined){
            var $subtitle_3 = $('<h5>EMM news linked on Twitter</h5>')
            var $chart_3 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
            $chart_3.append($('<img style="width: 100%" ></img>').attr('src',"contact_tracing_apps/" + emm_chart['emm'] ));

            $content.append($subtitle_3);
            $content.append($chart_3);
            
        }
        
        
        var $chart_2 = $('<div style="text-align: center;margin-bottom: 10px;"></div>');
        $chart_2.append($('<img style="width: 100%" ></img>').attr('src',"contact_tracing_apps/" + chart['lang'] ))
        var $subtitle_2 = $('<h5>Languages</h5>')
        
        $content.append($subtitle_2);
        $content.append($chart_2);
        


        this.$content.append($content)
    }, {
        $content: $('#charts'),
        emm: EMM_CHARTS
    })

});