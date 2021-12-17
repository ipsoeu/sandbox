
$(document).ready(function () {

    var top_events = JSON.parse(JSON.stringify(TEMPORAL_EVOLUTION_BY_APP));

    var positive_top_events = JSON.parse(JSON.stringify(TEMPORAL_EVOLUTION_BY_APP_POSITIVE));

    var negative_top_events = JSON.parse(JSON.stringify(TEMPORAL_EVOLUTION_BY_APP_NEGATIVE));

    top_events = top_events.sort((a, b) => b.zscore - a.zscore)


    
    $("#events_by_zscore").DataTable({
        data: top_events,
        columns: [
            { data: "datetime_str", title: "Date" },
            { data: "zscore", title: "Z-score index" },
            { data: "total", title: "Number of tweets" },
            {data:function (d){
                record = JSON.parse(JSON.stringify(d));
                delete record['datetime']
                delete record['datetime_str']
                keys = Object.keys(record).sort(function(a,b){return record[b] - record[a]})
                
                
                return `${keys[1]}(${record[keys[1]]}), ${keys[2]}(${record[keys[2]]}), ${keys[3]}(${record[keys[3]]}), `
            },
            title: 'Main mobile apps'}

        ],
        order: [[1, "desc"]],
        columnDefs: [{
            targets: [1],
            render: $.fn.dataTable.render.number(',', '.', 3)
        }],
        // 'paging': false
    });

    $("#positive_events_by_zscore").DataTable({
        data: positive_top_events,
        columns: [
            { data: "datetime_str", title: "Date" },
            { data: "zscore", title: "Z-score index" },
            { data: "total", title: "Number of tweets" },
            {data:function (d){
                record = JSON.parse(JSON.stringify(d));
                delete record['datetime']
                delete record['datetime_str']
                keys = Object.keys(record).sort(function(a,b){return record[b] - record[a]})
                
                
                return `${keys[1]}(${record[keys[1]]}), ${keys[2]}(${record[keys[2]]}), ${keys[3]}(${record[keys[3]]}), `
            },
            title: 'Main mobile apps'}

        ],
        order: [[1, "desc"]],
        columnDefs: [{
            targets: [1],
            render: $.fn.dataTable.render.number(',', '.', 3)
        }],
        // 'paging': false
    });

    $("#negative_events_by_zscore").DataTable({
        data: negative_top_events,
        columns: [
            { data: "datetime_str", title: "Date" },
            { data: "zscore", title: "Z-score index" },
            { data: "total", title: "Number of tweets" },
            {data:function (d){
                record = JSON.parse(JSON.stringify(d));
                delete record['datetime']
                delete record['datetime_str']
                keys = Object.keys(record).sort(function(a,b){return record[b] - record[a]})
                
                
                return `${keys[1]}(${record[keys[1]]}), ${keys[2]}(${record[keys[2]]}), ${keys[3]}(${record[keys[3]]}), `
            },
            title: 'Main mobile apps'}

        ],
        order: [[1, "desc"]],
        columnDefs: [{
            targets: [1],
            render: $.fn.dataTable.render.number(',', '.', 3)
        }],
        // 'paging': false
    });

});
