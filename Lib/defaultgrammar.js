//
//  testgrammar.js
//
/*
  The author or authors of this code dedicate any and all 
  copyright interest in this code to the public domain.
*/


// a very ambiguous grammar for doing calculations

var grammar = new Grammar('utt');

grammar.utt = [OneOf([
                       [Ref('annotate'),Ref('ent'),Tag("out = rules.ent")]
                       ])];

grammar.annotate = [Optional([OneOf([
    ['this', 'is'],
    ['these', 'are'],
    ['here', 'is'],
    ['here', 'are'],
    ['mark','this','as'],
    ['tag','this','as'],
    ['mark','these','as'],
    ['tag','these','as'],
])])];

grammar.ent = [OneOf([
    ['the','beatles',Tag("out = '<http://dbpedia.org/resource/The_Beatles>'")],
    ['beatles',Tag("out = '<http://dbpedia.org/resource/The_Beatles>'")],
    ['john','lennon', Tag("out = '<http://dbpedia.org/resource/John_Lennon>'")],
    ['lennon', Tag("out = '<http://dbpedia.org/resource/John_Lennon>'")],
    ['ringo','starr', Tag("out = '<http://dbpedia.org/resource/Ringo_Starr>'")],
    ['starr', Tag("out = '<http://dbpedia.org/resource/Ringo_Starr>'")],
    ['paul','mccartney', Tag("out = '<http://dbpedia.org/resource/Paul_McCartney>'")],
    ['mccartney', Tag("out = '<http://dbpedia.org/resource/Paul_McCartney>'")],
    ['george','harrison', Tag("out = '<http://dbpedia.org/resource/George_Harrison>'")],
    ['harrison', Tag("out = '<http://dbpedia.org/resource/George_Harrison>'")]
])]
                 
grammar.test = [OneOf([['test', Tag("out = 'Paris Hilton'")], ['pizza', Tag("out = 'Angela Merkel'")]])];

grammar.$check();