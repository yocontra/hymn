/* global document, window */

'use strict';

var Player = require('../../../src');
var React = require('react');
window.React = React; // for dev

var App = React.createClass({
  displayName: 'demo',
  render: function(){
    var player = Player({
      src: 'chopin.mp3',
      artwork: 'chopin.jpg',
      autoPlay: true,
      artist: 'Frederic Chopin',
      album: 'Greatest Hits',
      title: 'Nocturne in E Flat Major'
    });
    return player;
  }
});

React.renderComponent(App(), document.body);