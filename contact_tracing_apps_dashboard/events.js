$(document).ready(function () {
    
    $('#events_number').append(_.size(EVENTS))

    _.each(EVENTS, function(event){

        var $table = $('<table></table>');

        $('#events_list').append($table);
        
        $table.DataTable({
            data: _.map(event, function (value) {
                var entities = value['organizations'].concat(value['misc']).concat(value['person']);
                console.log(entities)
                return [
                    value['app_name'],
                    
                    value['count'],
                    
                    value['datetime'],
                    
                    _.map(value['place_names'], function(v){
                        return v[0] + '(' + v[1] + ')'
                    }).join(', '),

                    _.map(value['hashtags'], function(v){
                        return v[0] + '(' + v[1] + ')'
                    }).join(', '),

                    
                    _.map(entities, function(v){
                        return v[0] + '(' + v[1] + ')'
                    }).join(', '),
                    
                    value['type_event']
                ]
            }),
            columns: [
                { title: "App name" },
                { title: "Total tweets" },
                { title: "Positive tweets" },
                { title: "Place names" },
                { title: "Hashtags" },
                { title: "Entities" },
                { title: "Type event"}
            ],

            order: [[1, "desc"]],
            paging: false
        });

    })

});

