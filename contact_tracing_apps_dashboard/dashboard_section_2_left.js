function make_tag_cloud_chart(words_data) {
    
    var color = d3.scaleOrdinal(d3.schemeAccent);

    var wordScale = d3.scaleLinear();
    wordScale.domain([0, d3.max(words_data, function(d) {return d.value; })]);
    wordScale.range([5, 150]);

    
    var layout = d3.layout.cloud()
        .size([500, 400])
        .words(words_data.map(function(d){
            return {text: d.text, size: wordScale(d.value)};
        }))
        .padding(1)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function (d) { return d.size })
        .random(function(d) { return 0.5; })
        .text(function(d){return d.text;})
        .on("end", draw);
    
        layout.start();

    
    
    function draw(words) {
            d3.select('#_wordgloud_svg').remove();
            d3.select('#section_2_left_svg')
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .append("g")
            .attr("id","_wordgloud_svg")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }

    layout.stop();
}


$(document).ready(function () {

    get_data = function (value) {
        _data = {
            '1': WORDCLOUD_EMM,
            '0': WORDCLOUD_HASHTAGS,
            
        }
        return _data[value].slice(0);;
    }


    make_tag_cloud_chart(get_data('0'));

    $("#section_2_left_menu").change(function (e) {
        console.log('inut value', this.value)
        make_tag_cloud_chart(get_data(this.value));
    });

});