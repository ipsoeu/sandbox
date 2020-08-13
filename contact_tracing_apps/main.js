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


});