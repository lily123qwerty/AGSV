function drawGraph(graph) {
    var svg = '<svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">';
    //draw all triangle
    for (var key in graph['triangle']) {
        svg = svg + '<polygon points="';

        var vertex = graph['triangle'][key]['vertices'];
        for (var i in vertex) {
            var dot_key = vertex[i];
            //console.log(dot_key);
            var dot = graph['dot'][dot_key];
            svg = svg + dot['x'] + ',' + dot['y'] + ' ';
        }

        svg = svg + '" fill="none" stroke="black" />';
    }

    //draw dot style
    for (var key in graph['dot']) {
        var dot = graph['dot'][key];
        if (dot['style'] && dot['style']['visible']) {
            svg =
                svg +
                '<circle cx="' +
                dot['x'] +
                '" cy="' +
                dot['y'] +
                '" r="' +
                dot['style']['size'] +
                '" fill=' +
                dot['style']['color'] +
                ' />';

            if (dot['style']['label']) {
                //TODO: calculate label position
                svg =
                    svg +
                    '<text x="' +
                    (dot['x'] + dot['style']['size'] + 10) +
                    '" y="' +
                    dot['y'] +
                    '" fill="' +
                    dot['style']['color'] +
                    '">' +
                    dot['style']['label'] +
                    '</text>';
            }
        }
    }
    svg = svg + '</svg>';
    return svg;
}
