
$(document).ready(function () {





    var top_events = JSON.parse(JSON.stringify(TEMPORAL_EVOLUTION_BY_APP));

    top_events = top_events.sort((a, b) => b.zscore - a.zscore)


    
    $("#events_by_zscore").DataTable({
        data: top_events.slice(0, 50),
        columns: [
            { data: "datetime_str", title: "Date" },
            { data: "zscore", title: "Z-score index" },
            { data: "total", title: "Number of tweets" },

        ],
        order: [[1, "desc"]],
        columnDefs: [{
            targets: [1],
            render: $.fn.dataTable.render.number(',', '.', 3)
        }],
        // 'paging': false
    });

});
