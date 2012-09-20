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
                       [Ref('deictic'), Ref('ne'), Tag("out = rules.ne")],
                       [Ref('test'), Tag("out = rules.test")],
                       ])];
                       
grammar.deictic = [Optional([OneOf([
    ['this', 'is'],
    ['these', 'are'],
    ['here', 'is'],
    ['here', 'are'],
    ['mark','this','as'],
    ['tag','this','as'],
    ['mark','these','as'],
    ['tag','these','as'],
])])];

grammar.ne = [OneOf([
    ['the','beatles',Tag("out = 'The Beatles'")],
    ['beatles',Tag("out = 'The Beatles'")],
    ['john','lennon', Tag("out = 'John Lennon'")],
    ['lennon', Tag("out = 'John Lennon'")],
    ['ringo','starr', Tag("out = 'Ringo Starr'")],
    ['starr', Tag("out = 'Ringo Starr'")],
    ['paul','mccartney', Tag("out = 'Paul McCartney'")],
    ['mccartney', Tag("out = 'Paul McCartney'")],
    ['george','harrison', Tag("out = 'George Harrison'")],
    ['harrison', Tag("out = 'George Harrison'")],
    ['stuart','sutcliffe', Tag("out = 'Stuart Sutcliffe'")],
    ['sutcliffe', Tag("out = 'Stuart Sutcliffe'")],
    ['pete','best', Tag("out = 'Pete Best'")],
    ['best', Tag("out = 'Pete Best'")],
    ['brian','epstein', Tag("out = 'Brian Epstein'")],
    ['epstein', Tag("out = 'Brian Epstein'")],
    ['george','martin', Tag("out = 'George Martin'")],
    ['martin', Tag("out = 'George Martin'")],
    
])]
                 
grammar.test = [OneOf([['test', Tag("out = 'Paris Hilton'")], ['pizza', Tag("out = 'Angela Merkel'")]])];

grammar.$check();