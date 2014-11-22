'use strict';

var React = require('react');
var ProgressBar = React.createFactory(require('./ProgressBar'));

var Player = React.createClass({
  displayName: 'Player',
  propTypes: {
    // custom info
    title: React.PropTypes.string.isRequired,
    artist: React.PropTypes.string,
    album: React.PropTypes.string,
    artwork: React.PropTypes.string,
    
    // stuff for the audio tag
    autoPlay: React.PropTypes.bool,
    loop: React.PropTypes.bool,
    muted: React.PropTypes.bool,
    preload: React.PropTypes.bool,

    onSkip: React.PropTypes.func,
    onEnd: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autoPlay: false,
      loop: false,
      muted: false,
      preload: true
    };
  },

  getInitialState: function() {
    return {
      playing: this.props.autoPlay,
      duration: 0,
      position: 0
    };
  },

  // component states
  toggle: function() {
    if (this.state.playing) {
      this.setPaused();
    } else {
      this.setPlaying();
    }
  },

  setPlaying: function() {
    this.setState({playing: true}, this.sync);
  },
  setPaused: function() {
    this.setState({playing: false}, this.sync);
  },

  seek: function(time) {
    var audioTag = this.refs.audioTag.getDOMNode();
    audioTag.currentTime = time;
  },

  // sync all non-props
  // back to the dom element
  sync: function() {
    var audioTag = this.refs.audioTag.getDOMNode();

    if (audioTag.paused && this.state.playing === true) {
      audioTag.play();
    } else if (!audioTag.paused && this.state.playing === false) {
      audioTag.pause();
    }

    this.setState({playing: !audioTag.paused});
    if (!isNaN(audioTag.duration)) {
      this.setState({
        duration: Math.floor(audioTag.duration*10)/10,
        position: Math.floor(audioTag.currentTime*10)/10
      });
    }
  },

  componentDidMount: function() {
    // hacks around react bug
    // TODO: break this out into an audio wrapper
    var audioTag = this.refs.audioTag.getDOMNode();
    audioTag.addEventListener('timeupdate', this.sync, false);
    audioTag.addEventListener('play', this.setPlaying, false);
    audioTag.addEventListener('playing', this.setPlaying, false);
    audioTag.addEventListener('pause', this.setPaused, false);

    if (this.props.onEnd) {
      audioTag.addEventListener('ended', this.props.onEnd, false);
    }

    this.sync();
  },

  componentWillUnmount: function() {
    // hacks around react bug
    // TODO: break this out into an audio wrapper
    var audioTag = this.refs.audioTag.getDOMNode();
    audioTag.removeEventListener('timeupdate', this.sync, false);
    audioTag.removeEventListener('play', this.setPlaying, false);
    audioTag.removeEventListener('pause', this.setPaused, false);

    if (this.props.onEnd) {
      audioTag.removeEventListener('ended', this.props.onEnd, false);
    }
  },

  render: function(){
    var audioTag = React.DOM.audio({
      ref: 'audioTag',
      key: 'audioTag',
      controls: false,

      loop: this.props.loop,
      muted: this.props.muted,
      preload: this.props.preload,

      onTimeUpdate: this.sync,
      onEnded: this.props.onEnd
    }, this.props.children);

    // information
    var artwork = this.props.Artwork || React.DOM.div({
      key: 'artwork',
      className: 'hymn-artwork',
      style: {
        backgroundImage: 'url('+this.props.artwork+')'
      }
    });

    var title = React.DOM.p({
      ref: 'title',
      key: 'title',
      className: 'hymn-title',
      title: this.props.title
    }, this.props.title);

    var album = this.props.album ? React.DOM.p({
      ref: 'album',
      key: 'album',
      className: 'hymn-album',
      title: this.props.album
    }, this.props.album) : null;

    var artist = this.props.artist ? React.DOM.p({
      ref: 'artist',
      key: 'artist',
      className: 'hymn-artist',
      title: this.props.artist
    }, this.props.artist) : null;

    var info = React.DOM.div({
      ref: 'info',
      key: 'info',
      className: 'hymn-info'
    }, [title, album, artist]);

    // controls
    var playPauseClass = this.state.playing ? 'hymn-pause' : 'hymn-play';
    var playPause = React.DOM.button({
      ref: 'playPause',
      key: 'playPause',
      className: 'hymn-control ' + playPauseClass,
      onClick: this.toggle
    });

    var skipButton = React.DOM.button({
      ref: 'skipButton',
      key: 'skipButton',
      className: 'hymn-control hymn-skip',
      onClick: this.props.onSkip
    });

    var progressBar = ProgressBar({
      ref: 'progressBar',
      key: 'progressBar',
      className: 'hymn-progress',
      value: this.state.position,
      total: this.state.duration,
      onSeek: this.seek
    });

    var controlChildren = [playPause, progressBar];
    if (this.props.onSkip) {
      controlChildren.push(skipButton);
    }
    var controls = React.DOM.div({
      ref: 'controls',
      key: 'controls',
      className: 'hymn-controls'
    }, controlChildren);

    // bring it all in
    var className = this.props.className || 'hymn-player';
    var container = React.DOM.div({
      ref: 'container',
      className: className,
      style: this.props.style
    }, [artwork, info, controls, audioTag]);
    return container;
  }
});

module.exports = Player;