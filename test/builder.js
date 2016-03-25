'use strict'

const test = require('tap').test
const Builder = require('../')
const common = require('./common')
const gen = common.gen

test('Builder', (t) => {
  const b = Builder()
    .use('strict')
    .declare('const', 'http', Builder.require('http'))
    .declare('let', 'join', Builder.require('path', 'posix.join'))
    .module('Event')
    .assign('Event.VERSION', Builder.string('1.0.0'))
    .function('Event', ['buffer'], [
      Builder.ifNot(
        Builder.instanceOf(
          Builder.this()
        , Builder.id('Event')
        )
      , Builder.block(
          Builder.returns(Builder.new('Event', ['buffer']))
        )
      )
    ])
    .assign('Event.prototype.names', Builder.array([
      Builder.string('a')
    , Builder.string('b')
    , Builder.string('c')
    ]))
    .assign('Event.prototype.ages', Builder.array([
      Builder.number('1')
    , Builder.number('2')
    , Builder.number('3')
    ]))
    .program()

  t.equal(gen(b), `'use strict';
const http = require('http');
let join = require('path').posix.join;
module.exports = Event;
Event.VERSION = '1.0.0';
function Event(buffer) {
  if (!(this instanceof Event)) {
    return new Event(buffer)
  }
}
Event.prototype.names = [
  'a',
  'b',
  'c'
];
Event.prototype.ages = [
  1,
  2,
  3
]`)

  t.end()
})
