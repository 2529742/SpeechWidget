SpeechWidget
============

SpeechWidget - is a [VIE](http://viejs.org) widget.

It allows to use speech input in web applications in order to query for entities. 

[running demo](http://2529742.github.io/SpeechWidget/)

Example
=======

A sample code:

    //VIE instance
    var VIE = new VIE();
 
    // a function which assigns the click event handler to the chosen selectors (in this case "img"), e.g., once user clicks an image, the voice recording dialog appears.*/
     $('img').click(function(){
    	var image = $(this);
    	image.vieSpeechWidget({
    		vie: myVIE,
    		entityHandler: function(entities){
    			annotateImage(entities,image);
    		}
    	});
     }); 
    
    /* a function which handle the entities found by widget. Here it wraps the clicked image into a span and set to the span about to the URI of the first found entity */
     var annotateImage = function(entities, element){
    	var url = entities[0].getSubjectUri();
    	element.wrap('<span about="' + url + '">');
     };
     
Widget parameters:
------------------

* *vie* - VIE instance, if doesn't exist a new VIE will be initialized by default;

* *entityHandler* - a function which will handle a resulted entity (like wrapping the clicked element in span and then annotating it or writing the found entity in VIE if it didn't appear in VIE.entites before);

* *options* - any option a developer want to specify, like onlyVIEsearch: true - could mean to query only in the existing entities, etc. (wip)

Data flow:
----------

**1.** The speech input gets recognized by the Google Voice and is returned as a text string.

**2.** The text string is spitted into an array of words, that is passed to the Chart Parser. The Chart Parser applies Grammar to the text input.

The Grammar consists of:

* default rules
* specific developer's rules
* context-based rules

The default rules aim to recognize an annotation task: #annotationrule

    grammar.annotate = [Optional([OneOf([
        ['this', 'is'],
        ['mark','this','as'],
        ['tag','this','as']
    ...
    ])])];
    
The developer can introduce his own specific rules:

    grammar.extra = [OneOf([
        ['The most famous British group in the world',Tag("out = 'The Beatles'")]
    ])]

As a next step, we want to introduce context-based rules, which can be constructed automatically from the context, so we could address the existing VIE entities for the annotation. Such rules should tag the entity occurrences in the text with entity's URI, e.g.: We can extract the Person Entity "John Lennon" from the article:

    ..The group's best-known lineup consisted of John Lennon (rhythm guitar, vocals)..

and then tag the grammar with the entities's URI = http://dbpedia.org/resource/John_Lennon:

    grammar.context = [OneOf([
    ['john','lennon', Tag("out = 'http://dbpedia.org/resource/John_Lennon'")]
    ])]; 

The context-based rules haven't been implemented yet.

**3.** The Chart Parser outputs a chart. Its passive edges contain indexes of words or groups of words, that have been covered by any rule from the Grammar, and the label of the applied rule.

For example the input:

'This is John Lennon' will be indexed as follows: '0 This 1 is 2 John 3 Lennon 4' the annotation rule will be applied to the group 0-2 and the context rule will be applied to the group 2-4.

Based on this information, we can extract:

* if the annotation task was uttered
* if the annotation task refers to existing VIE entities.
* If the annotation task was not uttered, then we go back to the starting point (waiting for a new speech input), otherwise we check if the annotation refers the existing VIE entities:

if YES then we return the corresponding entities if NO then we pass the whole text input (with changes applied by the specific developer's rules) to Stanbol.

**4.** The text input gets processed with VIE Stanbol and DBPedia serviсes and the resulted entities then passed to the entityHandler function, which is specified by the developer.
