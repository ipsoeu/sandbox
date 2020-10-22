// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Word2Vec example with p5.js. Using a pre-trained model on common English words.
=== */

let word2Vec;
console.log('start')
function modelLoaded() {
    select('#semantic-search').show()
    select('#status').html('Model Loaded');
}

function setup() {
    noLoop();
    noCanvas();

    // Create the Word2Vec model with pre-trained file of 10,000 words
    word2Vec = ml5.word2vec('stoten/tweets.w2v.json', modelLoaded);

    // Select all the DOM elements
    let nearWordInput = select('#nearword');
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
      ];
      
    //   $('#nearword').autoComplete({
    //     resolverSettings: {
    //         url: 'stoten/tweets.vocab.json'
    //     }
    // });


    let nearButton = select('#submit');
    let nearResults = select('#results');

    let betweenWordInput1 = select("#between1");
    let betweenWordInput2 = select("#between2");
    let betweenButton = select("#submit2");
    let betweenResults = select("#results2");

    let addInput1 = select("#isto1");
    let addInput2 = select("#isto2");
    let addInput3 = select("#isto3");
    let addButton = select("#submit3");
    let addResults = select("#results3");

    // Finding the nearest words
    nearButton.mousePressed(() => {
        console.log('ok')
        let word = nearWordInput.value();
        word2Vec.nearest(word, 20, (err, result) => {
            let output = '';
            if (result) {
                for (let i = 0; i < result.length; i++) {
                    output += result[i].word + '<br/>';
                }
            } else {
                output = 'No word vector found';
            }
            nearResults.html(output);
        });
    });

    
    betweenButton.mousePressed(() => {
        let word1 = betweenWordInput1.value();
        let word2 = betweenWordInput2.value();
        word2Vec.average([word1, word2], 4, (err, average) => {
            betweenResults.html(average[0].word);
        })
    });

    
    addButton.mousePressed(() => {
        let is1 = addInput1.value();
        let to1 = addInput2.value();
        let is2 = addInput3.value();
        word2Vec.subtract([to1, is1])
            .then(difference => word2Vec.add([is2, difference[0].word]))
            .then(result => addResults.html(result[0].word))
    });
}