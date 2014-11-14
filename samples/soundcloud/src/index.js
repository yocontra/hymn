/* global document, window */

'use strict';

var React = require('react');
var Player = React.createFactory(require('../../../src'));
var lookup = require('soundcloud-lookup');
var async = require('async');
var attachFastClick = require('fastclick');
attachFastClick(document.body);
window.React = React; // for dev

var songs = [
  'https://soundcloud.com/gud-2/crushed',
  'https://soundcloud.com/gud-2/u-want-me',
  'https://soundcloud.com/gud-2/hello'
];

function lookupSong(url, cb) {
  var key = 'a3e059563d7fd3372b49b37f00a00bcf';
  lookup(url, key, cb);
}

var App = React.createClass({
  displayName: 'demo',
  propTypes: {
    songs: React.PropTypes.arrayOf(React.PropTypes.string).isRequired
  },
  getInitialState: function(){
    return {
      songs: null,
      idx: 0
    };
  },
  componentWillMount: function(){
    async.map(this.props.songs, lookupSong, function(err, songs){
      this.setState({
        songs: songs
      });
    }.bind(this));
  },
  nextSong: function(){
    var atEnd = (this.state.idx === this.state.songs.length-1);
    this.setState({
      idx: (atEnd ? 0 : ++this.state.idx)
    });
  },
  currentSong: function(){
    return this.state.songs[this.state.idx];
  },
  render: function(){
    if (!this.state.songs) {
      return null;
    }
    var song = this.currentSong();
    var mp3 = React.DOM.source({
      type: 'audio/mp3',
      src: song.stream_url
    });

    var player = Player({
      ref: 'songPlayer',
      key: this.state.idx,
      autoPlay: true,
      artwork: song.artwork_url.replace('-large', '-t500x500'),
      artist: song.user.username,
      title: song.title,
      onEnd: this.nextSong,
      onSkip: this.nextSong,
      onLike: this.nextSong,
      onDislike: this.nextSong
    }, mp3);
    return player;
  }
});
App = React.createFactory(App);

React.render(App({songs: songs}), document.body);