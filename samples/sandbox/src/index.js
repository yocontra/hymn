/* global document, window */

'use strict';

var React = require('react');
var Player = React.createFactory(require('../../../src'));

window.React = React; // for dev

var songs = [
  {
    src: 'res/chopin-c.mp3',
    artwork: 'res/chopin-c.jpg',
    artist: 'Frédéric Chopin',
    album: 'Life and Works',
    title: 'Nocturne in C Sharp Minor'
  },
  {
    src: 'res/chopin.mp3',
    artwork: 'res/chopin.jpg',
    artist: 'Frédéric Chopin',
    album: 'The Very Best Of Chopin',
    title: 'Nocturne in E Flat Major'
  }
];

var App = React.createClass({
  displayName: 'demo',
  getInitialState: function(){
    return {
      songs: songs,
      idx: 0
    };
  },
  prevSong: function(){
    var atStart = (this.state.idx === 0);
    this.setState({
      idx: (atStart ? this.state.songs.length-1 : --this.state.idx)
    });
  },
  nextSong: function(){
    var atEnd = (this.state.idx === this.state.songs.length-1);
    this.setState({
      idx: (atEnd ? 0 : ++this.state.idx)
    });
  },
  render: function(){
    var song = this.state.songs[this.state.idx];
    var mp3 = React.DOM.source({
      type: 'audio/mp3',
      src: song.src
    });

    var player = Player({
      ref: 'songPlayer',
      key: this.state.idx,
      autoPlay: true,
      artwork: song.artwork,
      artist: song.artist,
      album: song.album,
      title: song.title,
      onEnd: this.nextSong,
      onPrev: this.prevSong,
      onSkip: this.nextSong
    }, mp3);
    return player;
  }
});
App = React.createFactory(App);

React.render(App(), document.body);