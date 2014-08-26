'use strict';

var ReactCompositeComponent = require('react/lib/ReactCompositeComponent');
var DOM = require('react/lib/ReactDOM');
var PropTypes = require('react/lib/ReactPropTypes');

var Player = ReactCompositeComponent.createClass({
  displayName: 'Player',
  propTypes: {
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    album: PropTypes.string,
    artist: PropTypes.string,
    autoPlay: PropTypes.bool,
    loop: PropTypes.bool,
    muted: PropTypes.bool,
    preload: PropTypes.bool,
    onSkip: PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autoPlay: false,
      loop: false,
      muted: false,
      volume: 1,
      preload: true
    };
  },

  getInitialState: function() {
    return {
      playing: this.props.autoPlay,
      volume: this.props.volume
    };
  },

  // component states
  toggle: function() {
    this.setState({
      playing: !this.state.playing
    });
    this.sync();
  },

  setVolume: function(e) {
    this.setState({
      volume: e.target.value
    });
    this.sync();
  },

  // sync all non-props
  // back to the dom element
  sync: function() {
    var audioTag = this.refs.audioTag.getDOMNode();
    audioTag.volume = this.state.volume;

    if (this.state.playing) {
      audioTag.play();
    } else {
      audioTag.pause();
    }
  },

  componentDidMount: function() {
    this.sync();
  },

  render: function(){
    var audioTag = DOM.audio({
      ref: 'audioTag',
      key: 'audioTag',
      controls: false,
      src: this.props.src,
      loop: this.props.loop,
      muted: this.props.muted,
      preload: this.props.preload,
      autoPlay: this.props.autoPlay
    });

    var playPauseClass = this.state.playing ? 'hymn-pause' : 'hymn-play';
    var playPause = DOM.button({
      ref: 'playPause',
      key: 'playPause',
      className: 'hymn-control ' + playPauseClass,
      onClick: this.toggle
    });

    var skipButton = DOM.button({
      ref: 'skipButton',
      key: 'skipButton',
      className: 'hymn-control hymn-skip',
      onClick: this.props.onSkip
    });

    /*
    var volumeSlider = DOM.input({
      ref: 'volumeSlider',
      key: 'volumeSlider',
      className: 'hymn-volume-slider',
      type: 'range',
      step: 0.01,
      min: 0,
      max: 1,
      value: this.state.volume,
      onChange: this.setVolume
    });
    */

    var progressBar = DOM.progress({
      ref: 'progressBar',
      key: 'progressBar',
      className: 'hymn-progress',
      value: 1,
      max: 2
    });

    var artwork = DOM.img({
      ref: 'artwork',
      key: 'artwork',
      src: this.props.artwork,
      className: 'hymn-artwork'
    });

    var controls = DOM.div({
      ref: 'controls',
      key: 'controls',
      className: 'hymn-controls'
    }, [playPause, progressBar, skipButton]);

    var container = DOM.div({
      ref: 'container',
      className: 'hymn-player'
    }, [artwork, controls, audioTag]);
    return container;
  }
});

module.exports = Player;