function make_tag_cloud_chart(svg, words_data) {

    var color = d3.scaleOrdinal(d3.schemeAccent);

    var wordScale = d3.scaleLinear();
    wordScale.domain([0, d3.max(words_data, function (d) { return d.value; })]);
    wordScale.range([5, 150]);

    draw_tagcloud = function (words) {
        //d3.select('#_wordgloud_svg').remove();
        svg
            //.attr("width", layout.size()[0])
            //.attr("height", layout.size()[1])
            .append("g")
            .attr("id", "_wordgloud_svg")
            .attr("transform", "translate(570, 200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }


    var layout = d3.layout.cloud()
        .size([350, 350])
        .words(words_data.map(function (d) {
            return { text: d.text, size: wordScale(d.value) };
        }))
        .padding(1)
        .rotate(function () { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size })
        .random(function (d) { return 0.5; })
        .text(function (d) { return d.text; })
        .on("end", draw_tagcloud);

    layout.start();





    layout.stop();
}


// $(document).ready(function () {

//     get_data = function (value) {
//         _data = {
//             '1': WORDCLOUD_EMM,
//             '0': WORDCLOUD_HASHTAGS,

//         }
//         return _data[value].slice(0);;
//     }

//     console.log(WORDCLOUD_EMM)
//     // make_tag_cloud_chart(get_data('0'));

//     // $("#section_2_left_menu").change(function (e) {
//     //     console.log('inut value', this.value)
//     //     make_tag_cloud_chart(get_data(this.value));
//     // });

// });