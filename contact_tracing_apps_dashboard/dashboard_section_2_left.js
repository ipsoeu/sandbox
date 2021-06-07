function make_tag_cloud_chart(words) {

    

    const margin = { top: 30, right: 30, bottom: 30, left: 30 },
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    // const svg_word_cloud = d3.select('#section_2_left')
    //     .append('svg')
    //     .attr('id', 'section_2_left_svg')
    //     .attr('width', width + margin.left + margin.top)
    //     .attr('height', height + margin.top + margin.bottom)
    //     .attr('x', 500)
    //     //.append('g')
    //     //.attr('transform', `translate(${margin.left} ${margin.top})`);

    // var words = event.map(function (item) {
    //     var wordcloud = item.hashtags.map(function (h) {
    //         if (h[1] > 1)
    //             return { 'text': h[0], 'size': h[1] }
    //     })
    //     return wordcloud.filter(function (w) {
    //         return w != undefined;
    //     });

    // });
    //var words = [].concat.apply([], words);
    console.log(words)

    var color = d3.scaleLinear()
        .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);


    var layout = d3.layout.cloud()
        .size([500, 500])
        .words(words)
        .padding(5)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size; })
        .on("end", draw);

    layout.start();

    function draw(words) {
            console.log(words)
            d3.select('#section_2_left_svg')
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }
}


$(document).ready(function () {

    // get_data = function (value) {
    //     _data = {
    //         '0': APPS_PIECHART,
    //         '1': LANGS_PIECHART,
    //         '2': SA_PIECHART
    //     }
    //     return _data[value];
    // }

    
    make_tag_cloud_chart(WORDCLOUD_EMM);

    // $("#section_1_left_menu").change(function (e) {
    //     make_pie_chart(get_data(this.value));
    // });
});