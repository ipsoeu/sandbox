$(document).ready(function () {

    

    $('#sa_table').DataTable({
        data: SA_DATA_TABLE_RELATIVE,
        columns: [
            { title: "App name" },
            { title: "Number of tweets" },
            { title: "Neutral tweets (%)" },
            { title: "Positive tweets (%)" },
            { title: "Negative tweets (%)" },
        ],
        order: [[1, "desc"]],
        paging: false
    });
    
});